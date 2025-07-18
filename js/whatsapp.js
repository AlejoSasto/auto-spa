// import servicios from '../data/servicios.json' assert { type: 'json' };
// import config from '../data/config.json' assert { type: 'json' };

export async function renderWhatsappFloat() {
  const cont = document.getElementById('whatsapp-float');
  if (!cont) return;
  
  try {
    const res = await fetch('data/config.json');
    const config = await res.json();
    
    cont.innerHTML = `
      <a href="https://wa.me/${config.whatsapp}?text=Hola,%20me%20interesa%20un%20servicio%20de%20lavado%20de%20auto%20en%20AUTO%20SPA%20PRO" 
         target="_blank" 
         rel="noopener noreferrer"
         class="whatsapp-btn">
        <i class="fab fa-whatsapp"></i>
      </a>
    `;
    
  } catch (e) {
    console.error('Error cargando WhatsApp:', e);
    // Fallback con número hardcodeado
    cont.innerHTML = `
      <a href="https://wa.me/573107505784?text=Hola,%20me%20interesa%20un%20servicio%20de%20lavado%20de%20auto%20en%20AUTO%20SPA%20PRO" 
         target="_blank" 
         rel="noopener noreferrer"
         class="whatsapp-btn">
        <i class="fab fa-whatsapp"></i>
      </a>
    `;
  }
}

// Función de inicialización para el sistema modular
export function initWhatsApp() {
  console.log('Inicializando WhatsApp...');
  
  // Renderizar botón flotante
  renderWhatsappFloat();
  
  // Configurar funcionalidades adicionales
  setupWhatsAppFeatures();
}

// Configurar funcionalidades de WhatsApp
function setupWhatsAppFeatures() {
  const whatsappFloat = document.getElementById('whatsapp-float');
  
  if (whatsappFloat) {
    // Efecto de pulso
    setInterval(() => {
      whatsappFloat.classList.add('pulse');
      setTimeout(() => {
        whatsappFloat.classList.remove('pulse');
      }, 1000);
    }, 3000);
    
    // Mostrar/ocultar basado en scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 500) {
        // Scrolling down - ocultar
        whatsappFloat.style.transform = 'translateY(100px)';
        whatsappFloat.style.opacity = '0';
      } else {
        // Scrolling up - mostrar
        whatsappFloat.style.transform = 'translateY(0)';
        whatsappFloat.style.opacity = '1';
      }
      
      lastScrollTop = scrollTop;
    });
    
    // Configurar transiciones CSS
    whatsappFloat.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    
    // Click tracking (opcional)
    const whatsappLink = whatsappFloat.querySelector('a');
    if (whatsappLink) {
      whatsappLink.addEventListener('click', () => {
        // Aquí podrías agregar analytics
        console.log('WhatsApp clicked');
      });
    }
  }
  
  // Crear enlaces de WhatsApp en otros lugares
  createWhatsAppLinks();
}

// Crear enlaces de WhatsApp en otros lugares
function createWhatsAppLinks() {
  // Buscar elementos que necesiten enlaces de WhatsApp
  const contactButtons = document.querySelectorAll('.btn-whatsapp, .contact-whatsapp');
  
  contactButtons.forEach(button => {
    if (!button.hasAttribute('data-whatsapp-configured')) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Obtener mensaje personalizado del botón
        const message = button.getAttribute('data-message') || 
                       'Hola, me interesa un servicio de lavado en AUTO SPA PRO';
        
        // Crear URL de WhatsApp
        const whatsappUrl = `https://wa.me/573107505784?text=${encodeURIComponent(message)}`;
        
        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank');
      });
      
      button.setAttribute('data-whatsapp-configured', 'true');
    }
  });
}

// Función para crear un enlace de WhatsApp dinámicamente
export function createWhatsAppLink(message = 'Hola, me interesa un servicio de lavado') {
  return `https://wa.me/573107505784?text=${encodeURIComponent(message)}`;
}

// Función para abrir WhatsApp con mensaje personalizado
export function openWhatsApp(message = 'Hola, me interesa un servicio de lavado') {
  const url = createWhatsAppLink(message);
  window.open(url, '_blank');
}
