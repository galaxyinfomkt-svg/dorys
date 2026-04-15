(function() {
'use strict';
function initVideoEmbeds() {
const videoContainers = document.querySelectorAll('.video-embed[data-video-id]');
if (!videoContainers.length) return;
videoContainers.forEach(container => {
const videoId = container.dataset.videoId;
const thumbnail = container.querySelector('.video-embed__thumbnail');
const playButton = container.querySelector('.video-embed__play');
if (!videoId) return;
if (!thumbnail || !thumbnail.src) {
const thumbImg = thumbnail || document.createElement('img');
thumbImg.className = 'video-embed__thumbnail';
thumbImg.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
thumbImg.alt = 'Video thumbnail - Click to play';
thumbImg.loading = 'lazy';
thumbImg.onerror = function() {
this.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};
if (!thumbnail) {
container.insertBefore(thumbImg, container.firstChild);
}
}
if (!playButton) {
const playBtn = document.createElement('button');
playBtn.className = 'video-embed__play';
playBtn.setAttribute('aria-label', 'Play video');
playBtn.innerHTML = `
<svg viewBox="0 0 24 24" fill="currentColor">
<path d="M8 5v14l11-7z"/>
</svg>
`;
container.appendChild(playBtn);
}
const handleClick = (e) => {
e.preventDefault();
loadVideo(container, videoId);
};
container.addEventListener('click', handleClick);
container.setAttribute('tabindex', '0');
container.setAttribute('role', 'button');
container.setAttribute('aria-label', 'Click to play video');
container.addEventListener('keydown', (e) => {
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
loadVideo(container, videoId);
}
});
});
}
function loadVideo(container, videoId) {
const autoplay = container.dataset.autoplay !== 'false';
const startTime = container.dataset.start || 0;
const controls = container.dataset.controls !== 'false';
const rel = container.dataset.rel !== 'true'; // Don't show related videos by default
const params = new URLSearchParams({
autoplay: autoplay ? 1 : 0,
start: startTime,
controls: controls ? 1 : 0,
rel: rel ? 0 : 1,
modestbranding: 1,
playsinline: 1
});
const iframe = document.createElement('iframe');
iframe.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
iframe.title = 'YouTube video player';
iframe.frameBorder = '0';
iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
iframe.allowFullscreen = true;
iframe.loading = 'lazy';
container.innerHTML = '';
container.appendChild(iframe);
container.classList.add('is-loaded');
if (typeof gtag === 'function') {
gtag('event', 'video_play', {
'video_id': videoId
});
}
}
function extractYouTubeId(url) {
if (!url) return null;
if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
return url;
}
const patterns = [
/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
/youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
];
for (const pattern of patterns) {
const match = url.match(pattern);
if (match) {
return match[1];
}
}
return null;
}
function createVideoEmbed(url, container) {
const videoId = extractYouTubeId(url);
if (!videoId || !container) return null;
container.classList.add('video-embed');
container.dataset.videoId = videoId;
const thumbnail = document.createElement('img');
thumbnail.className = 'video-embed__thumbnail';
thumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
thumbnail.alt = 'Video thumbnail';
thumbnail.loading = 'lazy';
thumbnail.onerror = function() {
this.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};
const playBtn = document.createElement('button');
playBtn.className = 'video-embed__play';
playBtn.setAttribute('aria-label', 'Play video');
playBtn.innerHTML = `
<svg viewBox="0 0 24 24" fill="currentColor">
<path d="M8 5v14l11-7z"/>
</svg>
`;
container.appendChild(thumbnail);
container.appendChild(playBtn);
container.addEventListener('click', (e) => {
e.preventDefault();
loadVideo(container, videoId);
});
return container;
}
function initVideoUrls() {
const containers = document.querySelectorAll('[data-video-url]');
containers.forEach(container => {
const url = container.dataset.videoUrl;
const videoId = extractYouTubeId(url);
if (videoId) {
container.dataset.videoId = videoId;
}
});
}
function init() {
initVideoUrls();
initVideoEmbeds();
}
window.initVideoEmbeds = init;
window.createVideoEmbed = createVideoEmbed;
window.extractYouTubeId = extractYouTubeId;
})();