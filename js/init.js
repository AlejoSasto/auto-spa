/**
 * Script de inicialización - Carga el sistema de manejo de errores antes que cualquier otro módulo
 */

// Importar el sistema de manejo de errores primero
import { ErrorHandlerUtils } from './error-handler.js';

// Función de inicialización principal
async function initializeApp() {
  try {
    // Inicializar el sistema de manejo de errores
    ErrorHandlerUtils.init();
    
    // Importar y ejecutar la aplicación principal
    const { default: autoSpaApp } = await import('./app.js');
    
    // Inicializar la aplicación
    await autoSpaApp.init();
    
  } catch (error) {
    // Si hay un error en la inicialización, usar el sistema de errores
    if (window.ErrorHandlerUtils) {
      ErrorHandlerUtils.critical('Error crítico durante la inicialización de la aplicación', error);
    } else {
      // Fallback si el sistema de errores no está disponible
      console.error('Error crítico durante la inicialización:', error);
      
      // Mostrar mensaje de error al usuario
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #dc3545;
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        z-index: 10000;
        max-width: 400px;
      `;
      errorDiv.innerHTML = `
        <h3>Error de Inicialización</h3>
        <p>Ha ocurrido un error al cargar la aplicación. Por favor, recarga la página.</p>
        <button onclick="location.reload()" style="
          background: white;
          color: #dc3545;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        ">Recargar Página</button>
      `;
      document.body.appendChild(errorDiv);
    }
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Exportar para uso en otros módulos
export { initializeApp }; 