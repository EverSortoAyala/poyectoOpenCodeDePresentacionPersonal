const API_CONFIG = {
    baseUrl: 'https://picsum.photos',
    params: {
        width: 800,
        height: 400,
        random: ''
    }
};

/**
 * Carga una imagen desde la API pública y la establece en un elemento img
 * @param {HTMLElement} imgElement - El elemento img donde cargar la imagen
 * @param {Object} options - Opciones de la API
 */
async function cargarImagenDesdeAPI(imgElement, options = {}) {
    const width = options.width || API_CONFIG.params.width;
    const height = options.height || API_CONFIG.params.height;
    
    imgElement.style.background = 'var(--border-color)';
    imgElement.style.transition = 'background 0.3s ease';
    
    try {
        const url = `${API_CONFIG.baseUrl}/${width}/${height}/random`;
        imgElement.src = url;
        
        // Esperar a que la imagen se cargue
        await new Promise((resolve, reject) => {
            imgElement.onload = resolve;
            imgElement.onerror = () => {
                imgElement.src = '';
                imgElement.style.background = 'var(--bg-color)';
                reject(new Error('Error cargando imagen'));
            };
        });
        
        mostrarEstado('carga-exitosa', 'Imagen cargada correctamente');
        return true;
    } catch (error) {
        manejarErrorImagen(imgElement);
        mostrarEstado('error-carga', 'No se pudieron cargar las imágenes. Intente nuevamente.');
        console.error('Error al cargar imagen:', error);
        return false;
    }
}

/**
 * Maneja el error cuando una imagen no carga
 * @param {HTMLElement} imgElement - El elemento img con error
 */
function manejarErrorImagen(imgElement) {
    imgElement.onerror = null;
    imgElement.src = '';
    imgElement.style.background = 'var(--bg-color)';
    imgElement.style.border = '2px dashed var(--text-light)';
    imgElement.alt = 'Imagen no disponible';
}

/**
 * Muestra un mensaje de estado en la UI
 * @param {string} type - Tipo de mensaje (carga-exitosa, error-carga)
 * @param {string} message - Mensaje a mostrar
 */
function mostrarEstado(type, message) {
    const existingMessage = document.querySelector('.api-status');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const statusDiv = document.createElement('div');
    statusDiv.className = `api-status api-status--${type}`;
    statusDiv.textContent = message;
    statusDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-size: 1.5rem;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'carga-exitosa') {
        statusDiv.style.background = 'var(--accent-color)';
    } else {
        statusDiv.style.background = '#e74c3c';
    }
    
    document.body.appendChild(statusDiv);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (statusDiv.parentElement) {
            statusDiv.remove();
        }
    }, 5000);
}

/**
 * Animación de entrada para secciones
 */
function animarSecciones() {
    const observables = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    observables.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

/**
 * Menú móvil
 */
function inicializarMenuMovil() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (!menuToggle || !navList) return;
    
    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
        });
    });
}

/**
 * Botón para volver arriba
 */
