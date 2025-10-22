// CV Print Tracking for Google Analytics
// Tracks when users print or save the CV as PDF

(function () {
    'use strict';

    // Only run on CV page
    if (!window.location.pathname.includes('/curriculum-vitae')) {
        return;
    }

    let printEventSent = false;
    let beforePrintTime = null;

    // Track print button clicks
    function trackPrintButtonClick() {
        if (typeof gtag === 'function') {
            const eventData = {
                'event_category': 'cv_interaction',
                'event_label': 'print_button',
                'page_location': window.location.href,
                'user_agent': navigator.userAgent.substring(0, 100)
            };

            gtag('event', 'cv_print_button_click', eventData);
            console.log('📄 CV Print button clicked');
        }
    }

    // Track actual print events
    function trackPrintStart() {
        beforePrintTime = Date.now();

        if (typeof gtag === 'function' && !printEventSent) {
            gtag('event', 'cv_print_start', {
                'event_category': 'cv_interaction',
                'event_label': 'print_dialog_opened',
                'page_location': window.location.href,
                'referrer': document.referrer || 'direct',
                'user_agent': navigator.userAgent.substring(0, 100),
                'timestamp': new Date().toISOString()
            });
            printEventSent = true;
            console.log('🖨️ CV Print dialog opened');
        }
    }

    // Track print completion or cancellation
    function trackPrintEnd() {
        if (beforePrintTime) {
            const printDuration = Date.now() - beforePrintTime;

            if (typeof gtag === 'function') {
                gtag('event', 'cv_print_end', {
                    'event_category': 'cv_interaction',
                    'event_label': 'print_dialog_closed',
                    'page_location': window.location.href,
                    'print_duration_ms': printDuration,
                    'timestamp': new Date().toISOString()
                });
                console.log('📄 CV Print dialog closed (' + printDuration + 'ms)');
            }
            beforePrintTime = null;
        }
    }

    // Track keyboard shortcuts (Ctrl+P, Cmd+P)
    function trackKeyboardPrint(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
            if (typeof gtag === 'function') {
                gtag('event', 'cv_print_keyboard', {
                    'event_category': 'cv_interaction',
                    'event_label': 'keyboard_shortcut',
                    'page_location': window.location.href,
                    'shortcut': event.ctrlKey ? 'ctrl_p' : 'cmd_p'
                });
                console.log('⌨️ CV Print via keyboard shortcut');
            }
        }
    }

    // Track browser print menu usage
    function trackBrowserPrint() {
        if (typeof gtag === 'function') {
            gtag('event', 'cv_print_browser_menu', {
                'event_category': 'cv_interaction',
                'event_label': 'browser_menu',
                'page_location': window.location.href
            });
            console.log('🌐 CV Print via browser menu');
        }
    }

    // Track PDF save (approximation based on print duration)
    function trackPotentialPDFSave(duration) {
        // If print dialog was open for more than 3 seconds, likely saved as PDF
        if (duration > 3000) {
            if (typeof gtag === 'function') {
                gtag('event', 'cv_potential_pdf_save', {
                    'event_category': 'cv_interaction',
                    'event_label': 'likely_pdf_save',
                    'page_location': window.location.href,
                    'dialog_duration_ms': duration
                });
                console.log('💾 Potential CV PDF save detected (' + duration + 'ms)');
            }
        }
    }

    // Initialize tracking
    function initPrintTracking() {
        // Track print button clicks
        const printButton = document.querySelector('.print-btn');
        if (printButton) {
            printButton.addEventListener('click', trackPrintButtonClick);
        }

        // Track browser print events
        window.addEventListener('beforeprint', trackPrintStart);
        window.addEventListener('afterprint', () => {
            trackPrintEnd();
            if (beforePrintTime) {
                const duration = Date.now() - beforePrintTime;
                trackPotentialPDFSave(duration);
            }
        });

        // Track keyboard shortcuts
        document.addEventListener('keydown', trackKeyboardPrint);

        // Track page visibility changes (can indicate print menu usage)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page became hidden, might be print menu
                trackBrowserPrint();
            }
        });

        // Track CV page views
        if (typeof gtag === 'function') {
            gtag('event', 'cv_page_view', {
                'event_category': 'cv_interaction',
                'event_label': 'page_loaded',
                'page_location': window.location.href,
                'referrer': document.referrer || 'direct',
                'user_agent': navigator.userAgent.substring(0, 100),
                'timestamp': new Date().toISOString()
            });
            console.log('📊 CV page loaded - GA tracking initialized');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPrintTracking);
    } else {
        initPrintTracking();
    }

    // GA Debug function
    function debugGA() {
        console.log('🔍 Google Analytics Debug Info:');
        console.log('- gtag function available:', typeof gtag === 'function');
        console.log('- window.dataLayer exists:', typeof window.dataLayer !== 'undefined');
        console.log('- dataLayer contents:', window.dataLayer);

        if (typeof gtag === 'function') {
            console.log('✅ GA is loaded and ready');

            // Test event
            gtag('event', 'ga_debug_test', {
                'event_category': 'debug',
                'event_label': 'manual_test',
                'debug_timestamp': new Date().toISOString()
            });
            console.log('🧪 Test event sent: ga_debug_test');
        } else {
            console.warn('❌ GA not loaded - check:');
            console.log('1. Cookie consent given?');
            console.log('2. Script loaded?');
            console.log('3. Network blocked?');
        }

        // Check cookie consent status
        if (typeof window.cookieConsent !== 'undefined') {
            console.log('- Cookie consent status:', window.cookieConsent.getStatus());
        } else {
            console.log('- Cookie consent system not found');
        }
    }

    // Expose functions for manual testing
    window.cvPrintTracking = {
        testPrintButton: trackPrintButtonClick,
        testPrintStart: trackPrintStart,
        testPrintEnd: trackPrintEnd,
        testKeyboard: () => trackKeyboardPrint({ ctrlKey: true, key: 'p' }),
        testBrowserMenu: trackBrowserPrint,
        debugGA: debugGA
    };

})();
