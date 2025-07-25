import { ErrorHandlerUtils } from './error-handler.js';

export async function renderTestimonios() {
  // Buscar el contenedor correcto - puede estar en diferentes lugares
  let container = document.getElementById('testimonials-container');
  
  // Si no encuentra el contenedor por ID, buscar por clase
  if (!container) {
    container = document.querySelector('.testimonials-slider');
  }
  
  // Si aún no encuentra, buscar en la sección de testimonios
  if (!container) {
    const testimonialsSection = document.querySelector('#testimonios .testimonials-slider');
    if (testimonialsSection) {
      container = testimonialsSection;
    }
  }
  
  // Si aún no encuentra, buscar en el contenedor de testimonios
  if (!container) {
    container = document.querySelector('#testimonials-container');
  }
  
  if (!container) {
    ErrorHandlerUtils.system('Contenedor de testimonios no encontrado');
    return;
  }
  
  try {
    const [testRes, confRes] = await Promise.all([
      fetch('data/testimonios.json'),
      fetch('data/config.json')
    ]);
    
    if (!testRes.ok || !confRes.ok) {
      throw new Error('Error al cargar datos');
    }
    
    const testimonios = await testRes.json();
    const config = await confRes.json();
    
    let html = '';
    testimonios.slice(0, 4).forEach((testimonio, index) => {
      html += `
        <div class="testimonial-card" data-index="${index}">
          <div class="testimonial-rating">${'★'.repeat(testimonio.rating || 5)}</div>
          <div class="testimonial-text">"${testimonio.comentario || 'Excelente servicio'}"</div>
          <div class="testimonial-author">
            <div class="testimonial-avatar">
              ${(testimonio.nombre || 'Cliente').charAt(0).toUpperCase()}
            </div>
            <div class="testimonial-info">
              <h4>${testimonio.nombre || 'Cliente Satisfecho'}</h4>
              <p>Cliente Verificado</p>
            </div>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    
  } catch (error) {
    ErrorHandlerUtils.system('Error al cargar testimonios', error);
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
          <i class="fas fa-comments" style="font-size: 2rem; margin-bottom: 1rem;"></i>
          <p>Próximamente testimonios de nuestros clientes</p>
        </div>
      `;
    }
  }
}

// Función de inicialización para el sistema modular
export async function initTestimonials() {
  try {
    // Esperar un poco para que los componentes se carguen
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Renderizar testimonios
    await renderTestimonios();
  } catch (error) {
    ErrorHandlerUtils.system('Error al inicializar testimonios', error);
  }
}


