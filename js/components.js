// js/components.js

document.addEventListener('DOMContentLoaded', async () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    async function loadPartial(placeholder, filePath) {
        if (placeholder) {
            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const html = await response.text();
                placeholder.innerHTML = html;
            } catch (error) {
                console.error(`Error loading partial ${filePath}:`, error);
                placeholder.innerHTML = `<p style="color: red;">Failed to load ${filePath.split('/').pop()} content.</p>`;
            }
        }
    }

    // Load all components first and wait for them to finish
    await Promise.all([
        loadPartial(headerPlaceholder, 'components/header.html'),
        loadPartial(sidebarPlaceholder, 'components/sidebar.html'),
        loadPartial(footerPlaceholder, 'components/footer.html')
    ]);

    // --- All interactive JavaScript logic below runs AFTER partials are loaded ---

    // 1. Auto-update copyright year (placed here to ensure footer is loaded)
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 2. Scroll to top button logic
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 3. Preloader logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Ensure no-scroll is applied early if preloader is active
        document.body.classList.add('no-scroll'); 
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('no-scroll'); // Re-enable scrolling after preloader
            }, 500); // Match this with your CSS transition duration if any
        });
    }

    // 4. Sidebar toggle logic (for mobile off-canvas menu)
    // Get these references AFTER sidebar and header are loaded
    const sidebarToggle = document.querySelector('.sidebar-toggle'); // In header.html
    const closeSidebarBtn = document.querySelector('.close-sidebar'); // In sidebar.html
    const sidebarNav = document.getElementById('sidebar'); // Assuming sidebar.html nav has ID 'sidebar'
    const sidebarOverlay = document.getElementById('sidebar-overlay'); // From the main HTML pages
    const mediaQueryMobile = window.matchMedia('(max-width: 992px)'); // Mobile breakpoint

    function toggleSidebar() {
        // This function should always toggle the state, regardless of media query,
        // but the *display* of the sidebar is handled by CSS media queries.
        // The no-scroll and overlay should only apply on mobile.
        sidebarNav.classList.toggle('active');
        if (mediaQueryMobile.matches) {
            sidebarOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        } else {
            // Ensure these are reset if screen resized while sidebar was open
            sidebarOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    // Add event listeners only if elements exist
    if (sidebarToggle && sidebarNav && closeSidebarBtn && sidebarOverlay) {
        sidebarToggle.addEventListener('click', toggleSidebar);
        closeSidebarBtn.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar); // Close sidebar when clicking overlay

        // Close sidebar when a navigation link is clicked inside the sidebar
        sidebarNav.addEventListener('click', (event) => { // Use delegation on sidebarNav
            const sidebarLink = event.target.closest('.sidebar-list a');
            if (sidebarLink && sidebarNav.classList.contains('active') && mediaQueryMobile.matches) {
                // Give a small delay to allow navigation before closing animation
                setTimeout(() => {
                    toggleSidebar(); // Call toggle function to ensure all classes are removed
                }, 100);
            }
        });

        // Close sidebar with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebarNav.classList.contains('active')) {
                toggleSidebar();
            }
        });

        // Ensure sidebar state resets on desktop resize if it was open on mobile
        mediaQueryMobile.addEventListener('change', () => {
            if (!mediaQueryMobile.matches && sidebarNav.classList.contains('active')) {
                // If resized to desktop and sidebar is active, close it
                toggleSidebar();
            }
            // Also ensure desktop-specific handling for no-scroll/overlay is correct if it changes
            if (!mediaQueryMobile.matches) {
                sidebarOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });

    } else {
        console.warn('Sidebar or its related elements not found. Sidebar functionality may be limited.');
    }


    // 5. Hide sidebar when footer is visible (desktop only feature)
    const footer = document.querySelector('.main-footer'); // Get this reference AFTER footer is loaded
    const mediaQueryDesktop = window.matchMedia('(min-width: 993px)'); // Desktop breakpoint

    if (sidebarNav && footer) { // Ensure both elements exist before setting up observer
        function handleSidebarFooterIntersection(entries) {
            entries.forEach(entry => {
                if (mediaQueryDesktop.matches) { // Only apply this logic on desktop
                    if (entry.isIntersecting) {
                        sidebarNav.classList.add('hide-on-footer');
                    } else {
                        sidebarNav.classList.remove('hide-on-footer');
                    }
                } else {
                    // On mobile, ensure sidebar is not forcibly hidden by this logic
                    sidebarNav.classList.remove('hide-on-footer');
                }
            });
        }

        const footerObserver = new IntersectionObserver(handleSidebarFooterIntersection, {
            root: null, // Observe relative to the viewport
            rootMargin: '0px', // No extra margin
            threshold: 0 // Trigger as soon as any part of the footer is visible
        });

        footerObserver.observe(footer);

        mediaQueryDesktop.addEventListener('change', () => {
            // Manually re-evaluate sidebar visibility based on current footer state
            // when media query changes from mobile to desktop
            if (mediaQueryDesktop.matches) {
                const footerRect = footer.getBoundingClientRect();
                const isFooterVisible = (footerRect.top < window.innerHeight && footerRect.bottom > 0);
                if (isFooterVisible) {
                    sidebarNav.classList.add('hide-on-footer');
                } else {
                    sidebarNav.classList.remove('hide-on-footer');
                }
            } else {
                sidebarNav.classList.remove('hide-on-footer');
            }
        });
    } else {
        console.warn('Sidebar navigation or main footer element not found after partials loaded. Hide-on-footer feature may not work.');
    }

    // 6. Theme toggle logic (light/dark mode)
    const themeToggleDesktop = document.getElementById('themeToggle'); // Desktop button
    const themeToggleSidebar = document.getElementById('themeToggleSidebar'); // Sidebar button (optional)

    // Function to update the icons based on the current theme
    // Assumes both sun and moon icons are present in the button HTML
    function updateThemeToggleIcons(isDarkMode) {
        const toggleButtons = [themeToggleDesktop, themeToggleSidebar].filter(Boolean); // Filter out null/undefined

        toggleButtons.forEach(btn => {
            const sunIcon = btn.querySelector('.fa-sun');
            const moonIcon = btn.querySelector('.fa-moon');

            if (sunIcon && moonIcon) {
                sunIcon.style.opacity = isDarkMode ? '0' : '1';
                moonIcon.style.opacity = isDarkMode ? '1' : '0';
                sunIcon.style.display = isDarkMode ? 'none' : 'inline-block'; // Use display to truly hide/show
                moonIcon.style.display = isDarkMode ? 'inline-block' : 'none';
            }
        });
    }

    // Function to apply the theme to the body and save preference
    function applyTheme(isDarkMode) {
        document.body.classList.toggle('dark-mode', isDarkMode);
        document.body.classList.toggle('light-mode', !isDarkMode); // Ensure light-mode is explicitly handled
        localStorage.setItem('darkMode', isDarkMode);
        updateThemeToggleIcons(isDarkMode);
    }

    // Check for saved theme preference on initial load
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
        applyTheme(savedDarkMode === 'true'); // Convert string 'true'/'false' to boolean
    } else {
        // Default to system preference if no saved preference
        applyTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    // Event listener for desktop theme toggle button
    if (themeToggleDesktop) {
        themeToggleDesktop.addEventListener('click', () => {
            const isDarkMode = document.body.classList.contains('dark-mode');
            applyTheme(!isDarkMode); // Toggle theme
        });
    }

    // Event listener for sidebar theme toggle button
    if (themeToggleSidebar) {
        themeToggleSidebar.addEventListener('click', () => {
            const isDarkMode = document.body.classList.contains('dark-mode');
            applyTheme(!isDarkMode); // Toggle theme
            // Optionally, close sidebar after theme toggle on mobile
            if (mediaQueryMobile.matches) {
                toggleSidebar();
            }
        });
    }

    // 7. Active Navigation Link Highlighting
    // Get the current page filename (e.g., 'index.html', 'about.html')
    // Fallback to 'index.html' if path is empty (e.g., root domain)
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const highlightActiveNavLink = () => {
        // Select all navigation links across header and sidebar
        // Ensure you have #sidebar and .top-nav-list based on your HTML
        const allNavLinks = document.querySelectorAll('#sidebar .sidebar-list a, .top-nav-list a');

        allNavLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop() || 'index.html'; // Handle empty href for root

            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // Call it after all components are loaded and DOM is ready
    highlightActiveNavLink();


    // 8. Intersection Observer for Scroll Animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of element visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    animateElements.forEach(element => {
        observer.observe(element);
    });
});