// js/hero-background-slideshow.js

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('hero-background-slideshow');

    // --- IMPORTANT: CONFIGURE YOUR MEDIA FILES HERE ---
    // List your image and video paths.
    // Images should be .jpg, .png, .webp, etc.
    // Videos should be .mp4, .webm, .ogg (MP4 is most widely supported).
    // Ensure these paths correctly reflect your project structure.
    const mediaFiles = [
        'assets/images/hero-image 2.jpg',
        'assets/videos/Hero-video 2.mp4',
        'assets/images/hero-image 4.jpg',
        'assets/videos/hero-video 3.mp4',
        'assets/images/hero-image 3.jpg',
        'assets/videos/hero-video 4.mp4',
        'assets/images/hero-image.jpg',
        'assets/videos/hero-image 1.mp4' 
    ];

    let currentMediaIndex = 0;
    let slideshowInterval;
    const transitionDurationMs = 1500; // Matches CSS transition duration (1.5s) for smooth fade
    const displayDurationMs = 7000;   // How long each media is fully visible (7s)

    // Helper to check if a URL points to a video
    function isVideo(url) {
        // Checks if the file extension is mp4, webm, or ogg (case-insensitive)
        return url.match(/\.(mp4|webm|ogg)$/i);
    }

    // Function to create a new background layer (div)
    function createBackgroundLayer(mediaUrl) {
        const layer = document.createElement('div');
        layer.classList.add('hero-background-layer');
        // z-index: 2 ensures it's behind the content and overlay but above other background layers
        layer.style.zIndex = '2';
        // Insert the new layer at the beginning of the hero section to stack correctly
        heroSection.insertBefore(layer, heroSection.firstChild);
        return layer;
    }

    // Function to update the hero background with the next media in the sequence
    function updateHeroBackground() {
        if (!heroSection) {
            console.error('Hero section element with ID "hero-background-slideshow" not found.');
            clearInterval(slideshowInterval);
            return;
        }
        if (mediaFiles.length === 0) {
            console.warn('No media files defined for hero background slideshow. Please add paths to the mediaFiles array.');
            clearInterval(slideshowInterval);
            return;
        }

        const nextMediaUrl = mediaFiles[currentMediaIndex];
        const newLayer = createBackgroundLayer(nextMediaUrl);
        let mediaLoaded = false; // Flag to prevent multiple fade-ins if events fire multiple times

        if (isVideo(nextMediaUrl)) {
            const videoElement = document.createElement('video');
            videoElement.src = nextMediaUrl;
            videoElement.muted = true;      // Videos in background should generally be muted
            videoElement.loop = true;       // Loop playback
            videoElement.autoplay = true;   // Attempt autoplay
            videoElement.playsInline = true; // Essential for autoplay on iOS
            videoElement.preload = 'auto';  // Start loading video data early
            videoElement.classList.add('hero-background-video'); // Apply video-specific styling

            // Event listener for when the video has buffered enough to play through
            videoElement.oncanplaythrough = () => {
                if (!mediaLoaded) {
                    mediaLoaded = true;
                    fadeInNewBackground(newLayer);
                    // Attempt to play the video; catch potential errors like autoplay being blocked
                    videoElement.play().catch(e => console.warn("Video autoplay blocked or failed:", e));
                }
            };
            // Error handling for video loading
            videoElement.onerror = () => {
                console.error(`Error loading video: ${nextMediaUrl}. Skipping to next media.`);
                // Clean up the failed layer
                if (newLayer.parentNode) newLayer.parentNode.removeChild(newLayer);
                // Move to the next media immediately
                currentMediaIndex = (currentMediaIndex + 1) % mediaFiles.length;
                updateHeroBackground();
            };
            newLayer.appendChild(videoElement); // Add video to the new background layer
            videoElement.load(); // Explicitly start loading the video
        } else {
            // It's an image
            const img = new Image();
            img.src = nextMediaUrl;
            // Event listener for when the image is fully loaded
            img.onload = () => {
                if (!mediaLoaded) {
                    mediaLoaded = true;
                    // Set background image via CSS
                    newLayer.style.backgroundImage = `url('${nextMediaUrl}')`;
                    fadeInNewBackground(newLayer);
                }
            };
            // Error handling for image loading
            img.onerror = () => {
                console.error(`Error loading image: ${nextMediaUrl}. Skipping to next media.`);
                // Clean up the failed layer
                if (newLayer.parentNode) newLayer.parentNode.removeChild(newLayer);
                // Move to the next media immediately
                currentMediaIndex = (currentMediaIndex + 1) % mediaFiles.length;
                updateHeroBackground();
            };
        }
    }

    // Function to manage the cross-fade effect
    function fadeInNewBackground(newLayer) {
        // Find the currently active background layer
        const currentActiveLayer = heroSection.querySelector('.hero-background-layer.active');

        // If there's an active layer, begin its fade-out process
        if (currentActiveLayer) {
            currentActiveLayer.classList.remove('active'); // This triggers the CSS fade-out
            // After the fade-out transition completes, remove the old layer from the DOM
            // This ensures a smooth cross-fade without elements being prematurely removed
            setTimeout(() => {
                if (currentActiveLayer.parentNode === heroSection) {
                    currentActiveLayer.parentNode.removeChild(currentActiveLayer);
                }
            }, transitionDurationMs + 100); // Add a small buffer just in case
        }

        // Add the 'active' class to the new layer to fade it in
        newLayer.classList.add('active');

        // Move to the next index for the subsequent slideshow iteration
        currentMediaIndex = (currentMediaIndex + 1) % mediaFiles.length;
    }

    // Function to initialize and restart the slideshow interval
    function startSlideshow() {
        clearInterval(slideshowInterval); // Clear any existing interval to prevent duplicates
        slideshowInterval = setInterval(updateHeroBackground, displayDurationMs);
    }

    // Initial setup when the DOM is fully loaded
    if (heroSection && mediaFiles.length > 0) {
        // Immediately load and display the first background without waiting for the first interval
        updateHeroBackground();
        // Start the continuous slideshow after the initial display duration for the first slide
        slideshowInterval = setInterval(updateHeroBackground, displayDurationMs);
    } else {
        // Log a warning if the hero section or media files are not configured
        console.warn('Hero background slideshow: Hero section or media files missing. Slideshow will not run.');
    }
});