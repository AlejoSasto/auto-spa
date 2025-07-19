/**
 * AUTO SPA PRO - Aplicación Principal
 * Sistema modular de componentes
 */

import ComponentLoader from './component-loader.js';
import { initServices } from './servicios.js';
import { initGallery } from './galeria.js';
import { initTestimonials } from './testimonios.js';
import { initContact } from './contacto.js';
import { initWhatsApp } from './whatsapp.js';
import { initLocation } from './ubicacion.js';
import { initHero } from './hero.js';
import { initCarAnimation } from './car-animation.js';
import { initUtils } from './utils.js';
import { ErrorHandlerUtils } from './error-handler.js';

class AutoSpaApp {
  constructor() {
    this.componentLoader = new ComponentLoader();
    this.isInitialized = false;
  }

  /**
   * Inicializa la aplicación
   */
  async init() {
    try {
      // Ocultar pantalla de carga
      this.hideLoadingScreen();
      
      // Cargar componentes principales
      await this.loadMainComponents();
      
      // Inicializar funcionalidades
      await this.initializeFeatures();
      
      // Configurar eventos globales
      this.setupGlobalEvents();
      
      this.isInitialized = true;
      
    } catch (error) {
      ErrorHandlerUtils.critical('Error al inicializar la aplicación', error);
    }
  }

  /**
   * Oculta la pantalla de carga
   */
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 1000);
    }
  }

  /**
   * Carga los componentes principales
   */
  async loadMainComponents() {
    const components = [
      { name: 'mobile-menu', target: '#mobile-menu-container' },
      { name: 'header', target: '#header-container' },
      { name: 'hero-section', target: '#hero-container' },
      { name: 'car-animation', target: '#car-animation-container' },
      { name: 'services-section', target: '#services-section-container' },
      { name: 'gallery-section', target: '#gallery-section-container' },
      { name: 'testimonials-section', target: '#testimonials-section-container' },
      { name: 'location-section', target: '#location-section-container' },
      { name: 'contact-section', target: '#contact-section-container' },
      { name: 'whatsapp-float', target: '#whatsapp-container' },
      { name: 'footer', target: '#footer-container' }
    ];

    await this.componentLoader.loadComponents(components);
  }

  /**
   * Inicializa todas las funcionalidades
   */
  async initializeFeatures() {
    // Inicializar utilidades básicas
    initUtils();
    
    // Esperar un momento para asegurar que los componentes estén completamente cargados
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Inicializar secciones dinámicas
    await initServices();
    await initGallery();
    await initTestimonials();
    await initCarAnimation();
    
    // Inicializar funcionalidades interactivas
    initContact();
    initWhatsApp();
    await initLocation();
    initHero();
    
    // Configurar navegación móvil
    this.setupMobileNavigation();
  }

  /**
   * Configura la navegación móvil
   */
  setupMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu-links a');

    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.setAttribute('aria-hidden', isExpanded);
        mobileMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
      });

      // Cerrar menú al hacer clic en un enlace
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
          mobileToggle.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileMenu.setAttribute('aria-hidden', 'true');
        });
      });
    }
  }

  /**
   * Configura eventos globales
   */
  setupGlobalEvents() {
    // Smooth scrolling para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          const toggle = document.querySelector('.mobile-menu-toggle');
          if (toggle) {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
          }
          mobileMenu.setAttribute('aria-hidden', 'true');
        }
      }
    });

    // Lazy loading para imágenes
    this.setupLazyLoading();
  }

  /**
   * Configura lazy loading para imágenes
   */
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * Recarga un componente específico
   * @param {string} componentName - Nombre del componente
   * @param {string} targetSelector - Selector del objetivo
   */
  async reloadComponent(componentName, targetSelector) {
    await this.componentLoader.loadComponent(componentName, targetSelector);
  }

  /**
   * Obtiene el estado de la aplicación
   * @returns {Object} - Estado actual
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      componentsLoaded: this.componentLoader.components.size,
      timestamp: new Date().toISOString()
    };
  }
}

// Crear instancia global de la aplicación
window.autoSpaApp = new AutoSpaApp();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.autoSpaApp.init();
});

// Exportar para uso en otros módulos
export default window.autoSpaApp; 