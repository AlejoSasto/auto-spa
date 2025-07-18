// import servicios from '../data/servicios.json' assert { type: 'json' };
// import config from '../data/config.json' assert { type: 'json' };

export async function renderServicios() {
  const container = document.getElementById('services-container'); // ✅ Usar el ID correcto
  if (!container) {
    console.log('Contenedor de servicios no encontrado');
    return;
  }
  
  try {
    console.log('Cargando servicios...');
    const [servRes, confRes] = await Promise.all([
      fetch('data/servicios.json'),
      fetch('data/config.json')
    ]);
    
    if (!servRes.ok || !confRes.ok) {
      throw new Error('Error al cargar datos');
    }
    
    const servicios = await servRes.json();
    const config = await confRes.json();

    let html = '';
    servicios.forEach(servicio => {
      html += `
        <div class="service-card">
          <div class="service-icon">
            <i class="fas fa-car-wash"></i>
          </div>
          <h3 class="service-title">${servicio.nombre || 'Servicio'}</h3>
          <p class="service-description">${servicio.descripcion || 'Descripción del servicio'}</p>
          <div class="service-price">$${servicio.precio || 'Consultar'}</div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    console.log('Servicios renderizados correctamente');
    
  } catch (error) {
    console.error('Error cargando servicios:', error);
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
          <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
          <p>Error al cargar los servicios. Por favor, intenta de nuevo.</p>
        </div>
      `;
    }
  }
}

// Función de inicialización para el sistema modular
export async function initServices() {
  console.log('Inicializando servicios...');
  
  // Esperar a que el componente esté cargado
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const container = document.getElementById('services-container');
    if (container) {
      console.log('Contenedor de servicios encontrado, renderizando...');
      break;
    }
    
    console.log(`Intento ${attempts + 1}: Esperando a que el componente de servicios se cargue...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    attempts++;
  }
  
  if (attempts >= maxAttempts) {
    console.error('No se pudo encontrar el contenedor de servicios después de varios intentos');
    return;
  }
  
  // Renderizar servicios
  await renderServicios();
  
  // Configurar interacciones de las tarjetas de servicio
  setupServiceCards();
}

// Configurar interacciones de las tarjetas de servicio
function setupServiceCards() {
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    // Efecto hover
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    });
    
    // Click para más información
    card.addEventListener('click', () => {
      const serviceName = card.querySelector('.service-title')?.textContent;
      if (serviceName) {
        showServiceDetails(serviceName);
      }
    });
  });
}

// Mostrar detalles del servicio
function showServiceDetails(serviceName) {
  // Crear modal o tooltip con detalles del servicio
  const modal = document.createElement('div');
  modal.className = 'service-modal';
  modal.innerHTML = `
    <div class="service-modal-content">
      <span class="service-modal-close">&times;</span>
      <h3>${serviceName}</h3>
      <p>Información detallada sobre este servicio...</p>
      <a href="#contacto" class="btn btn-primary">Solicitar Cotización</a>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Cerrar modal
  const closeBtn = modal.querySelector('.service-modal-close');
  closeBtn.addEventListener('click', () => {
    modal.remove();
  });
  
  // Cerrar al hacer clic fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  // Cerrar con Escape
  document.addEventListener('keydown', function closeOnEscape(e) {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', closeOnEscape);
    }
  });
}
