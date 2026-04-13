// Afar Culture Website - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load content from JSON
    loadContent();
    
    // Initialize components
    initNavigation();
    initLanguageSwitcher();
    initSmoothScroll();
    
    // Check for saved language preference
    checkLanguagePreference();
});

// Content loading function
async function loadContent() {
    try {
        const response = await fetch('../assets/data/content.json');
        const data = await response.json();
        window.siteContent = data;
        
        // Update page content based on current language
        updatePageContent();
    } catch (error) {
        console.log('Using default content');
        // Fallback to localStorage if available
        const savedContent = localStorage.getItem('afar_culture_content');
        if (savedContent) {
            window.siteContent = JSON.parse(savedContent);
            updatePageContent();
        }
    }
}

// Update page content with translations
function updatePageContent() {
    const lang = getCurrentLanguage();
    const content = window.siteContent;
    
    if (!content) return;
    
    // Update navigation
    const navItems = content.navigation[lang];
    if (navItems) {
        document.querySelectorAll('.navbar-nav .nav-link').forEach((link, index) => {
            if (navItems[index]) {
                link.textContent = navItems[index];
            }
        });
    }
    
    // Update page-specific content
    const pageName = getCurrentPage();
    const pageContent = content.pages[pageName]?.[lang];
    
    if (pageContent) {
        // Update hero section
        if (pageContent.hero) {
            const heroTitle = document.querySelector('.hero-section h1');
            const heroSubtitle = document.querySelector('.hero-section p');
            const heroButton = document.querySelector('.btn-hero');
            
            if (heroTitle) heroTitle.textContent = pageContent.hero.title;
            if (heroSubtitle) heroSubtitle.textContent = pageContent.hero.subtitle;
            if (heroButton) heroButton.innerHTML = `${pageContent.hero.button} <i class="fas fa-arrow-right ms-2"></i>`;
        }
        
        // Update features
        if (pageContent.features) {
            document.querySelectorAll('.feature-card').forEach((card, index) => {
                const feature = pageContent.features[index];
                if (feature) {
                    card.querySelector('h3').textContent = feature.title;
                    card.querySelector('p').textContent = feature.description;
                }
            });
        }
    }
}

// Get current language from URL
function getCurrentLanguage() {
    const path = window.location.pathname;
    if (path.includes('/afar/')) return 'afar';
    if (path.includes('/am/')) return 'am';
    return 'en';
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    
    const pageMap = {
        'index': 'home',
        'culture': 'culture',
        'customs': 'customs',
        'lifestyle': 'lifestyle',
        'gallery': 'gallery',
        'contact': 'contact'
    };
    
    return pageMap[filename] || 'home';
}

// Initialize navigation
function initNavigation() {
    // Highlight current page in navigation
    const currentPage = getCurrentPage();
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });
    
    // Mobile menu close on click
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
}

// Language switcher
function initLanguageSwitcher() {
    const currentLang = getCurrentLanguage();
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const href = btn.getAttribute('href');
        if (href && href.includes(`/${currentLang}/`)) {
            btn.classList.add('active');
        }
    });
}

// Check for saved language preference
function checkLanguagePreference() {
    const savedLang = localStorage.getItem('preferredLanguage');
    const currentLang = getCurrentLanguage();
    
    if (savedLang && savedLang !== currentLang && window.location.pathname.includes('/index.html')) {
        // Only redirect from root or language selection page
        const isLanguageSelector = !window.location.pathname.includes('/en/') && 
                                   !window.location.pathname.includes('/afar/') && 
                                   !window.location.pathname.includes('/am/');
        
        if (isLanguageSelector) {
            window.location.href = `/${savedLang}/index.html`;
        }
    }
}

// Save language preference
function setLanguagePreference(lang) {
    localStorage.setItem('preferredLanguage', lang);
}

// Smooth scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Gallery lightbox (if on gallery page)
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    showLightbox(img.src, img.alt);
                }
            });
        });
    }
}

// Simple lightbox
function showLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <img src="${src}" alt="${alt}">
    `;
    
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    const img = lightbox.querySelector('img');
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        color: white;
        font-size: 40px;
        cursor: pointer;
    `;
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target === closeBtn) {
            lightbox.remove();
        }
    });
    
    document.body.appendChild(lightbox);
}

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    if (email) {
        // Save to localStorage for demo
        const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
        subscribers.push({ email, date: new Date().toISOString() });
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
        
        alert('Thank you for subscribing!');
        event.target.reset();
    }
}

// Contact form submission
function submitContactForm(event) {
    event.preventDefault();
    
    const formData = {
        name: event.target.querySelector('#name').value,
        email: event.target.querySelector('#email').value,
        message: event.target.querySelector('#message').value,
        date: new Date().toISOString()
    };
    
    // Save to localStorage for demo
    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    messages.push(formData);
    localStorage.setItem('contact_messages', JSON.stringify(messages));
    
    alert('Thank you for your message! We will respond soon.');
    event.target.reset();
}

// Search functionality
function searchContent(query) {
    if (!query) return [];
    
    const content = window.siteContent;
    const results = [];
    
    // Simple search through content
    function searchObject(obj, path = '') {
        for (let key in obj) {
            const value = obj[key];
            const currentPath = path ? `${path}.${key}` : key;
            
            if (typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    path: currentPath,
                    content: value.substring(0, 200) + '...'
                });
            } else if (typeof value === 'object' && value !== null) {
                searchObject(value, currentPath);
            }
        }
    }
    
    if (content) {
        searchObject(content);
    }
    
    return results;
}

// Print page
function printPage() {
    window.print();
}

// Share page
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Page URL copied to clipboard!');
        });
    }
}

// Export functions for global use
window.setLanguagePreference = setLanguagePreference;
window.subscribeNewsletter = subscribeNewsletter;
window.submitContactForm = submitContactForm;
window.searchContent = searchContent;
window.printPage = printPage;
window.sharePage = sharePage;