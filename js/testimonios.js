// import servicios from '../data/servicios.json' assert { type: 'json' };
// import config from '../data/config.json' assert { type: 'json' };
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
    console.log('Contenedor de testimonios no encontrado');
    return;
  }
  
  try {
    console.log('Cargando testimonios...');
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
    
    console.log('HTML generado para testimonios:', html);
    
    container.innerHTML = html;
    console.log('Testimonios renderizados correctamente');
    
  } catch (error) {
    console.error('Error cargando testimonios:', error);
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
  console.log('Inicializando testimonios...');
  
  try {
    // Esperar un poco para que los componentes se carguen
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Renderizar testimonios
    await renderTestimonios();
    
    console.log('Testimonios inicializados correctamente');
  } catch (error) {
    console.error('Error inicializando testimonios:', error);
  }
}


