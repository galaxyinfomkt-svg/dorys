(function () {
'use strict';
function patchChatWidget() {
var closeBtn = document.querySelector('.lc_text-widget_prompt--prompt-close');
if (closeBtn && !closeBtn.getAttribute('aria-label')) {
closeBtn.setAttribute('aria-label', 'Close chat prompt');
}
var hiddenEls = document.querySelectorAll('[aria-hidden="true"]');
hiddenEls.forEach(function (el) {
if (!el.closest('#lc_text-widget') && !el.closest('[class*="lc_"]')) return;
var focusable = el.querySelectorAll('a[href], button, input, select, textarea, [tabindex]');
focusable.forEach(function (child) {
child.setAttribute('tabindex', '-1');
});
});
}
var observer = new MutationObserver(function (mutations) {
for (var i = 0; i < mutations.length; i++) {
if (document.getElementById('lc_text-widget') || document.querySelector('.lc_text-widget--prompt')) {
patchChatWidget();
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
setTimeout(patchChatWidget, 3000);
setTimeout(patchChatWidget, 6000);
})();