function inicializarBotonVolverArriba() {
    const botonArriba = document.createElement('button');
    botonArriba.className = 'btn-volver-arriba';
    botonArriba.innerHTML = '↑';
    botonArriba.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent-color);
        color: var(--bg-color);
        font-size: 2rem;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 100;
    `;
    document.body.appendChild(botonArriba);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            botonArriba.style.display = 'flex';
        } else {
            botonArriba.style.display = 'none';
        }
    });
    
    botonArriba.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });
}

/**
 * Modal de imágenes
 */
function inicializarModalImagenes() {
    const galleryImages = document.querySelectorAll('.gallery-card img');
    const modal = document.createElement('div');
    const modalImg = document.createElement('img');
    const prevBtn = document.createElement('button');
    const nextBtn = document.createElement('button');
    let currentIndex = 0;
    let imagesArray = [];
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    modalImg.style.maxWidth = '90%';
    modalImg.style.maxHeight = '90%';
    modalImg.style.objectFit = 'contain';
    
    prevBtn.innerHTML = '←';
    nextBtn.innerHTML = '→';
    
    [prevBtn, nextBtn].forEach(btn => {
        btn.style.cssText = `
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: white;
            font-size: 2rem;
            background: rgba(0,0,0,0.5);
            border: none;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1001;
        `;
    });
    
    prevBtn.style.left = '20px';
    nextBtn.style.right = '20px';
    
    document.body.appendChild(modal);
    modal.appendChild(prevBtn);
    modal.appendChild(modalImg);
    modal.appendChild(nextBtn);
    
    function abrirModal(indice) {
        currentIndex = indice;
        imagesArray = Array.from(galleryImages).map(i => i.src);
        modalImg.src = imagesArray[currentIndex];
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function cerrarModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    function mostrarSiguiente() {
        currentIndex = (currentIndex + 1) % imagesArray.length;
        modalImg.src = imagesArray[currentIndex];
    }
    
    function mostrarAnterior() {
        currentIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
        modalImg.src = imagesArray[currentIndex];
    }
    
    // Event listeners
    prevBtn.addEventListener('click', mostrarAnterior);
    nextBtn.addEventListener('click', mostrarSiguiente);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.modal-close')) {
            cerrarModal();
        }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            cerrarModal();
        }
    });
    
    // Abrir modal al hacer clic en imágenes de galería
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            imagesArray = Array.from(galleryImages).map(i => i.src);
            abrirModal(index);
        });
    });
}

/**
 * Filtro de proyectos
 */
function inicializarFiltroProyectos() {
    const filtros = document.querySelectorAll('.filtro-btn');
    const proyectos = document.querySelectorAll('.project-card');
    
    if (!filtros.length || !proyectos.length) return;
    
    filtros.forEach(filtro => {
        filtro.addEventListener('click', () => {
            // Actualizar estado activo
            filtros.forEach(f => f.classList.remove('active'));
            filtro.classList.add('active');
            
            const categoria = filtro.dataset.categoria;
            
            proyectos.forEach(proyecto => {
                if (categoria === 'todos' || proyecto.dataset.categoria === categoria) {
                    proyecto.style.display = 'block';
                    setTimeout(() => {
                        proyecto.style.opacity = '1';
                        proyecto.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    proyecto.style.opacity = '0';
                    proyecto.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        proyecto.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Validación de formulario
 */
function inicializarValidacionFormulario() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let valido = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                valido = false;
                input.style.borderColor = '#e74c3c';
                mostrarError(input, 'Este campo es requerido');
            } else {
                input.style.borderColor = '';
                removerError(input);
            }
        });
        
        if (valido) {
            mostrarMensajeConfirmacion();
            form.reset();
        }
    });
    
    // Remover error al escribir
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                removerError(input);
            }
        });
    });
}

function mostrarError(input, mensaje) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-mensaje';
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 1.3rem;
        margin-top: 0.5rem;
        display: block;
    `;
    errorDiv.textContent = mensaje;
    input.parentElement.appendChild(errorDiv);
}

function removerError(input) {
    const errorDiv = input.parentElement.querySelector('.error-mensaje');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function mostrarMensajeConfirmacion() {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent-color);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    mensajeDiv.textContent = 'Mensaje enviado correctamente';
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        if (mensajeDiv.parentElement) {
            mensajeDiv.remove();
        }
    }, 5000);
}

/**
 * Verificar si prefers-reduced-motion está activo
 */
function estaReducido() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Inicializar todas las funcionalidades
 */
function inicializarPortafolio() {
    // Verificar animaciones reducidas
    if (estaReducido()) {
        document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }
    
    // Cargar imagen hero desde API
    const heroImg = document.getElementById('hero-image');
    if (heroImg) {
        cargarImagenDesdeAPI(heroImg, { width: 800, height: 400 });
    }
    
    // Cargar imágenes de galería desde API
    cargarImagenesGalleria();
    
    // Inicializar funcionalidades
    animarSecciones();
    inicializarMenuMovil();
    inicializarBotonVolverArriba();
    inicializarModalImagenes();
    inicializarFiltroProyectos();
    inicializarValidacionFormulario();
    
    // Actualizar año en footer
    const yearElement = document.getElementById('footer-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Cargar imágenes de galería desde API
 */
async function cargarImagenesGalleria() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '<p class="carga-estado">Cargando imágenes...</p>';
    
    try {
        // Obtener 12 imágenes aleatorias
        const imagenes = [];
        for (let i = 0; i < 12; i++) {
            const url = `${API_CONFIG.baseUrl}/${API_CONFIG.params.width}/${API_CONFIG.params.height}/random`;
            imagenes.push(url);
        }
        
        galleryGrid.innerHTML = '';
        
        imagenes.forEach((url, index) => {
            const figure = document.createElement('figure');
            figure.className = 'gallery-card';
            
            const img = document.createElement('img');
            img.src = url;
            img.alt = `Imagen de portfolio ${index + 1}`;
            img.loading = 'lazy';
            
            img.onerror = () => manejarErrorImagen(img);
            
            figure.appendChild(img);
            galleryGrid.appendChild(figure);
        });
        
        // Inicializar modal después de cargar imágenes
        setTimeout(inicializarModalImagenes, 100);
        
    } catch (error) {
        galleryGrid.innerHTML = '<p class="error-estado">Error al cargar galería. Intente recargar.</p>';
        console.error('Error cargando galería:', error);
    }
}

// Ejecutar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', inicializarPortafolio);