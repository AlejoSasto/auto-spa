import { ErrorHandlerUtils } from './error-handler.js';

// js/galeria.js
const galeria = [
  // Imágenes
  { type: 'image', src: 'assets/img/img_1.webp', alt: 'Trabajo de detailing 1', highRes: 'assets/img/img_1.webp' },
  { type: 'image', src: 'assets/img/img_2.webp', alt: 'Trabajo de detailing 2', highRes: 'assets/img/img_2.webp' },
  { type: 'image', src: 'assets/img/img_3.webp', alt: 'Trabajo de detailing 3', highRes: 'assets/img/img_3.webp' },
  { type: 'image', src: 'assets/img/img_4.webp', alt: 'Trabajo de detailing 4', highRes: 'assets/img/img_4.webp' },
  { type: 'image', src: 'assets/img/img_5.webp', alt: 'Trabajo de detailing 5', highRes: 'assets/img/img_5.webp' },
  { type: 'image', src: 'assets/img/img_6.webp', alt: 'Trabajo de detailing 6', highRes: 'assets/img/img_6.webp' },
  { type: 'image', src: 'assets/img/img_7.webp', alt: 'Trabajo de detailing 7', highRes: 'assets/img/img_7.webp' },
  { type: 'image', src: 'assets/img/img_8.webp', alt: 'Trabajo de detailing 8', highRes: 'assets/img/img_8.webp' },
  { type: 'image', src: 'assets/img/img_9.webp', alt: 'Trabajo de detailing 9', highRes: 'assets/img/img_9.webp' },
  { type: 'image', src: 'assets/img/img_10.webp', alt: 'Trabajo de detailing 10', highRes: 'assets/img/img_10.webp' },
  { type: 'image', src: 'assets/img/img_11.webp', alt: 'Trabajo de detailing 11', highRes: 'assets/img/img_11.webp' },
  { type: 'image', src: 'assets/img/img_12.webp', alt: 'Trabajo de detailing 12', highRes: 'assets/img/img_12.webp' },
  // Videos - sin referencias a posters que no existen
  { type: 'video', src: 'assets/video/video_1.mp4', alt: 'Video de trabajo 1' },
  { type: 'video', src: 'assets/video/video_2.mp4', alt: 'Video de trabajo 2' },
  { type: 'video', src: 'assets/video/video_3.mp4', alt: 'Video de trabajo 3' },
  { type: 'video', src: 'assets/video/video_4.mp4', alt: 'Video de trabajo 4' }
];

let current = 0;
let isLightboxOpen = false;

export function renderGaleria() {
  const container = document.getElementById('gallery-container');
  if (!container) {
    ErrorHandlerUtils.system('Contenedor de galería no encontrado');
    return;
  }
  
  container.innerHTML = `
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
            <button class="gallery-zoom-btn" aria-label="Ampliar imagen">
              <i class="fas fa-expand-arrows-alt"></i>
            </button>
          </div>
        </div>
        
        <div class="gallery-thumbnails">
          <!-- Las miniaturas se cargarán dinámicamente -->
        </div>
      </div>
    </div>
    
    <!-- Lightbox Modal -->
    <div class="lightbox-modal" id="lightbox-modal">
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Cerrar">
          <i class="fas fa-times"></i>
        </button>
        <button class="lightbox-prev" aria-label="Anterior">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="lightbox-next" aria-label="Siguiente">
          <i class="fas fa-chevron-right"></i>
        </button>
        <div class="lightbox-media">
          <!-- Contenido del lightbox -->
        </div>
        <div class="lightbox-info">
          <span class="lightbox-counter">${current + 1} / ${galeria.length}</span>
          <span class="lightbox-type">${galeria[current].type === 'video' ? 'Video' : 'Imagen'}</span>
        </div>
      </div>
    </div>
  `;
  
  // Inicializar la galería después de renderizar
  setupGalleryFeatures();
}

// Función de inicialización para el sistema modular
export async function initGallery() {
  try {
    // Renderizar galería
    renderGaleria();
  } catch (error) {
    ErrorHandlerUtils.system('Error al inicializar galería', error);
  }
}

