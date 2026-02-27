/**
 * a11y-patch.js — Accessibility fixes for third-party widgets
 * Patches the LeadConnector chat widget for screen reader support
 */
(function () {
  'use strict';

  function patchChatWidget() {
    // Fix: Button does not have an accessible name
    var closeBtn = document.querySelector('.lc_text-widget_prompt--prompt-close');
    if (closeBtn && !closeBtn.getAttribute('aria-label')) {
      closeBtn.setAttribute('aria-label', 'Close chat prompt');
    }

    // Fix: [aria-hidden="true"] elements contain focusable descendants
    var hiddenEls = document.querySelectorAll('[aria-hidden="true"]');
    hiddenEls.forEach(function (el) {
      // Only patch elements inside the chat widget
      if (!el.closest('#lc_text-widget') && !el.closest('[class*="lc_"]')) return;
      var focusable = el.querySelectorAll('a[href], button, input, select, textarea, [tabindex]');
      focusable.forEach(function (child) {
        child.setAttribute('tabindex', '-1');
      });
    });
  }

  // The chat widget loads asynchronously; observe the DOM for its insertion
  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      if (document.getElementById('lc_text-widget') || document.querySelector('.lc_text-widget--prompt')) {
        patchChatWidget();
        // Keep observing in case the widget re-renders
        break;
      }
    }
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  // Also run after a delay as fallback
  setTimeout(patchChatWidget, 3000);
  setTimeout(patchChatWidget, 6000);
})();
