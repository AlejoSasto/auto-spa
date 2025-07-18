/**
 * Component Loader - Sistema para cargar componentes HTML dinámicamente
 */

class ComponentLoader {
  constructor() {
    this.components = new Map();
  }

  /**
   * Carga un componente HTML desde un archivo
   * @param {string} componentName - Nombre del componente
   * @param {string} targetSelector - Selector donde insertar el componente
   * @returns {Promise<string>} - Contenido HTML del componente
   */
  async loadComponent(componentName, targetSelector) {
    try {
      const response = await fetch(`components/${componentName}.html`);
      if (!response.ok) {
        throw new Error(`Error al cargar el componente ${componentName}: ${response.status}`);
      }
      
      const html = await response.text();
      const target = document.querySelector(targetSelector);
      
      if (target) {
        target.innerHTML = html;
        this.components.set(componentName, html);
        return html;
      } else {
        throw new Error(`No se encontró el elemento objetivo: ${targetSelector}`);
      }
    } catch (error) {
      console.error('Error cargando componente:', error);
      return null;
    }
  }

  /**
   * Carga múltiples componentes en paralelo
   * @param {Array} components - Array de objetos {name, target}
   * @returns {Promise<Array>} - Array de resultados
   */
  async loadComponents(components) {
    const promises = components.map(comp => 
      this.loadComponent(comp.name, comp.target)
    );
    return Promise.all(promises);
  }

  /**
   * Inserta un componente en un elemento específico
   * @param {string} componentName - Nombre del componente
   * @param {string} targetSelector - Selector del elemento objetivo
   * @param {string} position - Posición de inserción ('beforebegin', 'afterbegin', 'beforeend', 'afterend')
   */
  async insertComponent(componentName, targetSelector, position = 'beforeend') {
    try {
      const response = await fetch(`components/${componentName}.html`);
      if (!response.ok) {
        throw new Error(`Error al cargar el componente ${componentName}: ${response.status}`);
      }
      
      const html = await response.text();
      const target = document.querySelector(targetSelector);
      
      if (target) {
        target.insertAdjacentHTML(position, html);
        this.components.set(componentName, html);
        return html;
      } else {
        throw new Error(`No se encontró el elemento objetivo: ${targetSelector}`);
      }
    } catch (error) {
      console.error('Error insertando componente:', error);
      return null;
    }
  }

  /**
   * Obtiene un componente del cache si existe
   * @param {string} componentName - Nombre del componente
   * @returns {string|null} - Contenido HTML del componente o null
   */
  getCachedComponent(componentName) {
    return this.components.get(componentName) || null;
  }

  /**
   * Limpia el cache de componentes
   */
  clearCache() {
    this.components.clear();
  }
}

// Exportar la clase para uso en otros módulos
export default ComponentLoader; 