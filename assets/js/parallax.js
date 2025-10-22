// Optimized Parallax Effect for Ferrari Flag Background
document.addEventListener('DOMContentLoaded', function() {
    const heroBackground = document.querySelector('.hero-bg');
    const contactBackground = document.querySelector('.contact-bg');
    const heroSection = document.querySelector('.hero');
    const contactSection = document.querySelector('.contact');
    
    // Check if elements exist
    if (!heroBackground || !contactBackground || !heroSection || !contactSection) return;
    
    // Check if device prefers reduced motion (accessibility)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Respect user's accessibility preferences
        heroBackground.style.transform = 'translate3d(0, 0, 0)';
        contactBackground.style.transform = 'translate3d(0, 0, 0)';
        return;
    }
    
    // Detect mobile for optimized parallax settings
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Cache section positions for better performance
    let heroTop, heroHeight, contactTop, contactHeight;
    let ticking = false;
    
    function calculatePositions() {
        const heroRect = heroSection.getBoundingClientRect();
        const contactRect = contactSection.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        
        heroTop = heroRect.top + scrolled;
        heroHeight = heroRect.height;
        contactTop = contactRect.top + scrolled;
        contactHeight = contactRect.height;
    }
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Adjust parallax intensity based on device type
        const heroIntensity = isMobile ? 75 : 150; // Reduced intensity on mobile
        const contactIntensity = isMobile ? 60 : 120; // Reduced intensity on mobile
        
        // Hero section parallax - only when in viewport
        if (scrolled + windowHeight > heroTop && scrolled < heroTop + heroHeight) {
            const heroProgress = (scrolled - heroTop + windowHeight) / (heroHeight + windowHeight);
            const heroParallax = (heroProgress - 0.5) * heroIntensity;
            heroBackground.style.transform = `translate3d(0, ${heroParallax}px, 0)`;
        }
        
        // Contact section parallax - only when in viewport
        if (scrolled + windowHeight > contactTop && scrolled < contactTop + contactHeight) {
            const contactProgress = (scrolled - contactTop + windowHeight) / (contactHeight + windowHeight);
            const contactParallax = (contactProgress - 0.5) * contactIntensity;
            contactBackground.style.transform = `translate3d(0, ${contactParallax}px, 0)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // Initial calculations
    calculatePositions();
    
    // Optimized scroll event with passive listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        requestTick();
        
        // Recalculate positions occasionally for accuracy
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(calculatePositions, 100);
    }, { passive: true });
    
    // Handle resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Recalculate positions and update parallax
            calculatePositions();
            updateParallax();
        }, 250);
    });
    
    // Initial parallax update
    updateParallax();
});
