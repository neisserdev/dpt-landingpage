// ===========================================
// SCRIPT PARA PÁGINAS LEGALES
// Accesibilidad, Política de Privacidad, Términos de Uso
// ===========================================

// ===========================================
// VARIABLES GLOBALES
// ===========================================
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

// ===========================================
// HEADER SCROLL EFFECT
// ===========================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

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
scrollTopBtn.setAttribute('aria-label', 'Volver arriba');
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

document.body.appendChild(scrollTopBtn);

// Mostrar/ocultar botón según scroll
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

// Scroll suave al hacer click
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

// Efectos hover
scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'translateY(-4px)';
    scrollTopBtn.style.boxShadow = '0 10px 15px -3px rgba(196, 30, 58, 0.4)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'translateY(0)';
    scrollTopBtn.style.boxShadow = '0 4px 6px -1px rgba(196, 30, 58, 0.3)';
});

// ===========================================
// SMOOTH SCROLL PARA ENLACES INTERNOS
// ===========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 800;
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
                }
            }
            
            requestAnimationFrame(animation);
        }
    });
});

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

console.log('🎉 Página legal cargada correctamente');
