import { animate, inView } from 'https://esm.run/framer-motion';

document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем иконки с проверкой загрузки
    initIcons();
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initParallaxEffects();
    initCounterAnimations();
    initMouseTracker();
    initPhaseAnimations();
    initLanguageSwitcher(); // Добавляем переключатель языков
});

function initIcons() {
    try {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
            console.log('Lucide icons загружены успешно');
        } else {
            console.warn('Lucide icons не загрузились, используем fallback');
            // Fallback иконки уже в CSS
        }
    } catch (error) {
        console.warn('Ошибка при загрузке Lucide icons:', error);
    }
    
    // Повторная попытка через 1 секунду если не загрузились
    setTimeout(() => {
        try {
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        } catch (e) {
            console.log('Повторная попытка загрузки иконок не удалась, используем emoji fallback');
        }
    }, 1000);
}

function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = menuButton.querySelector('i');

    if (!menuButton || !mobileMenu) return;
    
    const navLinks = mobileMenu.querySelectorAll('a');

    menuButton.addEventListener('click', () => {
        const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
        if (mobileMenu.classList.contains('hidden')) {
            menuIcon.setAttribute('data-lucide', 'menu');
        } else {
            menuIcon.setAttribute('data-lucide', 'x');
        }
        lucide.createIcons();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });
}

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^=\"#\"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('.animate-section');
    sections.forEach(section => {
        inView(section, () => {
            section.classList.add('in-view');
        }, {
            margin: "-100px 0px"
        });
    });
}

function initParallaxEffects() {
    // Параллакс отключен для устранения рывков при скролле
    // Фоновое изображение теперь статично
    return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.bg-cover');
        
        parallax.forEach(element => {
            const speed = 0.3; // Уменьшаем скорость для более плавного эффекта
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

function initCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        inView(stat, () => {
            const finalValue = stat.textContent;
            const isNumeric = /^\d+/.test(finalValue);
            
            if (isNumeric) {
                const numValue = parseInt(finalValue.replace(/\D/g, ''));
                animateCounter(stat, 0, numValue, finalValue.replace(/\d+/, ''));
            }
        });
    });
}

function animateCounter(element, start, end, suffix) {
    const duration = 2000;
    const increment = Math.ceil(end / (duration / 16));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        
        if (end >= 1000000000) {
            element.textContent = (current / 1000000000).toFixed(0) + 'B' + suffix;
        } else if (end >= 1000000) {
            element.textContent = (current / 1000000).toFixed(0) + 'M' + suffix;
        } else {
            element.textContent = current + suffix;
        }
    }, 16);
}

function initMouseTracker() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const moveX = (x / rect.width - 0.5) * 20;
        const moveY = (y / rect.height - 0.5) * 20;
        
        const parallaxElements = hero.querySelectorAll('.absolute');
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
        });
    });
}

function initPhaseAnimations() {
    const phases = document.querySelectorAll('.roadmap-phase-container');
    
    phases.forEach((phase, index) => {
        inView(phase, () => {
            setTimeout(() => {
                phase.style.opacity = '1';
                phase.style.animation = index % 2 === 0 ? 'slideInPhase 0.8s ease-out forwards' : 'slideInPhaseRight 0.8s ease-out forwards';
            }, index * 200);
        }, {
            margin: "-50px 0px"
        });
    });
}

// Language Switching Functionality
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    let currentLang = 'en'; // Default language is English
    
    // Set default language on page load
    switchLanguage(currentLang);
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang !== currentLang) {
                currentLang = lang;
                switchLanguage(lang);
                updateActiveButton(lang);
            }
        });
    });
    
    function switchLanguage(lang) {
        const elements = document.querySelectorAll('[data-en][data-ru]');
        
        elements.forEach(element => {
            const text = element.dataset[lang];
            if (text) {
                element.innerHTML = text;
            }
        });
    }
    
    function updateActiveButton(lang) {
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }
}
