// Sistema de manejo de errores estandarizado para AUTO SPA PRO

// Configuración del sistema de errores
const ERROR_CONFIG = {
  // Tipos de errores
  TYPES: {
    VALIDATION: 'validation',
    NETWORK: 'network',
    RUNTIME: 'runtime',
    USER: 'user',
    SYSTEM: 'system'
  },
  
  // Niveles de severidad
  SEVERITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  },
  
  // Configuración de notificaciones
  NOTIFICATIONS: {
    DURATION: 5000,
    POSITION: 'top-right',
    AUTO_HIDE: true
  }
};

// Clase principal para manejo de errores
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.isInitialized = false;
    this.init();
  }

  // Inicializar el sistema de errores
  init() {
    if (this.isInitialized) return;
    
    // Configurar captura de errores globales
    this.setupGlobalErrorHandling();
    
    // Configurar captura de errores de promesas
    this.setupPromiseErrorHandling();
    
    // Configurar captura de errores de fetch
    this.setupFetchErrorHandling();
    
    this.isInitialized = true;
  }

  // Configurar manejo de errores globales
  setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
      this.handleError({
        type: ERROR_CONFIG.TYPES.RUNTIME,
        severity: ERROR_CONFIG.SEVERITY.HIGH,
        message: event.error?.message || 'Error de JavaScript',
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
  }

  // Configurar manejo de errores de promesas
  setupPromiseErrorHandling() {
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: ERROR_CONFIG.TYPES.RUNTIME,
        severity: ERROR_CONFIG.SEVERITY.HIGH,
        message: 'Promesa rechazada sin manejar',
        reason: event.reason,
        promise: event.promise
      });
    });
  }

  // Configurar manejo de errores de fetch
  setupFetchErrorHandling() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response;
      } catch (error) {
        this.handleError({
          type: ERROR_CONFIG.TYPES.NETWORK,
          severity: ERROR_CONFIG.SEVERITY.MEDIUM,
          message: 'Error de red',
          originalError: error,
          url: args[0]
        });
        throw error;
      }
    };
  }

  // Manejar un error
  handleError(errorData) {
    const error = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      ...errorData
    };

    // Agregar al log de errores
    this.errorLog.push(error);

    // Mostrar notificación al usuario si es necesario
    this.showUserNotification(error);

    // Log para desarrollo
    this.logError(error);

    // Enviar a servicio de monitoreo en producción
    this.sendToMonitoring(error);
  }

  // Generar ID único para el error
  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Mostrar notificación al usuario
  showUserNotification(error) {
    const shouldShow = this.shouldShowUserNotification(error);
    
    if (shouldShow) {
      const message = this.getUserFriendlyMessage(error);
      const type = this.getNotificationType(error.severity);
      
      // Usar el sistema de toast existente
      if (window.showToast) {
        window.showToast(message, type, ERROR_CONFIG.NOTIFICATIONS.DURATION);
      } else {
        // Fallback si no existe el sistema de toast
        this.showFallbackNotification(message, type);
      }
    }
  }

  // Determinar si se debe mostrar notificación al usuario
  shouldShowUserNotification(error) {
    // No mostrar errores de desarrollo en producción
    if (this.isDevelopment() && error.type === ERROR_CONFIG.TYPES.RUNTIME) {
      return false;
    }

    // Mostrar errores de validación y usuario
    if (error.type === ERROR_CONFIG.TYPES.VALIDATION || 
        error.type === ERROR_CONFIG.TYPES.USER) {
      return true;
    }

    // Mostrar errores de red de severidad media o alta
    if (error.type === ERROR_CONFIG.TYPES.NETWORK && 
        error.severity !== ERROR_CONFIG.SEVERITY.LOW) {
      return true;
    }

    // Mostrar errores críticos del sistema
    if (error.severity === ERROR_CONFIG.SEVERITY.CRITICAL) {
      return true;
    }

    return false;
  }

  // Obtener mensaje amigable para el usuario
  getUserFriendlyMessage(error) {
    const messages = {
      [ERROR_CONFIG.TYPES.VALIDATION]: 'Por favor verifica la información ingresada',
      [ERROR_CONFIG.TYPES.NETWORK]: 'Error de conexión. Por favor intenta nuevamente',
      [ERROR_CONFIG.TYPES.USER]: error.message || 'Ha ocurrido un error',
      [ERROR_CONFIG.TYPES.SYSTEM]: 'Error del sistema. Por favor recarga la página',
      [ERROR_CONFIG.TYPES.RUNTIME]: 'Error inesperado. Por favor recarga la página'
    };

    return messages[error.type] || 'Ha ocurrido un error inesperado';
  }

  // Obtener tipo de notificación basado en severidad
  getNotificationType(severity) {
    const types = {
      [ERROR_CONFIG.SEVERITY.LOW]: 'info',
      [ERROR_CONFIG.SEVERITY.MEDIUM]: 'warning',
      [ERROR_CONFIG.SEVERITY.HIGH]: 'error',
      [ERROR_CONFIG.SEVERITY.CRITICAL]: 'error'
    };

    return types[severity] || 'error';
  }

  // Mostrar notificación de fallback
  showFallbackNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `error-notification error-${type}`;
    notification.innerHTML = `
      <div class="error-content">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Agregar estilos si no existen
    if (!document.getElementById('error-notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'error-notification-styles';
      styles.textContent = `
        .error-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          padding: 16px;
          z-index: 10000;
          max-width: 300px;
          border-left: 4px solid;
        }
        .error-info { border-left-color: #007bff; }
        .error-warning { border-left-color: #ffc107; }
        .error-error { border-left-color: #dc3545; }
        .error-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .error-content button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: #666;
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, ERROR_CONFIG.NOTIFICATIONS.DURATION);
  }

  // Log del error para desarrollo
  logError(error) {
    if (this.isDevelopment()) {
      console.group(`🚨 Error [${error.type.toUpperCase()}] - ${error.severity.toUpperCase()}`);
      console.error('Mensaje:', error.message);
      console.error('ID:', error.id);
      console.error('Timestamp:', error.timestamp);
      if (error.stack) console.error('Stack:', error.stack);
      if (error.originalError) console.error('Error original:', error.originalError);
      console.groupEnd();
    }
  }

  // Enviar error a servicio de monitoreo
  sendToMonitoring(error) {
    // Aquí se puede integrar con servicios como Sentry, LogRocket, etc.
    if (this.isProduction()) {
      // Ejemplo de envío a servicio de monitoreo
      // this.sendToSentry(error);
    }
  }

  // Verificar si está en desarrollo
  isDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.protocol === 'file:';
  }

  // Verificar si está en producción
  isProduction() {
    return !this.isDevelopment();
  }

  // Métodos de conveniencia para diferentes tipos de errores
  validationError(message, field = null) {
    this.handleError({
      type: ERROR_CONFIG.TYPES.VALIDATION,
      severity: ERROR_CONFIG.SEVERITY.LOW,
      message,
      field
    });
  }

  networkError(message, url = null) {
    this.handleError({
      type: ERROR_CONFIG.TYPES.NETWORK,
      severity: ERROR_CONFIG.SEVERITY.MEDIUM,
      message,
      url
    });
  }

  userError(message) {
    this.handleError({
      type: ERROR_CONFIG.TYPES.USER,
      severity: ERROR_CONFIG.SEVERITY.LOW,
      message
    });
  }

  systemError(message, details = null) {
    this.handleError({
      type: ERROR_CONFIG.TYPES.SYSTEM,
      severity: ERROR_CONFIG.SEVERITY.HIGH,
      message,
      details
    });
  }

  criticalError(message, details = null) {
    this.handleError({
      type: ERROR_CONFIG.TYPES.SYSTEM,
      severity: ERROR_CONFIG.SEVERITY.CRITICAL,
      message,
      details
    });
  }

  // Obtener log de errores
  getErrorLog() {
    return [...this.errorLog];
  }

  // Limpiar log de errores
  clearErrorLog() {
    this.errorLog = [];
  }

  // Obtener estadísticas de errores
  getErrorStats() {
    const stats = {
      total: this.errorLog.length,
      byType: {},
      bySeverity: {},
      recent: this.errorLog.filter(error => {
        const errorDate = new Date(error.timestamp);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return errorDate > oneHourAgo;
      }).length
    };

    this.errorLog.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
    });

    return stats;
  }
}

// Instancia global del manejador de errores
const errorHandler = new ErrorHandler();

// Exportar funciones de conveniencia
export const ErrorHandlerUtils = {
  // Inicializar el sistema
  init: () => errorHandler.init(),
  
  // Métodos de conveniencia
  validation: (message, field) => errorHandler.validationError(message, field),
  network: (message, url) => errorHandler.networkError(message, url),
  user: (message) => errorHandler.userError(message),
  system: (message, details) => errorHandler.systemError(message, details),
  critical: (message, details) => errorHandler.criticalError(message, details),
  
  // Utilidades
  getLog: () => errorHandler.getErrorLog(),
  clearLog: () => errorHandler.clearErrorLog(),
  getStats: () => errorHandler.getErrorStats(),
  
  // Configuración
  config: ERROR_CONFIG
};

// Exportar la instancia principal
export default errorHandler;

// Hacer disponible globalmente para compatibilidad
window.ErrorHandler = errorHandler;
window.ErrorHandlerUtils = ErrorHandlerUtils; 