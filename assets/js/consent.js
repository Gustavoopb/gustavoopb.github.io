// Cookie Consent and Google Analytics Management
// Compliant with GDPR and privacy regulations

document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const GA_MEASUREMENT_ID = 'G-35L7XZVE2L';
    const CONSENT_COOKIE_NAME = 'gb_cookie_consent';
    const CONSENT_EXPIRY_DAYS = 365;
    
    // Consent status
    let consentGiven = false;
    
    // Utility functions
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
    
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    function deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    
    // Google Analytics functions
    function loadGoogleAnalytics() {
        if (window.gtag) return; // Already loaded
        
        // Load gtag script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);
        
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;
        
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
            anonymize_ip: true,
            cookie_flags: 'SameSite=Lax;Secure'
        });
        
        console.log('✅ Google Analytics loaded with consent');
    }
    
    function disableGoogleAnalytics() {
        // Disable GA tracking
        window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
        
        // Clear GA cookies
        const gaCookies = ['_ga', '_ga_' + GA_MEASUREMENT_ID.replace('G-', ''), '_gid', '_gat'];
        gaCookies.forEach(cookie => {
            deleteCookie(cookie);
            deleteCookie(cookie, '.gustavobarbosa.dev');
            deleteCookie(cookie, 'gustavobarbosa.dev');
        });
        
        console.log('🚫 Google Analytics disabled and cookies cleared');
    }
    
    // Cookie banner functions
    function createCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <h3>🍪 Cookie Consent</h3>
                    <p>
                        I use Google Analytics to understand how visitors interact with my website. 
                        This helps me improve the user experience. You can choose to accept or decline analytics cookies.
                    </p>
                </div>
                <div class="cookie-banner-actions">
                    <button id="cookie-accept" class="cookie-btn primary">
                        ✅ Accept Analytics
                    </button>
                    <button id="cookie-decline" class="cookie-btn secondary">
                        ❌ Decline
                    </button>
                    <button id="cookie-settings" class="cookie-btn tertiary">
                        ⚙️ Settings
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Add event listeners
        document.getElementById('cookie-accept').addEventListener('click', acceptCookies);
        document.getElementById('cookie-decline').addEventListener('click', declineCookies);
        document.getElementById('cookie-settings').addEventListener('click', showCookieSettings);
        
        // Show banner with animation
        setTimeout(() => {
            banner.classList.add('show');
        }, 500);
    }
    
    function hideCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }
    
    function acceptCookies() {
        consentGiven = true;
        setCookie(CONSENT_COOKIE_NAME, 'accepted', CONSENT_EXPIRY_DAYS);
        loadGoogleAnalytics();
        hideCookieBanner();
        
        // Track consent acceptance
        if (window.gtag) {
            gtag('event', 'cookie_consent', {
                'consent_action': 'accepted'
            });
        }
    }
    
    function declineCookies() {
        consentGiven = false;
        setCookie(CONSENT_COOKIE_NAME, 'declined', CONSENT_EXPIRY_DAYS);
        disableGoogleAnalytics();
        hideCookieBanner();
    }
    
    function showCookieSettings() {
        const modal = document.createElement('div');
        modal.id = 'cookie-settings-modal';
        modal.innerHTML = `
            <div class="cookie-modal-content">
                    <div class="cookie-modal-header">
                        <h2>🍪 Cookie Settings</h2>
                        <button id="close-modal" class="close-btn">×</button>
                    </div>
                    <div class="cookie-modal-body">
                        <div class="cookie-category">
                            <h3>Essential Cookies</h3>
                            <p>These cookies are necessary for the website to function and cannot be disabled.</p>
                            <label class="cookie-toggle">
                                <input type="checkbox" checked disabled>
                                <span class="toggle-slider essential"></span>
                                Always Active
                            </label>
                        </div>
                        <div class="cookie-category">
                            <h3>Analytics Cookies</h3>
                            <p>These cookies help me understand how visitors interact with the website by collecting and reporting information anonymously.</p>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="analytics-toggle" ${consentGiven ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                                Google Analytics
                            </label>
                        </div>
                    </div>
                    <div class="cookie-modal-footer">
                        <button id="save-settings" class="cookie-btn primary">Save Settings</button>
                        <button id="accept-all" class="cookie-btn secondary">Accept All</button>
                    </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('close-modal').addEventListener('click', () => modal.remove());
        document.getElementById('save-settings').addEventListener('click', saveSettings);
        document.getElementById('accept-all').addEventListener('click', () => {
            document.getElementById('analytics-toggle').checked = true;
            saveSettings();
        });
        
        // Close on backdrop click (clicking outside content)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        function saveSettings() {
            const analyticsEnabled = document.getElementById('analytics-toggle').checked;
            
            if (analyticsEnabled) {
                acceptCookies();
            } else {
                declineCookies();
            }
            
            modal.remove();
        }
    }
    
    // Initialize consent management
    function initConsentManagement() {
        const existingConsent = getCookie(CONSENT_COOKIE_NAME);
        
        if (existingConsent === 'accepted') {
            consentGiven = true;
            loadGoogleAnalytics();
        } else if (existingConsent === 'declined') {
            consentGiven = false;
            disableGoogleAnalytics();
        } else {
            // No consent given yet, show banner
            createCookieBanner();
        }
    }
    
    // Expose functions for manual control
    window.cookieConsent = {
        showBanner: createCookieBanner,
        showSettings: showCookieSettings,
        accept: acceptCookies,
        decline: declineCookies,
        getStatus: () => consentGiven,
        reset: () => {
            deleteCookie(CONSENT_COOKIE_NAME);
            disableGoogleAnalytics();
            location.reload();
        }
    };
    
    // Initialize
    initConsentManagement();
});
