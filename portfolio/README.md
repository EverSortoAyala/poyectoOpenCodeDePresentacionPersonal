# Portafolio Profesional - MAE. Ever Alfredo Sorto Ayala

## Qué es este proyecto

Este es un portafolio profesional desarrollado con tecnologías web puras (HTML5, CSS3, JavaScript) que presenta el perfil profesional de **MAE. Ever Alfredo Sorto Ayala**, un profesional que integra Ingeniería de Sistemas y Computación con Docencia Universitaria. El portafolio destaca áreas de especialización en tecnología aplicada a la educación, desarrollo de software y metodologías activas.

## Estructura de carpetas

```
portfolio/
│
├── index.html          # Estructura HTML semántica
│
├── css/
│   └── styles.css      # Diseño visual profesional
│
├── js/
│   └── script.js       # Lógica e interactividad
│
├── assets/
│   ├── images/         # Imágenes del portafolio
│   └── icons/          # Iconos
│
└── README.md           # Esta documentación
```

## Cómo ejecutar la página

1. Abrir `index.html` en cualquier navegador web
2. O simplemente arrastrar y soltar el archivo `index.html` sobre la ventana del navegador
3. La página funciona sin necesidad de servidor local ni dependencias externas

## Tecnologías utilizadas

- **HTML5**: Estructura semántica y accesibilidad
- **CSS3**: Diseño visual con Grid, Flexbox, animaciones discretas
- **JavaScript**: Lógica interactiva, consumo de API, manipulación DOM
- **API Picsum Photos**: API pública de imágenes sin requerir clave de autenticación

## Cómo funciona la API de imágenes

El proyecto utiliza la API pública **Picsum Photos** (`https://picsum.photos`) para cargar imágenes dinámicamente. Esta API:

- **No requiere clave de autenticación** - acceso público y gratuito
- Retorna imágenes aleatorias de alta calidad
- Soporta parámetros de ancho y alto (`/width/height/random`)
- Es ideal para demostraciones y portafolios

### Configuración en `js/script.js`

La configuración de la API está centralizada en el objeto `API_CONFIG`:

```javascript
const API_CONFIG = {
    baseUrl: 'https://picsum.photos',
    params: {
        width: 800,
        height: 400,
        random: ''
    }
}
```

Las imágenes del hero y la galería se cargan usando:

```javascript
async function cargarImagenDesdeAPI(imgElement, options = {}) {
    const width = options.width || API_CONFIG.params.width;
    const height = options.height || API_CONFIG.params.height;
    const url = `${API_CONFIG.baseUrl}/${width}/${height}/random`;
    imgElement.src = url;
}
```

### Manejo de errores

El código incluye manejo de errores robusto:

- Si una imagen no carga, se muestra un estilo alternativo
- Se mensajes de estado informan al usuario sobre el éxito o error
- El diseño nunca se rompe por una imagen rota

## Cómo cambiar las imágenes

### Imagen del Hero

1. Modificar las opciones en `js/script.js`:
   ```javascript
   // En la función inicializarPortafolio()
   const heroImg = document.getElementById('hero-image');
   if (heroImg) {
       cargarImagenDesdeAPI(heroImg, { width: 800, height: 400 });
   }
   ```

### Imágenes de la galería

1. Editar la función `cargarImagenesGalleria()` en `js/script.js`
2. Ajustar el número de imágenes (`for` loop) o los parámetros de tamaño
3. Las URLs de las imágenes se generan automáticamente desde Picsum Photos

### Usar imágenes propias

Para usar tus propias imágenes en la galería:

1. Reemplazar la generación de URLs en `cargarImagenesGalleria()`
2. O crear un array de URLs personalizadas y recorrerlo en lugar de usar la API
3. Mantener el mismo estructura HTML (`.gallery-card > img`)

## Cómo agregar nuevos proyectos

1. Agregar una nueva tarjeta en la sección de proyectos en `index.html`
2. La estructura de cada proyecto debe ser:

```html
<div class="project-card" data-categoria="categoría">
    <img class="project-image" src="URL-imagen" alt="Descripción">
    <div class="project-info">
        <h3>Título del Proyecto</h3>
        <span class="categoria">Categoría</span>
        <p>Descripción del proyecto.</p>
        <p class="tecnologias">Tecnologías usadas.</p>
        <a href="#" class="btn-ver-proyecto">Ver proyecto</a>
    </div>
</div>
```

3. Agregar el botón de filtro correspondiente en el CSS/HTML del filtro

## Cómo modificar información personal

### Datos del perfil (Hero section)

1. `index.html`:
   - Cambiar el texto del `h1`: `id="hero-title"` 
   - Cambiar el subtítulo: `id="hero-subtitle"`
   - Modificar la descripción: `id="hero-description"`
   - Actualizar la imagen: función `cargarImagenDesdeAPI()` en `script.js`

### Información "Sobre mí"

1. `index.html`:
   - Texto `id="about-text"` - párrafo principal
   - Texto `id="about-details"` - detalles de formación

### Áreas de especialización

1. `index.html` / `css/styles.css`:
   - Las tarjetas tienen clase `.area-card`
   - Los íconos se agregan con `<i>` (usar Font Awesome o SVG)
   - Título: `h3` dentro de cada tarjeta
   - Descripción: `p` dentro de cada tarjeta

### Tecnologías

1. `index.html` / `css/styles.css`:
   - Las tarjetas tienen clase `.tech-card`
   - Iconos e información se añaden en el CSS

### Formación académica

1. `index.html`:
   - La línea de tiempo usa `.formation-timeline::before` como línea vertical
   - Los ítems son `.timeline-item` con `::after` como punto redondo

### Experiencia docente

1. `index.html`:
   - Lista `.teaching-list` con ítems `<li>` por área

### Metodología educativa

1. `index.html` / `css/styles.css`:
   - Cuadros `.methodology-card` con título h3 y descripción p

### Galería

1. `js/script.js`:
   - La función `cargarImagenesGalleria()` controla las imágenes

### Contacto

1. `index.html`:
   - Modificar enlaces GitHub y LinkedIn
   - El formulario valida con JavaScript

### Footer

1. `index.html`:
   - El nombre: `id="footer-name"`
   - El año se genera automáticamente con JavaScript

## Configurar API con clave (futuro)

Si en el futuro decides cambiar a una API que requiera clave (como Unsplash con cuenta gratuita):

1. **NUNCA** introduzcas la API key directamente en el código HTML o en el repositorio público
2. Usa variables de entorno o un archivo de configuración separado
3. Ejemplo de patrón seguro:

```javascript
// En un archivo .env (nunca committed al repositorio)
API_KEY=tu_api_key_aqui

// En script.js - cargar de forma segura
const API_KEY = process.env.API_KEY || 'fallback-url';
```

Para este proyecto, la API de Picsum Photos no requiere clave, lo que la hace ideal para demostraciones sin exposición de credenciales.

## Personalizar según tus necesidades

1. **Perfil profesional**: Modifica los textos en `index.html` para reflejar tu formación real
2. **Colores**: Los colores principales están definidos en `:root` en `css/styles.css`
3. **Tipografía**: Cambiar la familia de fuentes en el selector `body` en `css/styles.css`
4. **Redes sociales**: Actualizar los enlaces en la sección de contacto
5. **Proyectos**: Agregar o remover proyectos según tu experiencia real