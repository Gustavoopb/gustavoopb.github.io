// Smart Background Image Rotation System
// Randomly selects background image with persistence based on daily reset or visit count

document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const BACKGROUND_IMAGES = [
        '/assets/img/banner-1.jpg',
        '/assets/img/banner-2.jpg',
        '/assets/img/banner-3.jpg',
        '/assets/img/banner-4.jpg',
        '/assets/img/banner-5.jpg'
    ];
    
    const MAX_VISITS_PER_IMAGE = 5;
    const STORAGE_KEYS = {
        currentImage: 'bg_current_image',
        visitCount: 'bg_visit_count',
        lastResetDate: 'bg_last_reset_date',
        usedImages: 'bg_used_images'
    };
    
    // Utility functions
    function getTodayString() {
        return new Date().toDateString();
    }
    
    function getRandomImage(excludeImages = []) {
        const availableImages = BACKGROUND_IMAGES.filter(img => !excludeImages.includes(img));
        
        // If all images have been used, reset the exclusion list
        if (availableImages.length === 0) {
            localStorage.removeItem(STORAGE_KEYS.usedImages);
            return BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
        }
        
        return availableImages[Math.floor(Math.random() * availableImages.length)];
    }
    
    function shouldResetImage() {
        const lastResetDate = localStorage.getItem(STORAGE_KEYS.lastResetDate);
        const visitCount = parseInt(localStorage.getItem(STORAGE_KEYS.visitCount) || '0');
        const today = getTodayString();
        
        // Reset if it's a new day
        if (lastResetDate !== today) {
            return true;
        }
        
        // Reset if visit count reached maximum
        if (visitCount >= MAX_VISITS_PER_IMAGE) {
            return true;
        }
        
        return false;
    }
    
    function selectBackgroundImage() {
        let currentImage = localStorage.getItem(STORAGE_KEYS.currentImage);
        let visitCount = parseInt(localStorage.getItem(STORAGE_KEYS.visitCount) || '0');
        let usedImages = JSON.parse(localStorage.getItem(STORAGE_KEYS.usedImages) || '[]');
        const today = getTodayString();
        
        // Check if we need to reset and select a new image
        if (shouldResetImage() || !currentImage) {
            // Add current image to used images list (if exists)
            if (currentImage && !usedImages.includes(currentImage)) {
                usedImages.push(currentImage);
            }
            
            // Select a new random image (excluding recently used ones)
            currentImage = getRandomImage(usedImages);
            
            // Reset counters
            visitCount = 1;
            
            // Update localStorage
            localStorage.setItem(STORAGE_KEYS.currentImage, currentImage);
            localStorage.setItem(STORAGE_KEYS.visitCount, visitCount.toString());
            localStorage.setItem(STORAGE_KEYS.lastResetDate, today);
            localStorage.setItem(STORAGE_KEYS.usedImages, JSON.stringify(usedImages));
            
            console.log(`🎨 New background selected: ${currentImage} (Visit 1/${MAX_VISITS_PER_IMAGE})`);
        } else {
            // Increment visit count for existing image
            visitCount++;
            localStorage.setItem(STORAGE_KEYS.visitCount, visitCount.toString());
            
            console.log(`🎨 Using existing background: ${currentImage} (Visit ${visitCount}/${MAX_VISITS_PER_IMAGE})`);
        }
        
        return currentImage;
    }
    
    function applyBackgroundImage(imagePath) {
        // Apply to hero section background
        const heroBackground = document.querySelector('.hero-bg');
        if (heroBackground) {
            heroBackground.style.backgroundImage = `url('${imagePath}')`;
        }
        
        // Apply to contact section background
        const contactBackground = document.querySelector('.contact-bg');
        if (contactBackground) {
            contactBackground.style.backgroundImage = `url('${imagePath}')`;
        }
        
        // Preload the image for smooth loading
        const img = new Image();
        img.src = imagePath;
    }
    
    // Main execution
    function initBackgroundRotation() {
        try {
            const selectedImage = selectBackgroundImage();
            applyBackgroundImage(selectedImage);
            
            // Debug info
            const visitCount = localStorage.getItem(STORAGE_KEYS.visitCount);
            const lastReset = localStorage.getItem(STORAGE_KEYS.lastResetDate);
            console.log(`📊 Background Rotation Status:`);
            console.log(`   Current Image: ${selectedImage}`);
            console.log(`   Visit Count: ${visitCount}/${MAX_VISITS_PER_IMAGE}`);
            console.log(`   Last Reset: ${lastReset}`);
            
        } catch (error) {
            console.error('❌ Background rotation error:', error);
            // Fallback to first image
            applyBackgroundImage(BACKGROUND_IMAGES[0]);
        }
    }
    
    function initCopyRight() {
        const currentYear = new Date().getFullYear();
        const copyRightElement = document.querySelector('#footer-year');
        if (copyRightElement) {
            copyRightElement.textContent = `${currentYear}`;
        }
    }
    
    // Initialize the background rotation system
    initBackgroundRotation();
    initCopyRight();
    
    // Expose function for manual testing (development only)
    if (typeof window !== 'undefined') {
        window.debugBackgroundRotation = {
            forceNewImage: function() {
                localStorage.removeItem(STORAGE_KEYS.currentImage);
                localStorage.removeItem(STORAGE_KEYS.visitCount);
                initBackgroundRotation();
            },
            resetAll: function() {
                Object.values(STORAGE_KEYS).forEach(key => {
                    localStorage.removeItem(key);
                });
                initBackgroundRotation();
            },
            getStatus: function() {
                return {
                    currentImage: localStorage.getItem(STORAGE_KEYS.currentImage),
                    visitCount: localStorage.getItem(STORAGE_KEYS.visitCount),
                    lastResetDate: localStorage.getItem(STORAGE_KEYS.lastResetDate),
                    usedImages: JSON.parse(localStorage.getItem(STORAGE_KEYS.usedImages) || '[]')
                };
            }
        };
    }
});
