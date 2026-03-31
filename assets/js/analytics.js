/* ==========================================================================
   ANALYTICS.JS - Google Analytics 4 & Event Tracking
   Dorys Janitorial Cleaning Services
   ========================================================================== */

// Google Analytics 4 Configuration
// Replace GA_MEASUREMENT_ID with your actual GA4 Measurement ID (G-XXXXXXXXXX)
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with actual GA4 ID

// Initialize Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID, {
  'page_title': document.title,
  'page_location': window.location.href,
  'page_path': window.location.pathname
});

// --------------------------------------------------------------------------
// Phone Call Tracking
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  // Track all phone link clicks
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      gtag('event', 'phone_call', {
        'event_category': 'Contact',
        'event_label': 'Phone Click',
        'phone_number': this.href.replace('tel:', ''),
        'page_location': window.location.pathname
      });
    });
  });

  // Track email link clicks
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      gtag('event', 'email_click', {
        'event_category': 'Contact',
        'event_label': 'Email Click',
        'email_address': this.href.replace('mailto:', ''),
        'page_location': window.location.pathname
      });
    });
  });
});

// --------------------------------------------------------------------------
// CTA Button Tracking
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  // Track primary CTA buttons
  const ctaButtons = document.querySelectorAll('.btn--primary, .btn--accent');
  ctaButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const buttonText = this.textContent.trim();
      const href = this.href || '';

      gtag('event', 'cta_click', {
        'event_category': 'CTA',
        'event_label': buttonText,
        'link_url': href,
        'page_location': window.location.pathname
      });
    });
  });

  // Track "Get Free Quote" buttons specifically
  const quoteButtons = document.querySelectorAll('a[href*="contact"], a[href*="#contact"]');
  quoteButtons.forEach(function(button) {
    if (button.textContent.toLowerCase().includes('quote') ||
        button.textContent.toLowerCase().includes('estimate')) {
      button.addEventListener('click', function() {
        gtag('event', 'quote_request_click', {
          'event_category': 'Lead',
          'event_label': 'Quote Button Click',
          'page_location': window.location.pathname
        });
      });
    }
  });
});

// --------------------------------------------------------------------------
// Form Submission Tracking
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form');
  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      gtag('event', 'form_submit', {
        'event_category': 'Lead',
        'event_label': 'Contact Form Submission',
        'form_id': this.id || 'unknown',
        'page_location': window.location.pathname
      });
    });
  });
});

// --------------------------------------------------------------------------
// Scroll Depth Tracking
// --------------------------------------------------------------------------
(function() {
  const scrollDepths = [25, 50, 75, 90, 100];
  const trackedDepths = {};

  window.addEventListener('scroll', function() {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    scrollDepths.forEach(function(depth) {
      if (scrollPercentage >= depth && !trackedDepths[depth]) {
        trackedDepths[depth] = true;
        gtag('event', 'scroll_depth', {
          'event_category': 'Engagement',
          'event_label': depth + '% Scrolled',
          'scroll_depth': depth,
          'page_location': window.location.pathname
        });
      }
    });
  });
})();

// --------------------------------------------------------------------------
// Time on Page Tracking
// --------------------------------------------------------------------------
(function() {
  const timeThresholds = [30, 60, 120, 300]; // seconds
  const trackedTimes = {};

  timeThresholds.forEach(function(seconds) {
    setTimeout(function() {
      if (!trackedTimes[seconds]) {
        trackedTimes[seconds] = true;
        gtag('event', 'time_on_page', {
          'event_category': 'Engagement',
          'event_label': seconds + ' seconds',
          'time_seconds': seconds,
          'page_location': window.location.pathname
        });
      }
    }, seconds * 1000);
  });
})();

// --------------------------------------------------------------------------
// External Link Tracking
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  const externalLinks = document.querySelectorAll('a[target="_blank"], a[href^="http"]:not([href*="doryscleaningservices.com"])');
  externalLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      gtag('event', 'external_link_click', {
        'event_category': 'Navigation',
        'event_label': this.href,
        'link_url': this.href,
        'page_location': window.location.pathname
      });
    });
  });
});

// --------------------------------------------------------------------------
// Service Page Tracking
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  const path = window.location.pathname;

  // Track service page views
  if (path.includes('/services/')) {
    const pathParts = path.split('/').filter(Boolean);
    const service = pathParts[1] || 'unknown';
    const city = pathParts[2] ? pathParts[2].replace('-ma', '') : 'hub';

    gtag('event', 'service_page_view', {
      'event_category': 'Service',
      'event_label': service,
      'service_type': service,
      'city': city,
      'page_type': city === 'hub' ? 'service_hub' : 'service_city'
    });
  }

  // Track location page views
  if (path.includes('/locations/') && !path.endsWith('/locations/')) {
    const city = path.split('/').pop().replace('-ma', '');
    gtag('event', 'location_page_view', {
      'event_category': 'Location',
      'event_label': city,
      'city': city
    });
  }

  // Track blog page views
  if (path.includes('/blog/') && !path.endsWith('/blog/')) {
    const article = path.split('/').pop();
    gtag('event', 'blog_article_view', {
      'event_category': 'Blog',
      'event_label': article,
      'article_slug': article
    });
  }
});

// --------------------------------------------------------------------------
// FAQ Interaction Tracking
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.accordion__header, .faq-accordion__question');
  faqItems.forEach(function(item) {
    item.addEventListener('click', function() {
      const question = this.textContent.trim().substring(0, 100);
      gtag('event', 'faq_click', {
        'event_category': 'Engagement',
        'event_label': question,
        'faq_question': question,
        'page_location': window.location.pathname
      });
    });
  });
});

// --------------------------------------------------------------------------
// City/Service Link Tracking
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  const cityLinks = document.querySelectorAll('.city-link, .nearby-cities__link');
  cityLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      const cityName = this.textContent.trim();
      const href = this.href;

      gtag('event', 'city_link_click', {
        'event_category': 'Navigation',
        'event_label': cityName,
        'destination_city': cityName,
        'link_url': href,
        'page_location': window.location.pathname
      });
    });
  });
});

// --------------------------------------------------------------------------
// Mobile Menu Tracking
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  const mobileToggle = document.querySelector('.header__toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
      gtag('event', 'mobile_menu_toggle', {
        'event_category': 'Navigation',
        'event_label': 'Mobile Menu',
        'page_location': window.location.pathname
      });
    });
  }
});

// --------------------------------------------------------------------------
// Error Page Tracking
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  const path = window.location.pathname;
  if (document.title.includes('404') || path === '/404.html') {
    gtag('event', 'page_not_found', {
      'event_category': 'Error',
      'event_label': '404',
      'page_location': window.location.pathname,
      'referrer': document.referrer
    });
  }
});

console.log('Dorys Analytics initialized');
