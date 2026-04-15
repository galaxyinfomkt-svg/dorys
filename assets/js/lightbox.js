(function() {
'use strict';
function initLightbox() {
const galleryImages = document.querySelectorAll('[data-lightbox]');
if (!galleryImages.length) return;
const lightbox = createLightboxElement();
document.body.appendChild(lightbox);
const overlay = lightbox.querySelector('.lightbox__overlay');
const closeBtn = lightbox.querySelector('.lightbox__close');
const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
const nextBtn = lightbox.querySelector('.lightbox__nav--next');
const image = lightbox.querySelector('.lightbox__image');
const caption = lightbox.querySelector('.lightbox__caption');
const counter = lightbox.querySelector('.lightbox__counter');
let currentIndex = 0;
let images = [];
galleryImages.forEach((img, index) => {
images.push({
src: img.dataset.lightbox || img.src,
alt: img.alt || '',
caption: img.dataset.caption || img.alt || ''
});
img.addEventListener('click', () => openLightbox(index));
img.style.cursor = 'pointer';
img.setAttribute('tabindex', '0');
img.setAttribute('role', 'button');
img.setAttribute('aria-label', `View image: ${img.alt || 'Gallery image'}`);
img.addEventListener('keydown', (e) => {
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
openLightbox(index);
}
});
});
function openLightbox(index) {
currentIndex = index;
updateImage();
lightbox.classList.add('is-open');
document.body.style.overflow = 'hidden';
setTimeout(() => closeBtn.focus(), 100);
trapFocus(lightbox);
}
function closeLightbox() {
lightbox.classList.remove('is-open');
document.body.style.overflow = '';
const originalImage = galleryImages[currentIndex];
if (originalImage) {
originalImage.focus();
}
}
function updateImage() {
const img = images[currentIndex];
image.classList.remove('is-loaded');
image.src = img.src;
image.alt = img.alt;
if (img.caption) {
caption.textContent = img.caption;
caption.style.display = 'block';
} else {
caption.style.display = 'none';
}
counter.textContent = `${currentIndex + 1} / ${images.length}`;
prevBtn.disabled = images.length <= 1;
nextBtn.disabled = images.length <= 1;
image.onload = () => {
image.classList.add('is-loaded');
};
}
function nextImage() {
currentIndex = (currentIndex + 1) % images.length;
updateImage();
}
function prevImage() {
currentIndex = (currentIndex - 1 + images.length) % images.length;
updateImage();
}
overlay.addEventListener('click', closeLightbox);
closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);
document.addEventListener('keydown', (e) => {
if (!lightbox.classList.contains('is-open')) return;
switch (e.key) {
case 'Escape':
closeLightbox();
break;
case 'ArrowRight':
nextImage();
break;
case 'ArrowLeft':
prevImage();
break;
}
});
let touchStartX = 0;
let touchEndX = 0;
lightbox.addEventListener('touchstart', (e) => {
touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
lightbox.addEventListener('touchend', (e) => {
touchEndX = e.changedTouches[0].screenX;
handleSwipe();
}, { passive: true });
function handleSwipe() {
const swipeThreshold = 50;
const diff = touchStartX - touchEndX;
if (Math.abs(diff) < swipeThreshold) return;
if (diff > 0) {
nextImage();
} else {
prevImage();
}
}
}
function createLightboxElement() {
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Image gallery lightbox');
lightbox.innerHTML = `
<div class="lightbox__overlay"></div>
<div class="lightbox__container">
<button class="lightbox__close" aria-label="Close lightbox"></button>
<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image"></button>
<button class="lightbox__nav lightbox__nav--next" aria-label="Next image"></button>
<div class="lightbox__image-wrapper">
<img class="lightbox__image" src="" alt="">
<div class="lightbox__loader"></div>
</div>
<div class="lightbox__caption"></div>
<div class="lightbox__counter"></div>
</div>
`;
return lightbox;
}
function trapFocus(element) {
const focusableElements = element.querySelectorAll(
'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
);
const firstFocusable = focusableElements[0];
const lastFocusable = focusableElements[focusableElements.length - 1];
element.addEventListener('keydown', (e) => {
if (e.key !== 'Tab') return;
if (e.shiftKey) {
if (document.activeElement === firstFocusable) {
e.preventDefault();
lastFocusable.focus();
}
} else {
if (document.activeElement === lastFocusable) {
e.preventDefault();
firstFocusable.focus();
}
}
});
}
window.initLightbox = initLightbox;
})();