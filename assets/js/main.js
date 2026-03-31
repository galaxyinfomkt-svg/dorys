/**
 * ==========================================================================
 * MAIN.JS - Dorys Janitorial Cleaning Services
 * Core JavaScript: Initialization, Utilities, Global Functions
 * ==========================================================================
 */

(function() {
  'use strict';

  // -------------------------------------------------------------------------
  // DOM Ready Utility
  // -------------------------------------------------------------------------
  const domReady = (callback) => {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  };

  // -------------------------------------------------------------------------
  // Utility Functions
  // -------------------------------------------------------------------------

  /**
   * Debounce function to limit execution rate
   */
  const debounce = (func, wait = 100) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  /**
   * Throttle function to limit execution rate
   */
  const throttle = (func, limit = 100) => {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  /**
   * Smooth scroll to element
   */
  const smoothScrollTo = (target, offset = 0) => {
    const element = typeof target === 'string'
      ? document.querySelector(target)
      : target;

    if (!element) return;

    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  /**
   * Get scroll position
   */
  const getScrollPosition = () => ({
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  });

  /**
   * Check if element is in viewport
   */
  const isInViewport = (element, threshold = 0) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight - threshold) &&
      rect.bottom >= threshold &&
      rect.left <= (window.innerWidth - threshold) &&
      rect.right >= threshold
    );
  };

  /**
   * Add class with animation frame
   */
  const addClass = (element, className) => {
    requestAnimationFrame(() => {
      element.classList.add(className);
    });
  };

  /**
   * Remove class with animation frame
   */
  const removeClass = (element, className) => {
    requestAnimationFrame(() => {
      element.classList.remove(className);
    });
  };

  /**
   * Toggle class
   */
  const toggleClass = (element, className) => {
    element.classList.toggle(className);
  };

  /**
   * Get URL parameter
   */
  const getUrlParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  /**
   * Format phone number for tel: link
   */
  const formatPhoneLink = (phone) => {
    return 'tel:+1' + phone.replace(/\D/g, '');
  };

  /**
   * Copy to clipboard
   */
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  };

  // -------------------------------------------------------------------------
  // Back to Top Button
  // -------------------------------------------------------------------------
  const initBackToTop = () => {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    const showButton = () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    };

    window.addEventListener('scroll', throttle(showButton, 100));

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  // -------------------------------------------------------------------------
  // Smooth Scroll Links
  // -------------------------------------------------------------------------
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#" or empty
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          smoothScrollTo(target);
        }
      });
    });
  };

  // -------------------------------------------------------------------------
  // Accordion/FAQ
  // -------------------------------------------------------------------------
  const initAccordion = () => {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
      const items = accordion.querySelectorAll('.accordion__item');

      items.forEach(item => {
        const header = item.querySelector('.accordion__header');

        header.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');

          // Close all items in this accordion (optional: for single open)
          items.forEach(i => i.classList.remove('is-open'));

          // Toggle current item
          if (!isOpen) {
            item.classList.add('is-open');
          }
        });

        // Keyboard accessibility
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
          }
        });
      });
    });
  };

  // -------------------------------------------------------------------------
  // Form Validation
  // -------------------------------------------------------------------------
  const initFormValidation = () => {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        let isValid = true;

        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('form-input--error');
            showFieldError(field, 'This field is required');
          } else {
            field.classList.remove('form-input--error');
            hideFieldError(field);
          }
        });

        // Email validation
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
          if (field.value && !isValidEmail(field.value)) {
            isValid = false;
            field.classList.add('form-input--error');
            showFieldError(field, 'Please enter a valid email address');
          }
        });

        // Phone validation
        const phoneFields = form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
          if (field.value && !isValidPhone(field.value)) {
            isValid = false;
            field.classList.add('form-input--error');
            showFieldError(field, 'Please enter a valid phone number');
          }
        });

        if (!isValid) {
          e.preventDefault();
        }
      });
    });
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[\d\s\-\(\)\+]{10,}$/.test(phone);
  };

  const showFieldError = (field, message) => {
    let errorEl = field.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains('form-error')) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      field.parentNode.insertBefore(errorEl, field.nextSibling);
    }
    errorEl.textContent = message;
  };

  const hideFieldError = (field) => {
    const errorEl = field.nextElementSibling;
    if (errorEl && errorEl.classList.contains('form-error')) {
      errorEl.remove();
    }
  };

  // -------------------------------------------------------------------------
  // Lazy Load Images
  // -------------------------------------------------------------------------
  const initLazyLoad = () => {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            img.classList.add('is-loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
      });
    }
  };

  // -------------------------------------------------------------------------
  // Counter Animation
  // -------------------------------------------------------------------------
  const initCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.5
      });

      counters.forEach(counter => counterObserver.observe(counter));
    }
  };

  const animateCounter = (element) => {
    const target = parseInt(element.dataset.counter, 10);
    const duration = parseInt(element.dataset.duration, 10) || 2000;
    const suffix = element.dataset.suffix || '';
    const start = 0;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * (target - start) + start);

      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString() + suffix;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // -------------------------------------------------------------------------
  // Click Tracking (for analytics)
  // -------------------------------------------------------------------------
  const initClickTracking = () => {
    // Track CTA clicks
    document.querySelectorAll('[data-track]').forEach(element => {
      element.addEventListener('click', () => {
        const trackingData = element.dataset.track;
        // Send to analytics (Google Analytics, etc.)
        if (typeof gtag === 'function') {
          gtag('event', 'click', {
            'event_category': 'CTA',
            'event_label': trackingData
          });
        }
      });
    });

    // Track phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', () => {
        if (typeof gtag === 'function') {
          gtag('event', 'click', {
            'event_category': 'Contact',
            'event_label': 'Phone Call'
          });
        }
      });
    });

    // Track email clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      link.addEventListener('click', () => {
        if (typeof gtag === 'function') {
          gtag('event', 'click', {
            'event_category': 'Contact',
            'event_label': 'Email'
          });
        }
      });
    });
  };

  // -------------------------------------------------------------------------
  // Initialize All Modules
  // -------------------------------------------------------------------------
  const init = () => {
    // Core functionality
    initBackToTop();
    initSmoothScroll();
    initAccordion();
    initFormValidation();
    initLazyLoad();
    initCounters();
    initClickTracking();

    // Initialize other modules if they exist
    if (typeof initStickyHeader === 'function') initStickyHeader();
    if (typeof initScrollAnimations === 'function') initScrollAnimations();
    if (typeof initLightbox === 'function') initLightbox();
    if (typeof initNavigation === 'function') initNavigation();
    if (typeof initVideoEmbeds === 'function') initVideoEmbeds();

    // Add loaded class to body
    document.body.classList.add('is-loaded');
  };

  // -------------------------------------------------------------------------
  // Expose utilities globally
  // -------------------------------------------------------------------------
  window.DorysUtils = {
    debounce,
    throttle,
    smoothScrollTo,
    getScrollPosition,
    isInViewport,
    addClass,
    removeClass,
    toggleClass,
    getUrlParam,
    formatPhoneLink,
    copyToClipboard
  };

  // -------------------------------------------------------------------------
  // Run on DOM Ready
  // -------------------------------------------------------------------------
  domReady(init);

})();
