# �� AUTO SPA PRO - Sitio Web Profesional

Sitio web moderno y responsive para AUTO SPA PRO, un negocio de lavado de autos en Sutatausa, Cundinamarca.

## 🌟 Características

### ✨ **Diseño y UX**
- **Diseño responsive** que se adapta a todos los dispositivos
- **Interfaz moderna** con animaciones suaves
- **Navegación intuitiva** con menú móvil
- **Accesibilidad** optimizada (WCAG 2.1)

### 🎨 **Secciones Principales**
- **Hero Section** con llamadas a la acción
- **Servicios** con precios y características
- **Galería** interactiva de trabajos realizados
- **Testimonios** de clientes satisfechos
- **Ubicación** con mapa de Google Maps
- **Contacto** con formulario funcional

### 🔧 **Funcionalidades Avanzadas**
- **Formulario de contacto** con EmailJS
- **WhatsApp automático** para reservas
- **Galería de imágenes y videos** con navegación
- **Mapa interactivo** embebido
- **Botón flotante** de WhatsApp
- **Animaciones CSS** profesionales

## 🚀 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES6+** - Funcionalidad interactiva
- **Font Awesome** - Iconografía
- **Google Fonts** - Tipografías
- **EmailJS** - Envío de emails
- **Google Maps** - Integración de mapas

## �� Estructura del Proyecto

```
auto-spa/
├── assets/
│   ├── img/          # Imágenes de la galería
│   └── video/        # Videos de trabajos
├── components/       # Componentes HTML modulares
├── css/             # Estilos CSS
├── data/            # Archivos de configuración JSON
├── js/              # Scripts JavaScript
├── index.html       # Página principal
└── README.md        # Este archivo
```

## 🛠️ Instalación y Configuración

### 1. **Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd auto-spa
```

### 2. **Servidor local**
Puedes usar cualquier servidor local:

**Con Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Con Node.js:**
```bash
npx serve .
```

**Con PHP:**
```bash
php -S localhost:8000
```

### 3. **Abrir en el navegador**
```
http://localhost:8000
```

## ⚙️ Configuración

### 📧 **EmailJS (Formulario de Contacto)**

1. **Crear cuenta** en [EmailJS.com](https://www.emailjs.com/)
2. **Configurar servicio** de email (Gmail recomendado)
3. **Crear plantilla** de email (ver `EMAILJS_SETUP.md`)
4. **Actualizar configuración** en `data/config.json`:

```json
{
  "emailjs": {
    "serviceId": "tu_service_id",
    "templateId": "tu_template_id",
    "userId": "tu_user_id"
  }
}
```

###  **WhatsApp**
- **Número configurado:** 3107505784
- **Mensaje predefinido** incluido
- **Botón flotante** funcional

### ️ **Google Maps**
- **Ubicación:** Cra. 5, Sutatausa, Cundinamarca
- **Mapa embebido** sin necesidad de API key
- **Botón "Ver en Google Maps"** funcional

## 🎨 Personalización

### **Colores y Estilos**
Los colores principales están definidos en `css/styles.css`:

```css
:root {
  --primary-color: #3b82f6;    /* Azul principal */
  --secondary-color: #1d4ed8;  /* Azul oscuro */
  --accent-color: #25d366;     /* Verde WhatsApp */
  --text-primary: #1f2937;     /* Texto principal */
  --text-secondary: #6b7280;   /* Texto secundario */
}
```

### **Contenido**
- **Servicios:** Editar `data/servicios.json`
- **Testimonios:** Editar `data/testimonios.json`
- **Configuración general:** Editar `data/config.json`

### **Imágenes y Videos**
- **Galería:** Agregar archivos en `assets/img/` y `assets/video/`
- **Formatos soportados:** JPG, PNG, WebP, MP4, WebM
- **Optimización:** Recomendado comprimir imágenes para web

## 📱 Responsive Design

El sitio está optimizado para:
- **Desktop:** 1200px+
- **Tablet:** 768px - 1199px
- **Mobile:** 320px - 767px

## 🔧 Funcionalidades JavaScript

### **Módulos Principales**
- `app.js` - Aplicación principal
- `component-loader.js` - Cargador de componentes
- `contacto.js` - Formulario de contacto
- `galeria.js` - Galería interactiva
- `servicios.js` - Gestión de servicios
- `testimonios.js` - Slider de testimonios
- `ubicacion.js` - Integración de mapas
- `whatsapp.js` - Funcionalidades de WhatsApp

### **Características**
- **Carga modular** de componentes
- **Validación de formularios** en tiempo real
- **Animaciones** suaves y profesionales
- **Gestión de errores** robusta

##  Despliegue

### **Opciones de Hosting**
- **Netlify** - Drag & drop del proyecto
- **Vercel** - Integración con Git
- **GitHub Pages** - Hosting gratuito
- **Firebase Hosting** - Hosting de Google

### **Pasos para Despliegue**
1. **Subir archivos** al servidor
2. **Configurar dominio** (opcional)
3. **Verificar EmailJS** en producción
4. **Probar funcionalidades** principales

##  Solución de Problemas

### **Problemas Comunes**

**Formulario no envía emails:**
- Verificar configuración de EmailJS
- Revisar consola del navegador
- Confirmar que el servicio esté activo

**Galería no carga:**
- Verificar rutas de archivos
- Comprobar formatos de imagen/video
- Revisar permisos de archivos

**Mapa no aparece:**
- Verificar conexión a internet
- Revisar bloqueadores de contenido
- Comprobar configuración de Google Maps

## 📞 Soporte

Para soporte técnico o consultas:
- **Email:** sastoque42@gmail.com
- **WhatsApp:** 3107505784

## 📄 Licencia

Este proyecto es propiedad de AUTO SPA PRO. Todos los derechos reservados.

##  Agradecimientos

- **Font Awesome** por los iconos
- **Google Fonts** por las tipografías
- **EmailJS** por el servicio de emails
- **Google Maps** por la integración de mapas

---

**Desarrollado con ❤️ para AUTO SPA PRO**
```

