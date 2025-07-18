export async function renderUbicacion() {
  const section = document.querySelector('.location-section');
  if (!section) return;
  
  try {
    const res = await fetch('data/config.json');
    const config = await res.json();
    
    // Actualizar solo la sección del mapa
    const mapContainer = section.querySelector('.map-container');
    if (mapContainer) {
      const address = encodeURIComponent(config.direccion);
      mapContainer.innerHTML = `
        <iframe 
          class="ubicacion-map"
          src="https://maps.google.com/maps?q=${address}&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style="border:0; border-radius: var(--border-radius-lg);"
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
          title="Ubicación AUTO SPA PRO en Google Maps">
        </iframe>
      `;
    }
  } catch (e) {
    console.error('Error cargando configuración:', e);
    // Fallback si no se puede cargar la configuración
    const mapContainer = section.querySelector('.map-container');
    if (mapContainer) {
      const address = encodeURIComponent('Cra. 5, Sutatausa, Cundinamarca');
      mapContainer.innerHTML = `
        <iframe 
          class="ubicacion-map"
          src="https://maps.google.com/maps?q=${address}&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style="border:0; border-radius: var(--border-radius-lg);"
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
          title="Ubicación AUTO SPA PRO en Google Maps">
        </iframe>
      `;
    }
  }
}

// Función de inicialización para el sistema modular
export async function initLocation() {
  console.log('Inicializando ubicación...');
  
  // Renderizar el mapa primero
  await renderUbicacion();
  
  // Configurar funcionalidades de ubicación
  setupLocationFeatures();
}

// Configurar funcionalidades de ubicación
function setupLocationFeatures() {
  // Configurar enlaces de teléfono
  setupPhoneLinks();
  
  // Configurar enlaces de dirección
  setupAddressLinks();
  
  // Configurar horarios dinámicos
  setupDynamicHours();
  
  // Configurar mapa interactivo
  setupInteractiveMap();
}

// Configurar enlaces de teléfono
function setupPhoneLinks() {
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  
  phoneLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Tracking de clicks en teléfono
      console.log('Phone link clicked:', link.href);
    });
  });
}

// Configurar enlaces de dirección
function setupAddressLinks() {
  const addressLinks = document.querySelectorAll('a[href*="maps.google.com"], .map-link');
  
  addressLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Tracking de clicks en dirección
      console.log('Address link clicked');
    });
  });
}

// Configurar horarios dinámicos
function setupDynamicHours() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  const hour = now.getHours();
  
  // Determinar si está abierto
  let isOpen = false;
  let statusText = '';
  
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    // Lunes a Viernes: 8:00 AM - 6:00 PM
    isOpen = hour >= 8 && hour < 18;
    statusText = isOpen ? 'Abierto ahora' : 'Cerrado';
  } else if (dayOfWeek === 6) {
    // Sábado: 7:00 AM - 5:00 PM
    isOpen = hour >= 7 && hour < 17;
    statusText = isOpen ? 'Abierto ahora' : 'Cerrado';
  } else {
    // Domingo: 7:00 AM - 5:00 PM
    isOpen = hour >= 7 && hour < 17;
    statusText = isOpen ? 'Abierto ahora' : 'Cerrado';
  }
  
  // Actualizar indicadores de estado
  const statusElements = document.querySelectorAll('.status-indicator, .open-status');
  statusElements.forEach(element => {
    element.textContent = statusText;
    element.className = `status-indicator ${isOpen ? 'open' : 'closed'}`;
  });
  
  // Actualizar cada 5 minutos
  setInterval(setupDynamicHours, 5 * 60 * 1000);
}

// Configurar mapa interactivo
function setupInteractiveMap() {
  const mapContainer = document.querySelector('.map-container, .ubicacion-map');
  
  if (mapContainer) {
    // Agregar botón para abrir en Google Maps
    const openInMapsBtn = document.createElement('button');
    openInMapsBtn.className = 'btn btn-secondary map-open-btn';
    openInMapsBtn.innerHTML = `
      <i class="fas fa-external-link-alt"></i>
      Abrir en Google Maps
    `;
    openInMapsBtn.addEventListener('click', () => {
      const address = 'Cra. 5, Sutatausa, Cundinamarca';
      const mapsUrl = `https://maps.google.com?q=${encodeURIComponent(address)}`;
      window.open(mapsUrl, '_blank');
    });
    
    // Insertar botón después del mapa
    mapContainer.parentNode.insertBefore(openInMapsBtn, mapContainer.nextSibling);
    
    // Configurar carga lazy del iframe
    const iframe = mapContainer.querySelector('iframe');
    if (iframe) {
      iframe.setAttribute('loading', 'lazy');
      
      // Mostrar placeholder mientras carga
      const placeholder = document.createElement('div');
      placeholder.className = 'map-placeholder';
      placeholder.innerHTML = `
        <i class="fas fa-map-marked-alt"></i>
        <p>Cargando mapa...</p>
      `;
      
      mapContainer.appendChild(placeholder);
      
      iframe.addEventListener('load', () => {
        placeholder.style.display = 'none';
      });
    }
  }
}

// Función para obtener la distancia desde una ubicación
export function getDistanceFromLocation(userLat, userLng) {
  // Coordenadas de AUTO SPA PRO (aproximadas)
  const spaLat = 5.2471;
  const spaLng = -73.8526;
  
  // Fórmula de Haversine para calcular distancia
  const R = 6371; // Radio de la Tierra en km
  const dLat = (spaLat - userLat) * Math.PI / 180;
  const dLng = (spaLng - userLng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userLat * Math.PI / 180) * Math.cos(spaLat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
}

// Función para obtener la ubicación del usuario
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no soportada'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = getDistanceFromLocation(latitude, longitude);
        resolve({ latitude, longitude, distance });
      },
      (error) => {
        reject(error);
      }
    );
  });
}
