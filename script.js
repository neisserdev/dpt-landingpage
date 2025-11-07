// ===========================================
// ESPERAR A QUE EL DOM ESTÉ LISTO
// ===========================================
document.addEventListener('DOMContentLoaded', function() {

// ===========================================
// VARIABLES GLOBALES
// ===========================================
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');

// ===========================================
// HEADER SCROLL EFFECT
// ===========================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Añadir clase 'scrolled' cuando se hace scroll
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===========================================
// MOBILE MENU TOGGLE
// ===========================================
if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// ===========================================
// ACTIVE NAVIGATION LINK
// ===========================================
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ===========================================
// ACTIVE LINK SMOOTH TRANSITION
// ===========================================
function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);
window.addEventListener('load', setActiveNavLink);

// ===========================================
// SMOOTH SCROLL MEJORADO CON TRANSICIONES
// ===========================================
let isScrolling = false;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        if (isScrolling) return;
        
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            isScrolling = true;
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1200; // 1.2 segundos para efecto más suave
            let start = null;
            
            function easeInOutCubic(t) {
                return t < 0.5 
                    ? 4 * t * t * t 
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutCubic(progress);
                
                window.scrollTo(0, startPosition + (distance * ease));
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    isScrolling = false;
                }
            }
            
            requestAnimationFrame(animation);
        }
    });
});

// Smooth scroll para el indicador de scroll
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = aboutSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// ===========================================
// INTERSECTION OBSERVER - ANIMATIONS
// ===========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Elementos a animar
const animatedElements = document.querySelectorAll(`
    .stat-card,
    .program-card,
    .research-item,
    .lab-card,
    .project-card,
    .faculty-card
`);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===========================================
// CONTACT FORM HANDLING
// ===========================================
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Obtener valores del formulario
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Simular envío del formulario
        console.log('Formulario enviado:', formData);

        // Mostrar mensaje de éxito
        showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');

        // Limpiar formulario
        contactForm.reset();
    });
}

// ===========================================
// NOTIFICATION SYSTEM
// ===========================================
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        padding: 16px 24px;
        background-color: ${type === 'success' ? '#10B981' : '#2563EB'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;

    // Añadir al documento
    document.body.appendChild(notification);

    // Eliminar después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// ===========================================
// COUNTER ANIMATION FOR STATS
// ===========================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            // Formatear número con coma si es mayor a 999
            const formatted = target >= 1000 ? target.toLocaleString('en-US') : target;
            element.textContent = formatted + '+';
            clearInterval(timer);
        } else {
            const currentNumber = Math.floor(start);
            const formatted = currentNumber >= 1000 ? currentNumber.toLocaleString('en-US') : currentNumber;
            element.textContent = formatted + '+';
        }
    }, 16);
}

// Observer para stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const numberElement = entry.target.querySelector('.stat-number');
            // Remover comas y símbolos para obtener el número
            const targetValue = parseInt(numberElement.textContent.replace(/[^\d]/g, ''));
            numberElement.textContent = '0+';
            animateCounter(numberElement, targetValue);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

// Observar todas las tarjetas de estadísticas
document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// ===========================================
// FORM VALIDATION
// ===========================================
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');

if (formInputs.length > 0) {
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateInput(input);
            }
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (input.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'Este campo es requerido';
    } else if (input.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
        }
    } else if (input.type === 'tel' && value !== '') {
        const phoneRegex = /^[0-9\s\-\+\(\)]{8,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Ingresa un teléfono válido';
        }
    }

    // Remover mensaje de error previo
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    if (!isValid) {
        input.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        errorElement.style.cssText = `
            color: #EF4444;
            font-size: 12px;
            margin-top: 4px;
            display: block;
        `;
        input.parentElement.appendChild(errorElement);
    } else {
        input.classList.remove('error');
    }

    return isValid;
}

// ===========================================
// LAZY LOADING IMAGES (si se agregan)
// ===========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===========================================
// MODAL FUNCTIONALITY (para "Más información")
// ===========================================
const programLinks = document.querySelectorAll('.program-link');

programLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const programTitle = link.closest('.program-card').querySelector('.program-title').textContent;
        showProgramModal(programTitle);
    });
});

function showProgramModal(programTitle) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h2>${programTitle}</h2>
            <p>Información detallada sobre el programa ${programTitle}.</p>
            <p>Esta es una versión de demostración. Aquí se mostraría información completa sobre:</p>
            <ul>
                <li>Plan de estudios</li>
                <li>Requisitos de admisión</li>
                <li>Perfil de egreso</li>
                <li>Campo laboral</li>
                <li>Costos y becas disponibles</li>
            </ul>
            <button class="btn-primary">Solicitar Información</button>
        </div>
    `;

    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
    `;

    const overlay = modal.querySelector('.modal-overlay');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
    `;

    const content = modal.querySelector('.modal-content');
    content.style.cssText = `
        position: relative;
        background-color: white;
        border-radius: 16px;
        padding: 40px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        animation: modalSlideIn 0.3s ease;
    `;

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        font-size: 32px;
        cursor: pointer;
        color: #64748B;
        line-height: 1;
        padding: 4px;
        transition: color 0.3s;
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Cerrar modal
    const closeModal = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Cerrar con ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// ===========================================
// SCROLL TO TOP BUTTON
// ===========================================
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="19" x2="12" y2="5"/>
        <polyline points="5 12 12 5 19 12"/>
    </svg>
`;
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 48px;
    height: 48px;
    background-color: #2563EB;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    const startPosition = window.pageYOffset;
    const duration = 1000;
    let start = null;
    
    function easeInOutCubic(t) {
        return t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition * (1 - ease));
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'translateY(-4px)';
    scrollTopBtn.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'translateY(0)';
    scrollTopBtn.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
});

// ===========================================
// ANIMACIONES CSS ADICIONALES
// ===========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes modalSlideIn {
        from {
            transform: scale(0.95) translateY(20px);
            opacity: 0;
        }
        to {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
    }

    @keyframes scroll {
        0% {
            opacity: 0;
            transform: translateY(0);
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translateY(8px);
        }
    }

    .contact-form input.error,
    .contact-form textarea.error,
    .contact-form select.error {
        border-color: #EF4444;
    }
`;

document.head.appendChild(style);

console.log('🎉 Sitio web del Departamento de Informática cargado correctamente');

// ===========================================
// SCROLL TO TOP BUTTON - ESTILO ROJO
// ===========================================
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #C41E3A 0%, #E63946 100%);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px -1px rgba(196, 30, 58, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
`;

// ===========================================
// PAGE TRANSITIONS - SMOOTH NAVIGATION
// ===========================================
// Interceptar clics en enlaces internos para transiciones suaves
document.querySelectorAll('a[href^="index.html"], a[href$=".html"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Solo para enlaces internos del mismo dominio
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            // Si el navegador soporta View Transitions
            if (document.startViewTransition) {
                e.preventDefault();
                
                document.startViewTransition(() => {
                    window.location.href = href;
                });
            }
            // Si no, usar el fade-out manual
            else {
                e.preventDefault();
                document.body.style.opacity = '0';
                document.body.style.transform = 'translateY(-10px)';
                document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        }
    });
});

// ===========================================
// FIN DEL DOMContentLoaded
// ===========================================
}); // Fin de DOMContentLoaded