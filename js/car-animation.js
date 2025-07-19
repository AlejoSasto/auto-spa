import { ErrorHandlerUtils } from './error-handler.js';

/**
 * Car Animation 3D - Visualizador 3D de carro usando iframe
 */

class CarAnimation {
  constructor() {
    this.container = null;
    this.iframe = null;
    this.isInitialized = false;
  }

  /**
   * Inicializa la animación 3D del carro
   */
  async init() {
    try {
      this.container = document.getElementById('car-animation-canvas');
      if (!this.container) {
        ErrorHandlerUtils.system('Contenedor de animación no encontrado');
        return;
      }

      this.iframe = document.getElementById('sketchfab-viewer');
      
      if (this.iframe) {
        this.setupEvents();
        this.isInitialized = true;
      } else {
        ErrorHandlerUtils.system('No se encontró el iframe del visualizador');
      }
      
    } catch (error) {
      ErrorHandlerUtils.system('Error inicializando visualizador 3D', error);
    }
  }

  /**
   * Configura los eventos
   */
  setupEvents() {
    // Intersection Observer para optimizar carga
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // El iframe se cargará automáticamente cuando sea visible
          }
        });
      },
      { threshold: 0.1 }
    );

    if (this.container) {
      observer.observe(this.container);
    }

    // Evento de carga del iframe
    if (this.iframe) {
      this.iframe.addEventListener('load', () => {
        // Visualizador 3D cargado correctamente
      });

      this.iframe.addEventListener('error', () => {
        ErrorHandlerUtils.system('Error cargando visualizador 3D');
      });
    }
  }

  /**
   * Limpia los recursos
   */
  dispose() {
    if (this.iframe) {
      this.iframe.src = '';
    }
    
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Función de inicialización para el sistema modular
export async function initCarAnimation() {
  try {
    // Esperar a que el componente esté cargado
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      const container = document.getElementById('car-animation-canvas');
      if (container) {
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      ErrorHandlerUtils.system('No se pudo encontrar el contenedor de animación después de varios intentos');
      return;
    }
    
    const carAnimation = new CarAnimation();
    await carAnimation.init();
    
    // Guardar referencia global
    window.carAnimation = carAnimation;
  } catch (error) {
    ErrorHandlerUtils.system('Error al inicializar animación del carro', error);
  }
} 