// js/galeria.js
const galeria = [
  // Imágenes
  { type: 'image', src: 'assets/img/img_1.webp', alt: 'Trabajo de detailing 1' },
  { type: 'image', src: 'assets/img/img_2.webp', alt: 'Trabajo de detailing 2' },
  { type: 'image', src: 'assets/img/img_3.webp', alt: 'Trabajo de detailing 3' },
  { type: 'image', src: 'assets/img/img_4.webp', alt: 'Trabajo de detailing 4' },
  { type: 'image', src: 'assets/img/img_5.webp', alt: 'Trabajo de detailing 5' },
  { type: 'image', src: 'assets/img/img_6.webp', alt: 'Trabajo de detailing 6' },
  { type: 'image', src: 'assets/img/img_7.webp', alt: 'Trabajo de detailing 7' },
  { type: 'image', src: 'assets/img/img_8.webp', alt: 'Trabajo de detailing 8' },
  { type: 'image', src: 'assets/img/img_9.webp', alt: 'Trabajo de detailing 9' },
  { type: 'image', src: 'assets/img/img_10.webp', alt: 'Trabajo de detailing 10' },
  { type: 'image', src: 'assets/img/img_11.webp', alt: 'Trabajo de detailing 11' },
  { type: 'image', src: 'assets/img/img_12.webp', alt: 'Trabajo de detailing 12' },
  // Videos
  { type: 'video', src: 'assets/video/video_1.mp4', alt: 'Video de trabajo 1' },
  { type: 'video', src: 'assets/video/video_2.mp4', alt: 'Video de trabajo 2' },
  { type: 'video', src: 'assets/video/video_3.mp4', alt: 'Video de trabajo 3' },
  { type: 'video', src: 'assets/video/video_4.mp4', alt: 'Video de trabajo 4' }
];

let current = 0;

export function renderGaleria() {
  const section = document.querySelector('.gallery-section');
  if (!section) {
    console.log('Sección galería no encontrada');
    return;
  }
  
  console.log('Renderizando galería...');
  
  section.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Galería de Trabajos</h2>
        <p class="section-subtitle">Mira los resultados de nuestros servicios profesionales</p>
      </div>
      <div class="gallery-content">
        <div class="gallery-grid">
          <div class="gallery-controls">
            <button class="gallery-btn gallery-prev" aria-label="Elemento anterior">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="gallery-btn gallery-next" aria-label="Siguiente elemento">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          <div class="gallery-main">
            <div class="gallery-main-content">
              <!-- El contenido principal se cargará dinámicamente -->
            </div>
            <div class="gallery-info">
              <span class="gallery-counter">${current + 1} / ${galeria.length}</span>
              <span class="gallery-type">${galeria[current].type === 'video' ? 'Video' : 'Imagen'}</span>
            </div>
          </div>
          <div class="gallery-thumbnails">
            <!-- Las miniaturas se cargarán dinámicamente -->
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Inicializar la galería después de renderizar
  setupGalleryFeatures();
}

// Función de inicialización para el sistema modular
export async function initGallery() {
  console.log('Inicializando galería...');
  
  // Renderizar galería
  renderGaleria();
}

// Configurar funcionalidades de la galería
function setupGalleryFeatures() {
  // Crear galería interactiva
  createInteractiveGallery();
}

// Crear galería interactiva
function createInteractiveGallery() {
  if (galeria.length === 0) {
    return;
  }
  
  // Actualizar contenido principal
  updateMainContent();
  
  // Crear miniaturas
  createThumbnails();
  
  // Configurar eventos
  setupGalleryEvents();
}

// Actualizar contenido principal
function updateMainContent() {
  const mainContent = document.querySelector('.gallery-main-content');
  const counter = document.querySelector('.gallery-counter');
  const typeIndicator = document.querySelector('.gallery-type');
  
  if (!mainContent) return;
  
  const currentItem = galeria[current];
  
  if (currentItem.type === 'video') {
    mainContent.innerHTML = `
      <video 
        src="${currentItem.src}" 
        alt="${currentItem.alt}"
        class="gallery-main-video"
        controls
        preload="metadata"
        poster=""
      >
        Tu navegador no soporta el elemento video.
      </video>
    `;
  } else {
    mainContent.innerHTML = `
      <img 
        src="${currentItem.src}" 
        alt="${currentItem.alt}" 
        class="gallery-main-image"
        loading="lazy"
      >
    `;
  }
  
  // Actualizar contador y tipo
  if (counter) counter.textContent = `${current + 1} / ${galeria.length}`;
  if (typeIndicator) typeIndicator.textContent = currentItem.type === 'video' ? 'Video' : 'Imagen';
}

// Crear miniaturas
function createThumbnails() {
  const thumbnailsContainer = document.querySelector('.gallery-thumbnails');
  if (!thumbnailsContainer) return;
  
  let thumbnailsHTML = '';
  
  galeria.forEach((item, index) => {
    const isActive = index === current;
    const typeIcon = item.type === 'video' ? 'fas fa-play' : 'fas fa-image';
    
    thumbnailsHTML += `
      <div class="gallery-thumbnail ${isActive ? 'active' : ''}" data-index="${index}">
        <div class="thumbnail-content">
          ${item.type === 'video' ? 
            `<video src="${item.src}" class="thumbnail-video" preload="metadata"></video>` :
            `<img src="${item.src}" alt="${item.alt}" class="thumbnail-image" loading="lazy">`
          }
          <div class="thumbnail-overlay">
            <i class="${typeIcon}"></i>
          </div>
        </div>
      </div>
    `;
  });
  
  thumbnailsContainer.innerHTML = thumbnailsHTML;
}

// Configurar eventos de la galería
function setupGalleryEvents() {
  const prevBtn = document.querySelector('.gallery-prev');
  const nextBtn = document.querySelector('.gallery-next');
  const thumbnails = document.querySelectorAll('.gallery-thumbnail');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      current = (current - 1 + galeria.length) % galeria.length;
      updateGallery();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      current = (current + 1) % galeria.length;
      updateGallery();
    });
  }
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      current = parseInt(thumb.dataset.index);
      updateGallery();
    });
  });
  
  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      current = (current - 1 + galeria.length) % galeria.length;
      updateGallery();
    } else if (e.key === 'ArrowRight') {
      current = (current + 1) % galeria.length;
      updateGallery();
    }
  });
  
  // Auto-play solo para imágenes (no videos)
  let autoPlayInterval = setInterval(() => {
    const currentItem = galeria[current];
    if (currentItem.type === 'image') {
      current = (current + 1) % galeria.length;
      updateGallery();
    }
  }, 4000);
  
  // Pausar auto-play al hacer hover
  const galleryContainer = document.querySelector('.gallery-grid');
  if (galleryContainer) {
    galleryContainer.addEventListener('mouseenter', () => {
      clearInterval(autoPlayInterval);
    });
    
    galleryContainer.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(() => {
        const currentItem = galeria[current];
        if (currentItem.type === 'image') {
          current = (current + 1) % galeria.length;
          updateGallery();
        }
      }, 4000);
    });
  }
}

// Actualizar galería
function updateGallery() {
  updateMainContent();
  updateThumbnails();
}

// Actualizar miniaturas
function updateThumbnails() {
  const thumbnails = document.querySelectorAll('.gallery-thumbnail');
  
  thumbnails.forEach((thumb, index) => {
    if (index === current) {
      thumb.classList.add('active');
    } else {
      thumb.classList.remove('active');
    }
  });
}
