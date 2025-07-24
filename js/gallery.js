document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    const filterCategory = document.getElementById('filterCategory');
    const filterYear = document.getElementById('filterYear');
    const loadMoreBtn = document.getElementById('loadMoreGallery');

    // --- Gallery Data ---
    // Each item should have a thumbnail (for the grid) and a full-size image (for the lightbox).
    const galleryItemsData = [
        {
            id: 1,
            fullSrc: '../assets/GLC_Gallery/cultural_day.jpg',
            thumbSrc: '../assets/GLC_Gallery/cultural_day.jpg',
            title: 'Cultural Day - Tribe of Judah',
            category: 'history',
            year: 'older'
        },
        {
            id: 2,
            fullSrc: '..assets/GLC_Gallery/481915374_959527262992345_8275739458963535782_n.jpg',
            thumbSrc: '../assets/GLC_Gallery/481915374_959527262992345_8275739458963535782_n.jpg',
            title: 'Annual Church Picnic 2024',
            category: 'events',
            year: '2024'
        },
        {
            id: 3,
            fullSrc: '../assets/GLC_Gallery/481263837_959523959659342_6951409627740982044_n.jpg',
            thumbSrc: '../assets/GLC_Gallery/481263837_959523959659342_6951409627740982044_n.jpg',
            title: 'Dandora Clean-up Initiative',
            category: 'outreach',
            year: '2023'
        },
        {
            id: 4,
            fullSrc: '../assets/GLC_Gallery/480787569_951941993750872_3438892614965337405_n.jpg',
            thumbSrc: '../assets/GLC_Gallery/480787569_951941993750872_3438892614965337405_n.jpg',
            title: 'Sunday Service Worship 2024',
            category: 'worship',
            year: '2024'
        },
        {
            id: 5,
            fullSrc: '../assets/GLC_Gallery/477579915_2377862179227885_4669735196104022609_n.jpg',
            thumbSrc: '../assets/GLC_Gallery/477579915_2377862179227885_4669735196104022609_n.jpg',
            title: 'First Church Building Dedication',
            category: 'history',
            year: '2022'
        },
        {
            id: 6,
            fullSrc: '../assets/GLC_Gallery/476409693_943755427902862_3555604419389361622_n.jpg',
            thumbSrc: '../assets/GLC_Gallery/476409693_943755427902862_3555604419389361622_n.jpg',
            title: 'Youth Camp 2023',
            category: 'events',
            year: '2023'
        },
        {
            id: 7,
            fullSrc: '../assets/GLC_Gallery/475998880_943759357902469_5957019954508659850_n.jpg',
            thumbSrc: '../assets/GLC_Gallery/475998880_943759357902469_5957019954508659850_n.jpg',
            title: 'Medical Camp 2024',
            category: 'outreach',
            year: '2024'
        },
        {
            id: 8,
            fullSrc: '../assets/GLC_Gallery/131067938_1325597691121011_5437897893584127116_n.jpg',
            thumbSrc: '../assets/GLC_Gallery/131067938_1325597691121011_5437897893584127116_n.jpg',
            title: 'Easter Sunday Service 2023',
            category: 'worship',
            year: '2023'
        },
        {
            id: 9,
            fullSrc: '../assets/GLC_Gallery/491948439_997863665825371_1003388152160234343_n.jpg',
            thumbSrc: '../assets/GLC_Gallery/491948439_997863665825371_1003388152160234343_n.jpg',
            title: 'Christmas Carols 2024',
            category: 'events',
            year: '2024'
        },
        {
            id: 10,
            fullSrc: '../assets/GLC_Gallery/129876436_1324640064550107_4606514557846447316_n.jpg',
            thumbSrc: '../assets/GLC_Gallery/129876436_1324640064550107_4606514557846447316_n.jpg',
            title: 'Food Distribution Dandora 2023',
            category: 'outreach',
            year: '2023'
        },
        {
            id: 11,
            fullSrc: '..assets/GLC_Gallery/484345495_969403235338081_3922950664111295189_n.jpg',
            thumbSrc: '../assets/GLC_Gallery/484345495_969403235338081_3922950664111295189_n.jpg',
            title: 'Community Blessing Ceremony',
            category: 'history',
            year: 'older'
        },
        {
            id: 12,
            fullSrc: '../assets/GLC_Gallery/482031583_966529608958777_2985660326852792392_n.jpg',
            thumbSrc: '../assets/GLC_Gallery/482031583_966529608958777_2985660326852792392_n.jpg',
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