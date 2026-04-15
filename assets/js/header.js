(function() {
'use strict';
function initStickyHeader() {
const header = document.querySelector('.header');
const topBar = document.querySelector('.top-bar');
if (!header) return;
var topBarHeight = 44;
var currentScrollY = 0;
var ticking = false;
const updateHeader = () => {
if (currentScrollY > topBarHeight) {
header.classList.add('header--scrolled');
} else {
header.classList.remove('header--scrolled');
}
ticking = false;
};
const onScroll = () => {
currentScrollY = window.pageYOffset;
if (!ticking) {
requestAnimationFrame(updateHeader);
ticking = true;
}
};
window.addEventListener('scroll', onScroll, { passive: true });
requestAnimationFrame(function() {
currentScrollY = window.pageYOffset;
updateHeader();
});
}
window.initStickyHeader = initStickyHeader;
})();