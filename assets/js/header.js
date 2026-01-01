/**
 * ==========================================================================
 * HEADER.JS - Dorys Janitorial Cleaning Services
 * Sticky Header Functionality
 * ==========================================================================
 */

(function() {
  'use strict';

  /**
   * Initialize Sticky Header
   */
  function initStickyHeader() {
    const header = document.querySelector('.header');
    const topBar = document.querySelector('.top-bar');

    if (!header) return;

    const topBarHeight = topBar ? topBar.offsetHeight : 0;
    let lastScrollY = 0;
    let ticking = false;

    /**
     * Update header state based on scroll position
     */
    const updateHeader = () => {
      const scrollY = window.scrollY;

      // Add scrolled class when past top bar
      if (scrollY > topBarHeight) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      // Optional: Hide/show header on scroll direction
      // Uncomment below for hide-on-scroll-down behavior
      /*
      if (scrollY > lastScrollY && scrollY > 200) {
        // Scrolling down
        header.classList.add('header--hidden');
      } else {
        // Scrolling up
        header.classList.remove('header--hidden');
      }
      */

      lastScrollY = scrollY;
      ticking = false;
    };

    /**
     * Request animation frame for smooth updates
     */
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial check
    updateHeader();
  }

  // Expose function globally
  window.initStickyHeader = initStickyHeader;

})();
