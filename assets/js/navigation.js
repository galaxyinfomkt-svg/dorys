/**
 * ==========================================================================
 * NAVIGATION.JS - Dorys Janitorial Cleaning Services
 * Mobile Menu + Dropdown Navigation
 * ==========================================================================
 */

(function() {
  'use strict';

  /**
   * Initialize Navigation
   */
  function initNavigation() {
    initMobileMenu();
    initDropdowns();
    initActiveLinks();
  }

  /**
   * Initialize Mobile Menu Toggle
   */
  function initMobileMenu() {
    const toggle = document.querySelector('.header__toggle');
    const nav = document.querySelector('.header__nav');
    const overlay = document.querySelector('.header__overlay') || createOverlay();

    if (!toggle || !nav) return;

    /**
     * Open mobile menu
     */
    function openMenu() {
      toggle.classList.add('is-active');
      nav.classList.add('is-open');
      overlay.classList.add('is-visible');
      document.body.style.overflow = 'hidden';

      // Update ARIA attributes
      toggle.setAttribute('aria-expanded', 'true');
      nav.setAttribute('aria-hidden', 'false');

      // Focus first link
      const firstLink = nav.querySelector('.nav-link');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
    }

    /**
     * Close mobile menu
     */
    function closeMenu() {
      toggle.classList.remove('is-active');
      nav.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      document.body.style.overflow = '';

      // Update ARIA attributes
      toggle.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');

      // Close all dropdowns
      document.querySelectorAll('.nav-item.is-open').forEach(item => {
        item.classList.remove('is-open');
      });
    }

    /**
     * Toggle mobile menu
     */
    function toggleMenu() {
      if (nav.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    // Toggle click handler
    toggle.addEventListener('click', toggleMenu);

    // Overlay click handler
    overlay.addEventListener('click', closeMenu);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && nav.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Close when clicking nav links (for single page navigation)
    nav.querySelectorAll('.nav-link:not(.has-dropdown)').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 991) {
          closeMenu();
        }
      });
    });

    // Set initial ARIA attributes
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'main-navigation');
    toggle.setAttribute('aria-label', 'Toggle navigation menu');
    nav.setAttribute('id', 'main-navigation');
    nav.setAttribute('aria-hidden', 'true');
  }

  /**
   * Create overlay element if it doesn't exist
   */
  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'header__overlay';
    document.body.appendChild(overlay);
    return overlay;
  }

  /**
   * Initialize Dropdown Menus
   */
  function initDropdowns() {
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

    dropdownItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      const dropdown = item.querySelector('.nav-dropdown');

      if (!link || !dropdown) return;

      // For mobile: toggle on click
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 991) {
          e.preventDefault();
          const isOpen = item.classList.contains('is-open');

          // Close other dropdowns
          dropdownItems.forEach(other => {
            if (other !== item) {
              other.classList.remove('is-open');
            }
          });

          // Toggle this dropdown
          item.classList.toggle('is-open', !isOpen);
        }
      });

      // For desktop: hover behavior is handled by CSS
      // But we add keyboard support

      // Keyboard navigation
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (window.innerWidth <= 991) {
            e.preventDefault();
            link.click();
          }
        }

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          item.classList.add('is-open');
          const firstDropdownLink = dropdown.querySelector('.nav-dropdown__link');
          if (firstDropdownLink) firstDropdownLink.focus();
        }
      });

      // Close dropdown when pressing Escape
      dropdown.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          item.classList.remove('is-open');
          link.focus();
        }

        // Arrow navigation within dropdown
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const links = Array.from(dropdown.querySelectorAll('.nav-dropdown__link'));
          const currentIndex = links.indexOf(document.activeElement);

          if (e.key === 'ArrowDown') {
            const nextIndex = (currentIndex + 1) % links.length;
            links[nextIndex].focus();
          } else {
            const prevIndex = (currentIndex - 1 + links.length) % links.length;
            links[prevIndex].focus();
          }
        }
      });

      // Close when focus leaves dropdown (for desktop)
      item.addEventListener('focusout', (e) => {
        if (window.innerWidth > 991) {
          setTimeout(() => {
            if (!item.contains(document.activeElement)) {
              item.classList.remove('is-open');
            }
          }, 100);
        }
      });
    });
  }

  /**
   * Initialize Active Link Highlighting
   */
  function initActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .nav-dropdown__link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');

      if (!href) return;

      // Check if this link matches current path
      if (href === currentPath ||
          (href !== '/' && currentPath.startsWith(href))) {
        link.classList.add('nav-link--active');

        // If it's a dropdown link, also mark parent as active
        const parentItem = link.closest('.nav-item.has-dropdown');
        if (parentItem) {
          const parentLink = parentItem.querySelector('.nav-link');
          if (parentLink) {
            parentLink.classList.add('nav-link--active');
          }
        }
      }
    });
  }

  /**
   * Update active state based on scroll position (for single page)
   */
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
      rootMargin: '-20% 0px -80% 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');

          navLinks.forEach(link => {
            link.classList.remove('nav-link--active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('nav-link--active');
            }
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  // Expose function globally
  window.initNavigation = initNavigation;

})();
