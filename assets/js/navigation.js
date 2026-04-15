(function() {
'use strict';
function initNavigation() {
initMobileMenu();
initDropdowns();
initActiveLinks();
}
function initMobileMenu() {
const toggle = document.querySelector('.header__toggle');
const nav = document.querySelector('.header__nav');
const overlay = document.querySelector('.header__overlay') || createOverlay();
if (!toggle || !nav) return;
function openMenu() {
toggle.classList.add('is-active');
nav.classList.add('is-open');
overlay.classList.add('is-visible');
document.body.style.overflow = 'hidden';
toggle.setAttribute('aria-expanded', 'true');
nav.setAttribute('aria-hidden', 'false');
nav.removeAttribute('inert');
const firstLink = nav.querySelector('.nav-link');
if (firstLink) {
setTimeout(() => firstLink.focus(), 100);
}
}
function closeMenu() {
toggle.classList.remove('is-active');
nav.classList.remove('is-open');
overlay.classList.remove('is-visible');
document.body.style.overflow = '';
toggle.setAttribute('aria-expanded', 'false');
nav.setAttribute('aria-hidden', 'true');
nav.setAttribute('inert', '');
document.querySelectorAll('.nav-item.is-open').forEach(item => {
item.classList.remove('is-open');
});
}
function toggleMenu() {
if (nav.classList.contains('is-open')) {
closeMenu();
} else {
openMenu();
}
}
toggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', closeMenu);
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape' && nav.classList.contains('is-open')) {
closeMenu();
toggle.focus();
}
});
window.addEventListener('resize', () => {
if (window.innerWidth > 991) {
if (nav.classList.contains('is-open')) {
closeMenu();
}
nav.removeAttribute('aria-hidden');
nav.removeAttribute('inert');
} else if (!nav.classList.contains('is-open')) {
nav.setAttribute('aria-hidden', 'true');
nav.setAttribute('inert', '');
}
});
nav.querySelectorAll('.nav-link:not(.has-dropdown)').forEach(link => {
link.addEventListener('click', () => {
if (window.innerWidth <= 991) {
closeMenu();
}
});
});
toggle.setAttribute('aria-expanded', 'false');
toggle.setAttribute('aria-controls', 'main-navigation');
toggle.setAttribute('aria-label', 'Toggle navigation menu');
nav.setAttribute('id', 'main-navigation');
if (window.innerWidth <= 991) {
nav.setAttribute('aria-hidden', 'true');
nav.setAttribute('inert', '');
}
}
function createOverlay() {
const overlay = document.createElement('div');
overlay.className = 'header__overlay';
document.body.appendChild(overlay);
return overlay;
}
function initDropdowns() {
const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
dropdownItems.forEach(item => {
const link = item.querySelector('.nav-link');
const dropdown = item.querySelector('.nav-dropdown');
if (!link || !dropdown) return;
link.addEventListener('click', (e) => {
if (window.innerWidth <= 991) {
e.preventDefault();
const isOpen = item.classList.contains('is-open');
dropdownItems.forEach(other => {
if (other !== item) {
other.classList.remove('is-open');
}
});
item.classList.toggle('is-open', !isOpen);
}
});
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
dropdown.addEventListener('keydown', (e) => {
if (e.key === 'Escape') {
item.classList.remove('is-open');
link.focus();
}
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
function initActiveLinks() {
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-link, .nav-dropdown__link');
navLinks.forEach(link => {
const href = link.getAttribute('href');
if (!href) return;
if (href === currentPath ||
(href !== '/' && currentPath.startsWith(href))) {
link.classList.add('nav-link--active');
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
window.initNavigation = initNavigation;
})();