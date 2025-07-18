export async function renderHero() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;
  try {
    const res = await fetch('data/config.json');
    const config = await res.json();
    hero.innerHTML = `
      <h1 class="hero-title">${config.nombre}</h1>
      <div class="hero-eslogan">¡El cuidado profesional que tu auto merece!</div>
      <div class="hero-desc">
        Somos el lavadero premium de Sutatausa: atención al detalle, productos de alta calidad y la mejor atención.<br>
        <strong>Garantía, confianza y resultados impecables.</strong>
      </div>
      <a class="hero-btn" href="https://wa.me/${config.whatsapp}?text=Hola,%20quiero%20reservar%20un%20servicio%20de%20lavado%20en%20AUTO%20SPA%20PRO" target="_blank">Reserva ahora</a>
    `;
  } catch (e) {
    hero.innerHTML = `<div style="color:red;">Error cargando datos de configuración</div>`;
  }
}

// Función de inicialización para el sistema modular
export function initHero() {
  console.log('Inicializando hero section...');
  
  // Configurar funcionalidades del hero
  setupHeroFeatures();
}

// Configurar funcionalidades del hero
function setupHeroFeatures() {
  const heroSection = document.querySelector('.hero-section');
  
  if (heroSection) {
    // Configurar animaciones de entrada
    setupHeroAnimations();
    
    // Configurar botones de acción
    setupHeroButtons();
    
    // Configurar efectos de parallax
    setupHeroParallax();
    
    // Configurar contador de estadísticas
    setupHeroStats();
  }
}

// Configurar animaciones del hero
function setupHeroAnimations() {
  const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons, .hero-features');
  
  // Animación de entrada escalonada
  heroElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 200 * index);
  });
}

// Configurar botones del hero
function setupHeroButtons() {
  const heroButtons = document.querySelectorAll('.hero-buttons .btn');
  
  heroButtons.forEach(button => {
    // Efecto hover
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });
    
    // Click tracking
    button.addEventListener('click', () => {
      console.log('Hero button clicked:', button.textContent.trim());
    });
  });
}

// Configurar efectos de parallax
function setupHeroParallax() {
  const heroBackground = document.querySelector('.hero-background');
  
  if (heroBackground) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      heroBackground.style.transform = `translateY(${rate}px)`;
    });
  }
}

// Configurar contador de estadísticas
function setupHeroStats() {
  const statsElements = document.querySelectorAll('.hero-stats .stat-number');
  
  statsElements.forEach(element => {
    const target = parseInt(element.getAttribute('data-target') || '0');
    const duration = 2000; // 2 segundos
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  });
}

// Función para actualizar el hero dinámicamente
export function updateHeroContent(newTitle, newSubtitle, newDescription) {
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroDescription = document.querySelector('.hero-description');
  
  if (heroTitle && newTitle) {
    heroTitle.textContent = newTitle;
  }
  
  if (heroSubtitle && newSubtitle) {
    heroSubtitle.textContent = newSubtitle;
  }
  
  if (heroDescription && newDescription) {
    heroDescription.textContent = newDescription;
  }
}

// Función para mostrar un mensaje temporal en el hero
export function showHeroMessage(message, duration = 3000) {
  const heroSection = document.querySelector('.hero-section');
  
  if (heroSection) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'hero-message';
    messageDiv.innerHTML = `
      <div class="hero-message-content">
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
      </div>
    `;
    
    heroSection.appendChild(messageDiv);
    
    // Animación de entrada
    setTimeout(() => {
      messageDiv.style.opacity = '1';
      messageDiv.style.transform = 'translateY(0)';
    }, 100);
    
    // Remover después del tiempo especificado
    setTimeout(() => {
      messageDiv.style.opacity = '0';
      messageDiv.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        messageDiv.remove();
      }, 300);
    }, duration);
  }
}
