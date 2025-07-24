// js/main.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Function to load HTML partials (integrated from load-partials.js) ---
    async function loadPartial(id, url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = html;
            }
        } catch (error) {
            console.error(`Could not load components ${url}:`, error);
        }
    }

    // Load Header, Sidebar, and Footer first, as other scripts might depend on them
    // These calls are not awaiting, so they run in parallel, which is fine
    // as long as dependent DOM queries are inside the 'DOMContentLoaded' listener
    // or use a short setTimeout for safety.
    loadPartial('header-placeholder', 'components/header.html');
    loadPartial('sidebar-placeholder', 'components/sidebar.html');
    loadPartial('footer-placeholder', 'components/footer.html');


    // --- Preloader Functionality ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Hide preloader once all assets are loaded
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500); // Allow time for the fade-out transition
        });

        // Fallback for DOMContentLoaded in case load event doesn't fire as expected (e.g., cached pages)
        // This ensures the preloader doesn't stick around if the page is instantly "complete".
        if (document.readyState === 'complete') {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }


    // --- Sidebar Mobile Navigation Functionality ---
    // Using event delegation for dynamically loaded elements like .sidebar-toggle and .close-sidebar
    document.addEventListener('click', (event) => {
        const sidebarToggle = event.target.closest('.sidebar-toggle');
        const closeSidebarBtn = event.target.closest('.close-sidebar'); // Button inside sidebar header
        const sidebarOverlay = document.getElementById('sidebar-overlay'); // From sidebar.html

        const sidebarNav = document.getElementById('sidebar-nav'); // From sidebar.html
        const body = document.body; // To manage no-scroll class

        // Open Sidebar
        if (sidebarToggle) {
            if (sidebarNav) sidebarNav.classList.add('active');
            if (sidebarOverlay) sidebarOverlay.classList.add('active');
            body.classList.add('no-scroll'); // Prevent body scroll
        }
        // Close Sidebar (clicking close button or overlay)
        else if (closeSidebarBtn || (sidebarOverlay && event.target === sidebarOverlay)) {
            if (sidebarNav) sidebarNav.classList.remove('active');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });

    // Close sidebar when a navigation link is clicked inside the sidebar
    document.addEventListener('click', (event) => {
        const sidebarLink = event.target.closest('.sidebar-list a');
        const sidebarNav = document.getElementById('sidebar-nav');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const body = document.body;

        if (sidebarLink && sidebarNav && sidebarNav.classList.contains('active')) {
            // Give a small delay to allow navigation before closing animation
            setTimeout(() => {
                sidebarNav.classList.remove('active');
                if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                body.classList.remove('no-scroll');
            }, 100); // Adjust delay as needed
        }
    });


    // --- Scroll-to-Top Button ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show after scrolling 300px down
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        // Smooth scroll to top when clicked
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // --- Active Navigation Link Highlighting (Updated for Sidebar & Top-Right Nav) ---
    // Get filename from current URL, default to 'index.html' for root path
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Function to set active class
    const setActiveLink = (link) => {
        // Only add 'active' if it's not a social media link or a button
        if (!link.classList.contains('fab') && !link.classList.contains('btn')) {
            link.classList.add('active');
        }
    };

    // Use a short delay for elements loaded via partials to ensure they are in the DOM
    // For Sidebar Links
    setTimeout(() => {
        const sidebarLinks = document.querySelectorAll('#sidebar-nav .sidebar-list a');
        sidebarLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            if (linkPath === currentPath) {
                setActiveLink(link);
            } else {
                link.classList.remove('active'); // Ensure only one is active
            }
        });
    }, 150); // Small delay to allow sidebar.html to be loaded

    // For Top-Right Navbar Links (if they navigate to internal pages)
    setTimeout(() => {
        const topNavLinks = document.querySelectorAll('.top-nav-list a');
        topNavLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            if (linkPath === currentPath) {
                setActiveLink(link);
            } else {
                link.classList.remove('active'); // Remove 'active' if it somehow got added
            }
        });
    }, 150); // Small delay to allow header.html to be loaded

});