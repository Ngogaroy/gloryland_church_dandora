document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    const filterCategory = document.getElementById('filterCategory');
    const filterYear = document.getElementById('filterYear');
    const loadMoreBtn = document.getElementById('loadMoreGallery');

    // --- Gallery Data ---
    // IMPORTANT: Replace the 'thumbSrc' and 'fullSrc' paths with your actual image paths.
    // Ensure you have an 'assets/images/gallery/' folder with your images.
    // Each item should have a thumbnail (for the grid) and a full-size image (for the lightbox).
    const galleryItemsData = [
        {
            id: 1,
            fullSrc: 'assets/images/gallery/church-history-1.jpg',
            thumbSrc: 'assets/images/gallery/church-history-1-thumb.jpg',
            title: 'Early Days - Church Founding',
            category: 'history',
            year: 'older'
        },
        {
            id: 2,
            fullSrc: 'assets/images/gallery/event-fellowship-1.jpg',
            thumbSrc: 'assets/images/gallery/event-fellowship-1-thumb.jpg',
            title: 'Annual Church Picnic 2024',
            category: 'events',
            year: '2024'
        },
        {
            id: 3,
            fullSrc: 'assets/images/gallery/outreach-project-1.jpg',
            thumbSrc: 'assets/images/gallery/outreach-project-1-thumb.jpg',
            title: 'Dandora Clean-up Initiative',
            category: 'outreach',
            year: '2023'
        },
        {
            id: 4,
            fullSrc: 'assets/images/gallery/worship-service-1.jpg',
            thumbSrc: 'assets/images/gallery/worship-service-1-thumb.jpg',
            title: 'Sunday Service Worship 2024',
            category: 'worship',
            year: '2024'
        },
        {
            id: 5,
            fullSrc: 'assets/images/gallery/church-history-2.jpg',
            thumbSrc: 'assets/images/gallery/church-history-2-thumb.jpg',
            title: 'First Church Building Dedication',
            category: 'history',
            year: '2022'
        },
        {
            id: 6,
            fullSrc: 'assets/images/gallery/event-fellowship-2.jpg',
            thumbSrc: 'assets/images/gallery/event-fellowship-2-thumb.jpg',
            title: 'Youth Camp 2023',
            category: 'events',
            year: '2023'
        },
        {
            id: 7,
            fullSrc: 'assets/images/gallery/outreach-project-2.jpg',
            thumbSrc: 'assets/images/gallery/outreach-project-2-thumb.jpg',
            title: 'Medical Camp 2024',
            category: 'outreach',
            year: '2024'
        },
        {
            id: 8,
            fullSrc: 'assets/images/gallery/worship-service-2.jpg',
            thumbSrc: 'assets/images/gallery/worship-service-2-thumb.jpg',
            title: 'Easter Sunday Service 2023',
            category: 'worship',
            year: '2023'
        },
        {
            id: 9,
            fullSrc: 'assets/images/gallery/event-fellowship-3.jpg',
            thumbSrc: 'assets/images/gallery/event-fellowship-3-thumb.jpg',
            title: 'Christmas Carols 2024',
            category: 'events',
            year: '2024'
        },
        {
            id: 10,
            fullSrc: 'assets/images/gallery/outreach-project-3.jpg',
            thumbSrc: 'assets/images/gallery/outreach-project-3-thumb.jpg',
            title: 'Food Distribution Dandora 2023',
            category: 'outreach',
            year: '2023'
        },
        {
            id: 11,
            fullSrc: 'assets/images/gallery/church-history-3.jpg',
            thumbSrc: 'assets/images/gallery/church-history-3-thumb.jpg',
            title: 'Community Blessing Ceremony',
            category: 'history',
            year: 'older'
        },
        {
            id: 12,
            fullSrc: 'assets/images/gallery/worship-service-3.jpg',
            thumbSrc: 'assets/images/gallery/worship-service-3-thumb.jpg',
            title: 'Thanksgiving Service 2022',
            category: 'worship',
            year: '2022'
        }
        // Add more gallery items here following the same structure
    ];

    let itemsPerLoad = 6; // Number of items to load initially and with 'Load More'
    let loadedItemsCount = 0;
    let currentFilteredItems = [];

    // --- Helper Functions ---

    /**
     * Creates the HTML string for a single gallery item.
     * @param {object} item - The gallery item data object.
     * @returns {string} The HTML string for the gallery item.
     */
    function createGalleryItemHTML(item) {
        return `
            <div class="gallery-item" data-category="${item.category}" data-year="${item.year}">
                <a href="${item.fullSrc}" data-lightbox="gallery" data-title="${item.title}">
                    <img src="${item.thumbSrc}" alt="${item.title}">
                    <div class="overlay">
                        <span class="title">${item.title}</span>
                        <span class="category">#${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                    </div>
                </a>
            </div>
        `;
    }

    /**
     * Displays a given array of items in the gallery grid.
     * @param {Array<object>} items - The items to display.
     * @param {boolean} clearExisting - If true, clears the grid before adding new items.
     */
    function displayItems(items, clearExisting = false) {
        if (clearExisting) {
            galleryGrid.innerHTML = ''; // Clear existing items for filtering
            loadedItemsCount = 0; // Reset loaded count for new filter
        }

        const itemsToAppend = items.slice(loadedItemsCount, loadedItemsCount + itemsPerLoad);

        itemsToAppend.forEach(item => {
            galleryGrid.insertAdjacentHTML('beforeend', createGalleryItemHTML(item));
        });

        loadedItemsCount += itemsToAppend.length;

        // Show/hide 'Load More' button based on remaining items
        if (loadedItemsCount >= items.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }

        // Re-initialize Lightbox after new items are added
        // This is crucial for Lightbox to recognize newly added elements.
        lightbox.option({
            'albumLabel': 'Image %1 of %2' // Customize Lightbox album label if needed
        });
    }

    /**
     * Applies filters and re-renders the gallery.
     */
    function applyFilters() {
        const selectedCategory = filterCategory.value;
        const selectedYear = filterYear.value;

        currentFilteredItems = galleryItemsData.filter(item => {
            const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
            const yearMatch = selectedYear === 'all' || item.year === selectedYear;
            return categoryMatch && yearMatch;
        });

        displayItems(currentFilteredItems, true); // Clear and display filtered items
    }

    /**
     * Loads more items into the gallery based on current filters.
     */
    function loadMore() {
        // Just re-call displayItems, it will pick up from where it left off
        displayItems(currentFilteredItems);
    }

    // --- Event Listeners ---
    filterCategory.addEventListener('change', applyFilters);
    filterYear.addEventListener('change', applyFilters);
    loadMoreBtn.addEventListener('click', loadMore);

    // --- Initial Load ---
    // Perform initial filtering and display the first set of items
    applyFilters();
});