// Configurar funcionalidades de la galería
function setupGalleryFeatures() {
  // Crear galería interactiva
  createInteractiveGallery();
  
  // Configurar lightbox
  setupLightbox();
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
    // Usar una imagen por defecto si no existe el poster
    const posterImage = currentItem.poster || 'assets/img/img_1.webp';
    
    mainContent.innerHTML = `
      <div class="video-container">
        <video 
          src="${currentItem.src}" 
          alt="${currentItem.alt}"
          class="gallery-main-video"
          controls
          preload="metadata"
          poster="${posterImage}"
          playsinline
          muted
          loop
        >
          Tu navegador no soporta el elemento video.
        </video>
        <div class="video-overlay">
          <i class="fas fa-play-circle"></i>
        </div>
      </div>
    `;
    
    // Reproducir video automáticamente después de un pequeño delay
    setTimeout(() => {
      const video = mainContent.querySelector('.gallery-main-video');
      if (video) {
        video.play().catch(error => {
          console.log('No se pudo reproducir automáticamente:', error);
        });
      }
    }, 300);
  } else {
    mainContent.innerHTML = `
      <div class="image-container">
        <img 
          src="${currentItem.src}" 
          alt="${currentItem.alt}" 
          class="gallery-main-image"
          loading="lazy"
          data-high-res="${currentItem.highRes || currentItem.src}"
        >
        <div class="image-overlay">
          <i class="fas fa-search-plus"></i>
        </div>
      </div>
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
    
    // Para videos, usar una imagen por defecto si no existe el poster
    let thumbnailContent;
    if (item.type === 'video') {
      const posterImage = item.poster || 'assets/img/img_1.webp';
      thumbnailContent = `<video src="${item.src}" class="thumbnail-video" preload="metadata" poster="${posterImage}"></video>`;
    } else {
      thumbnailContent = `<img src="${item.src}" alt="${item.alt}" class="thumbnail-image" loading="lazy">`;
    }
    
    thumbnailsHTML += `
      <div class="gallery-thumbnail ${isActive ? 'active' : ''}" data-index="${index}">
        <div class="thumbnail-content">
          ${thumbnailContent}
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
  const zoomBtn = document.querySelector('.gallery-zoom-btn');
  const mainContent = document.querySelector('.gallery-main-content');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      // Pausar video actual antes de cambiar
      pauseCurrentVideo();
      current = (current - 1 + galeria.length) % galeria.length;
      updateGallery();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      // Pausar video actual antes de cambiar
      pauseCurrentVideo();
      current = (current + 1) % galeria.length;
      updateGallery();
    });
  }
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Pausar video actual antes de cambiar
      pauseCurrentVideo();
      current = parseInt(thumb.dataset.index);
      updateGallery();
    });
  });
  
  // Botón de zoom
  if (zoomBtn) {
    zoomBtn.addEventListener('click', () => {
      openLightbox();
    });
  }
  
  // Click en imagen para abrir lightbox
  if (mainContent) {
    mainContent.addEventListener('click', (e) => {
      if (e.target.closest('.image-container') || e.target.closest('.video-container')) {
        openLightbox();
      }
    });
  }
  
  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (isLightboxOpen) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        current = (current - 1 + galeria.length) % galeria.length;
        updateLightbox();
      } else if (e.key === 'ArrowRight') {
        current = (current + 1) % galeria.length;
        updateLightbox();
      }
    } else {
      if (e.key === 'ArrowLeft') {
        pauseCurrentVideo();
        current = (current - 1 + galeria.length) % galeria.length;
        updateGallery();
      } else if (e.key === 'ArrowRight') {
        pauseCurrentVideo();
        current = (current + 1) % galeria.length;
        updateGallery();
      }
    }
  });
  
  // Auto-play solo para imágenes (no videos)
  let autoPlayInterval = setInterval(() => {
    if (!isLightboxOpen) {
      const currentItem = galeria[current];
      if (currentItem.type === 'image') {
        pauseCurrentVideo();
        current = (current + 1) % galeria.length;
        updateGallery();
      }
    }
  }, 5000);
  
  // Pausar auto-play al hacer hover
  const galleryContainer = document.querySelector('.gallery-grid');
  if (galleryContainer) {
    galleryContainer.addEventListener('mouseenter', () => {
      clearInterval(autoPlayInterval);
    });
    
    galleryContainer.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(() => {
        if (!isLightboxOpen) {
          const currentItem = galeria[current];
          if (currentItem.type === 'image') {
            pauseCurrentVideo();
            current = (current + 1) % galeria.length;
            updateGallery();
          }
        }
      }, 5000);
    });
  }
}

// Función para pausar el video actual
function pauseCurrentVideo() {
  const currentVideo = document.querySelector('.gallery-main-video');
  if (currentVideo) {
    currentVideo.pause();
    currentVideo.currentTime = 0;
  }
}

// Configurar lightbox
function setupLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  const closeBtn = lightbox?.querySelector('.lightbox-close');
  const prevBtn = lightbox?.querySelector('.lightbox-prev');
  const nextBtn = lightbox?.querySelector('.lightbox-next');
  const overlay = lightbox?.querySelector('.lightbox-overlay');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      current = (current - 1 + galeria.length) % galeria.length;
      updateLightbox();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      current = (current + 1) % galeria.length;
      updateLightbox();
    });
  }
  
  if (overlay) {
    overlay.addEventListener('click', closeLightbox);
  }
}

// Abrir lightbox
function openLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  if (!lightbox) return;
  
  isLightboxOpen = true;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  updateLightbox();
}

// Cerrar lightbox
function closeLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  if (!lightbox) return;
  
  isLightboxOpen = false;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// Actualizar lightbox
function updateLightbox() {
  const lightboxMedia = document.querySelector('.lightbox-media');
  const lightboxCounter = document.querySelector('.lightbox-counter');
  const lightboxType = document.querySelector('.lightbox-type');
  
  if (!lightboxMedia) return;
  
  const currentItem = galeria[current];
  
  if (currentItem.type === 'video') {
    lightboxMedia.innerHTML = `
      <video 
        src="${currentItem.src}" 
        alt="${currentItem.alt}"
        class="lightbox-video"
        controls
        autoplay
        preload="metadata"
        poster="${currentItem.poster || ''}"
      >
        Tu navegador no soporta el elemento video.
      </video>
    `;
  } else {
    lightboxMedia.innerHTML = `
      <img 
        src="${currentItem.highRes || currentItem.src}" 
        alt="${currentItem.alt}" 
        class="lightbox-image"
        loading="lazy"
      >
    `;
  }
  
  if (lightboxCounter) lightboxCounter.textContent = `${current + 1} / ${galeria.length}`;
  if (lightboxType) lightboxType.textContent = currentItem.type === 'video' ? 'Video' : 'Imagen';
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
