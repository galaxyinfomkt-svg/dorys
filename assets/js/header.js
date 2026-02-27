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

    let topBarHeight = 44;
    let currentScrollY = 0;
    let ticking = false;

    requestAnimationFrame(function() {
      if (topBar) topBarHeight = topBar.offsetHeight;
    });

    /**
     * Write-only rAF callback (no reads = no forced reflow)
     */
    const updateHeader = () => {
      if (currentScrollY > topBarHeight) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
      ticking = false;
    };

    /**
     * Read scrollY here (outside rAF) then schedule write
     */
    const onScroll = () => {
      currentScrollY = window.pageYOffset;
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Defer initial read to avoid forced reflow during page load
    requestAnimationFrame(function() {
      currentScrollY = window.pageYOffset;
      updateHeader();
    });
  }

  // Expose function globally
  window.initStickyHeader = initStickyHeader;

})();
