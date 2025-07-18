// Utilidades generales para el sistema modular

// Función de inicialización para el sistema modular
export function initUtils() {
  console.log('Inicializando utilidades...');
  
  // Configurar utilidades básicas
  setupBasicUtils();
  
  // Configurar utilidades de accesibilidad
  setupAccessibilityUtils();
  
  // Configurar utilidades de rendimiento
  setupPerformanceUtils();
}

// Configurar utilidades básicas
function setupBasicUtils() {
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
  
  // Prevenir envío de formularios vacíos
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        showToast('Por favor completa todos los campos requeridos', 'error');
      }
    });
  });
}

// Configurar utilidades de accesibilidad
function setupAccessibilityUtils() {
  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    // Escape para cerrar modales/menús
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal, .mobile-menu.active');
      modals.forEach(modal => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      });
    }
    
    // Tab para navegación
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  // Remover clase de navegación por teclado al hacer clic
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
  
  // Focus visible para elementos enfocables
  const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  
  focusableElements.forEach(element => {
    element.addEventListener('focus', () => {
      element.classList.add('focus-visible');
    });
    
    element.addEventListener('blur', () => {
      element.classList.remove('focus-visible');
    });
  });
}

// Configurar utilidades de rendimiento
function setupPerformanceUtils() {
  // Lazy loading para imágenes
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
  
  // Debounce para eventos de scroll
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Ejecutar código después de que el scroll se detenga
      handleScrollEnd();
    }, 150);
  });
}

// Manejar fin de scroll
function handleScrollEnd() {
  // Aquí puedes agregar lógica que se ejecute cuando el scroll termine
  console.log('Scroll ended');
}

// Función para mostrar toast/notificaciones
export function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-${getToastIcon(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="toast-close" aria-label="Cerrar notificación">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Agregar estilos CSS si no existen
  if (!document.getElementById('toast-styles')) {
    const styles = document.createElement('style');
    styles.id = 'toast-styles';
    styles.textContent = `
      .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 16px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
      }
      .toast.show {
        transform: translateX(0);
      }
      .toast-info { border-left: 4px solid #007bff; }
      .toast-success { border-left: 4px solid #28a745; }
      .toast-error { border-left: 4px solid #dc3545; }
      .toast-warning { border-left: 4px solid #ffc107; }
      .toast-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: #666;
      }
    `;
    document.head.appendChild(styles);
  }
  
  document.body.appendChild(toast);
  
  // Mostrar toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  // Configurar botón de cerrar
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    hideToast(toast);
  });
  
  // Auto-ocultar
  setTimeout(() => {
    hideToast(toast);
  }, duration);
}

// Ocultar toast
function hideToast(toast) {
  toast.classList.remove('show');
  setTimeout(() => {
    toast.remove();
  }, 300);
}

// Obtener icono para toast
function getToastIcon(type) {
  const icons = {
    info: 'info-circle',
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle'
  };
  return icons[type] || 'info-circle';
}

// Función para formatear números
export function formatNumber(num) {
  return new Intl.NumberFormat('es-CO').format(num);
}

// Función para formatear precios
export function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(price);
}

// Función para validar email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para validar teléfono
export function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
}

// Función para debounce
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Función para throttle
export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
