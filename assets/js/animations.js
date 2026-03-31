/**
 * ==========================================================================
 * ANIMATIONS.JS - Dorys Janitorial Cleaning Services
 * Scroll-triggered Animations using Intersection Observer
 * ==========================================================================
 */

(function() {
  'use strict';

  /**
   * Initialize Scroll Animations
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (!animatedElements.length) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // If user prefers reduced motion, show all elements immediately
      animatedElements.forEach(element => {
        element.classList.add('is-visible');
      });
      return;
    }

    // Intersection Observer options
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px 0px -50px 0px', // trigger slightly before element enters
      threshold: 0.1 // trigger when 10% is visible
    };

    /**
     * Callback for Intersection Observer
     */
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add visible class with a small delay for stagger effect
          const element = entry.target;
          const delay = element.dataset.animationDelay || 0;

          setTimeout(() => {
            element.classList.add('is-visible');
          }, delay);

          // Stop observing this element
          observer.unobserve(element);
        }
      });
    };

    // Create observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * Initialize Stagger Animations
   * For parent elements with class .stagger-children
   */
  function initStaggerAnimations() {
    const staggerContainers = document.querySelectorAll('.stagger-children');

    if (!staggerContainers.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      staggerContainers.forEach(container => {
        container.classList.add('is-visible');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -30px 0px',
      threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    staggerContainers.forEach(container => {
      observer.observe(container);
    });
  }

  /**
   * Initialize Parallax Effects
   */
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (!parallaxElements.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;

      parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const distance = scrollY - elementTop;

        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const translateY = distance * speed;
          element.style.transform = `translateY(${translateY}px)`;
        }
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Initialize Text Reveal Animation
   * For elements with data-reveal attribute
   */
  function initTextReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    if (!revealElements.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    revealElements.forEach(element => {
      const text = element.textContent;
      const words = text.split(' ');

      element.innerHTML = '';
      element.style.visibility = 'visible';

      words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'reveal-word';
        wordSpan.style.transitionDelay = `${index * 50}ms`;
        wordSpan.textContent = word + ' ';
        element.appendChild(wordSpan);
      });
    });

    const observerOptions = {
      threshold: 0.5
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    revealElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * Initialize Progress Bar Animation
   */
  function initProgressBars() {
    const progressBars = document.querySelectorAll('[data-progress]');

    if (!progressBars.length) return;

    const observerOptions = {
      threshold: 0.5
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.dataset.progress + '%';
          bar.style.width = targetWidth;
          observer.unobserve(bar);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    progressBars.forEach(bar => {
      bar.style.width = '0%';
      bar.style.transition = 'width 1s ease-out';
      observer.observe(bar);
    });
  }

  /**
   * Initialize all animation functions
   */
  function init() {
    initScrollAnimations();
    initStaggerAnimations();
    initParallax();
    initTextReveal();
    initProgressBars();
  }

  // Expose function globally
  window.initScrollAnimations = init;

})();