Ahora voy a crear el archivo `.gitignore`:

```gitignore:.gitignore
# Dependencias
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Archivos de configuración local
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Archivos de sistema
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Archivos de IDE/Editor
.vscode/
.idea/
*.swp
*.swo
*~

# Archivos de log
*.log
logs/

# Archivos temporales
*.tmp
*.temp
.cache/

# Archivos de build
dist/
build/
out/

# Archivos de backup
*.bak
*.backup
*.old

# Archivos de configuración específicos del proyecto
# Descomenta si necesitas ignorar configuraciones locales
# data/config.local.json

# Archivos de EmailJS (si se generan automáticamente)
# .emailjs/

# Archivos de Google Analytics (si se usan)
# google-analytics.js

# Archivos de SEO (si se generan automáticamente)
# sitemap.xml
# robots.txt

# Archivos de compresión
*.zip
*.tar.gz
*.rar

# Archivos de documentación temporal
*.md~
*.txt~

# Archivos de prueba
test/
tests/
__tests__/
*.test.js
*.spec.js

# Archivos de coverage
coverage/
.nyc_output/

# Archivos de linting
.eslintcache
.stylelintcache

# Archivos de TypeScript (si se migra en el futuro)
*.tsbuildinfo

# Archivos de Sass/SCSS (si se migra en el futuro)
*.sass
*.scss

# Archivos de Less (si se migra en el futuro)
*.less

# Archivos de PostCSS (si se migra en el futuro)
.postcssrc.js
postcss.config.js

# Archivos de Webpack (si se migra en el futuro)
webpack.config.js
webpack.mix.js

# Archivos de Babel (si se migra en el futuro)
.babelrc
babel.config.js

# Archivos de ESLint (si se migra en el futuro)
.eslintrc.js
.eslintrc.json

# Archivos de Prettier (si se migra en el futuro)
.prettierrc
.prettierrc.js

# Archivos de EditorConfig (si se migra en el futuro)
.editorconfig

# Archivos de Git hooks
.git/hooks/

# Archivos de configuración de servidor
.htaccess
nginx.conf
apache.conf

# Archivos de certificados SSL
*.pem
*.key
*.crt
*.csr

# Archivos de base de datos (si se agrega en el futuro)
*.db
*.sqlite
*.sqlite3

# Archivos de caché del navegador
.cache/
.browser-cache/

# Archivos de optimización de imágenes
optimized-images/
compressed-images/

# Archivos de backup de configuración
config.backup.json
config.old.json

# Archivos de desarrollo local
local-config.json
dev-config.json

# Archivos de staging
staging-config.json

# Archivos de producción
prod-config.json
```

## ✅ **Archivos creados:**

###  **README.md**
- **Descripción completa** del proyecto
- **Instrucciones de instalación** y configuración
- **Documentación técnica** detallada
- **Guía de personalización**
- **Solución de problemas** comunes
- **Información de contacto**

### 🚫 **.gitignore**
- **Archivos de sistema** (Windows, Mac, Linux)
- **Dependencias** y módulos
- **Archivos de configuración** sensibles
- **Archivos temporales** y de caché
- **Archivos de IDE/Editor**
- **Archivos de build** y distribución
- **Preparado para futuras tecnologías** (TypeScript, Sass, etc.)

##  **Beneficios:**

1. **Documentación profesional** para el proyecto
2. **Fácil onboarding** para nuevos desarrolladores
3. **Protección de archivos** sensibles en Git
4. **Guía de configuración** paso a paso
5. **Solución de problemas** documentada

¿Te gustaría que ajuste algo específico en el README o en el .gitignore? 