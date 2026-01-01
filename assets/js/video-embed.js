/**
 * ==========================================================================
 * VIDEO-EMBED.JS - Dorys Janitorial Cleaning Services
 * YouTube Video Lazy Loading and Embed Handling
 * ==========================================================================
 */

(function() {
  'use strict';

  /**
   * Initialize Video Embeds with Lazy Loading
   */
  function initVideoEmbeds() {
    const videoContainers = document.querySelectorAll('.video-embed[data-video-id]');

    if (!videoContainers.length) return;

    videoContainers.forEach(container => {
      const videoId = container.dataset.videoId;
      const thumbnail = container.querySelector('.video-embed__thumbnail');
      const playButton = container.querySelector('.video-embed__play');

      if (!videoId) return;

      // If no thumbnail provided, load YouTube thumbnail
      if (!thumbnail || !thumbnail.src) {
        const thumbImg = thumbnail || document.createElement('img');
        thumbImg.className = 'video-embed__thumbnail';
        thumbImg.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        thumbImg.alt = 'Video thumbnail - Click to play';
        thumbImg.loading = 'lazy';

        // Fallback to hqdefault if maxres doesn't exist
        thumbImg.onerror = function() {
          this.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        };

        if (!thumbnail) {
          container.insertBefore(thumbImg, container.firstChild);
        }
      }

      // Create play button if not exists
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

      // Click handler to load video
      const handleClick = (e) => {
        e.preventDefault();
        loadVideo(container, videoId);
      };

      container.addEventListener('click', handleClick);

      // Keyboard accessibility
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

  /**
   * Load YouTube video iframe
   */
  function loadVideo(container, videoId) {
    // Get optional parameters
    const autoplay = container.dataset.autoplay !== 'false';
    const startTime = container.dataset.start || 0;
    const controls = container.dataset.controls !== 'false';
    const rel = container.dataset.rel !== 'true'; // Don't show related videos by default

    // Build iframe URL with parameters
    const params = new URLSearchParams({
      autoplay: autoplay ? 1 : 0,
      start: startTime,
      controls: controls ? 1 : 0,
      rel: rel ? 0 : 1,
      modestbranding: 1,
      playsinline: 1
    });

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    iframe.title = 'YouTube video player';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';

    // Clear container and add iframe
    container.innerHTML = '';
    container.appendChild(iframe);
    container.classList.add('is-loaded');

    // Track video play (for analytics)
    if (typeof gtag === 'function') {
      gtag('event', 'video_play', {
        'video_id': videoId
      });
    }
  }

  /**
   * Extract YouTube video ID from various URL formats
   */
  function extractYouTubeId(url) {
    if (!url) return null;

    // Already just an ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }

    // Various YouTube URL formats
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

  /**
   * Create video embed HTML from URL
   * Usage: createVideoEmbed('https://youtu.be/VIDEO_ID', containerElement)
   */
  function createVideoEmbed(url, container) {
    const videoId = extractYouTubeId(url);

    if (!videoId || !container) return null;

    container.classList.add('video-embed');
    container.dataset.videoId = videoId;

    // Create thumbnail
    const thumbnail = document.createElement('img');
    thumbnail.className = 'video-embed__thumbnail';
    thumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    thumbnail.alt = 'Video thumbnail';
    thumbnail.loading = 'lazy';
    thumbnail.onerror = function() {
      this.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    };

    // Create play button
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

    // Add click handler
    container.addEventListener('click', (e) => {
      e.preventDefault();
      loadVideo(container, videoId);
    });

    return container;
  }

  /**
   * Initialize all videos with data-video-url attribute
   * This allows using full YouTube URLs instead of just IDs
   */
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

  /**
   * Main initialization
   */
  function init() {
    initVideoUrls();
    initVideoEmbeds();
  }

  // Expose functions globally
  window.initVideoEmbeds = init;
  window.createVideoEmbed = createVideoEmbed;
  window.extractYouTubeId = extractYouTubeId;

})();
