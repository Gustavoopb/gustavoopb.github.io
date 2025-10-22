// ATS (Applicant Tracking System) Detection and Redirect
// Redirects ATS crawlers from home page to CV page for better job application processing

(function () {
    'use strict';

    // Only run on home page (not CV or 404)
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        return;
    }

    // Common ATS User-Agent patterns
    const atsPatterns = [
        // Major ATS providers
        /workday/i,
        /greenhouse/i,
        /lever/i,
        /bamboohr/i,
        /smartrecruiters/i,
        /jobvite/i,
        /icims/i,
        /taleo/i,
        /successfactors/i,
        /cornerstone/i,
        /ultipro/i,
        /paycom/i,
        /adp/i,
        /ceridian/i,

        // Generic ATS/HR patterns
        /ats/i,
        /applicant.?tracking/i,
        /hr.?system/i,
        /recruitment/i,
        /hiring/i,
        /jobboard/i,
        /career/i,

        // Headless browsers often used by ATS
        /headlesschrome/i,
        /phantomjs/i,
        /selenium/i,
        /webdriver/i,

        // LinkedIn Talent Solutions
        /linkedin.*talent/i,
        /linkedin.*recruiter/i,

        // Indeed ATS
        /indeed/i,

        // Other job platforms that might crawl
        /glassdoor/i,
        /monster/i,
        /ziprecruiter/i,
        /careerbuilder/i,

        // Generic crawlers that might be ATS-related
        /crawler.*job/i,
        /bot.*hr/i,
        /spider.*career/i
    ];

    // Get user agent
    const userAgent = navigator.userAgent || '';

    // Check if user agent matches any ATS pattern
    const isATS = atsPatterns.some(pattern => pattern.test(userAgent));

    // Additional checks for ATS behavior
    const hasATSParams = window.location.search.includes('ats') ||
        window.location.search.includes('applicant') ||
        window.location.search.includes('resume') ||
        window.location.search.includes('cv');

    // Check for ATS-specific headers (if accessible)
    const hasATSReferrer = document.referrer && (
        /workday|greenhouse|lever|bamboo|smartrecruiters|jobvite|icims|taleo|linkedin.*talent/i.test(document.referrer)
    );

    // Log detection only if GA is available
    if ((isATS || hasATSParams || hasATSReferrer) && typeof gtag === 'function') {
        console.log('🤖 ATS detected - redirecting to CV');
    }

    // Redirect to CV if ATS is detected
    if (isATS || hasATSParams || hasATSReferrer) {
        // Track ATS detection event in Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'ats_detection', {
                'event_category': 'recruitment',
                'event_label': userAgent.substring(0, 100), // Truncate user agent
                'detection_method': isATS ? 'user_agent' : (hasATSParams ? 'url_params' : 'referrer'),
                'referrer': document.referrer || 'direct',
                'custom_parameter_1': hasATSParams ? 'has_ats_params' : 'no_ats_params'
            });
        }

        // Small delay to ensure GA event is sent before redirect
        setTimeout(() => {
            // Use replace() to avoid adding to browser history
            window.location.replace('/curriculum-vitae/');
        }, 100);
        return;
    }

    // Expose function for manual testing
    window.atsRedirect = {
        test: () => {
            console.log('Testing ATS redirect...');

            // Test GA event first
            if (typeof gtag === 'function') {
                gtag('event', 'ats_detection', {
                    'event_category': 'recruitment',
                    'event_label': 'manual_test',
                    'detection_method': 'manual_test',
                    'referrer': document.referrer || 'direct'
                });
                console.log('🧪 ATS test redirect - GA event sent');
            } else {
                console.warn('❌ GA not available for test event');
            }

            setTimeout(() => {
                window.location.replace('/curriculum-vitae/');
            }, 100);
        },
        checkUserAgent: () => {
            const detected = atsPatterns.some(pattern => pattern.test(navigator.userAgent));
            console.log('ATS detected:', detected, 'User Agent:', navigator.userAgent);
            return detected;
        },
        debugGA: () => {
            console.log('🔍 ATS GA Debug Info:');
            console.log('- gtag function available:', typeof gtag === 'function');
            console.log('- Cookie consent status:', typeof window.cookieConsent !== 'undefined' ? window.cookieConsent.getStatus() : 'not found');
            console.log('- Current page:', window.location.pathname);
        }
    };

})();
