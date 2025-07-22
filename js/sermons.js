document.addEventListener('DOMContentLoaded', () => {
    // Select all filter buttons and the sermon grid container
    const filterButtons = document.querySelectorAll('.sermon-filter-btn');
    const sermonGrid = document.querySelector('.sermon-grid');

    // Exit if elements aren't found on the page (e.g., if this script is mistakenly loaded elsewhere)
    if (!filterButtons.length || !sermonGrid) {
        return;
    }

    // Add click event listener to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove the 'active' class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add the 'active' class to the button that was just clicked
            button.classList.add('active');

            // Get the filter value (e.g., 'all', 'youth', 'worship') from the button's data attribute
            const filterValue = button.dataset.filter;

            // Get all sermon cards within the grid
            const sermonCards = sermonGrid.querySelectorAll('.sermon-card');

            // Iterate over each sermon card to show or hide it based on the filter
            sermonCards.forEach(card => {
                const cardCategory = card.dataset.category; // Get the category of the current card

                // If the filter is 'all' or the card's category matches the filter, show the card
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block'; // Or 'flex', 'grid' depending on your layout
                } else {
                    card.style.display = 'none'; // Hide the card
                }
            });
        });
    });

    // Optional: Simulate a click on the "All" button when the page loads
    // This ensures all sermons are visible by default
    const allButton = document.querySelector('.sermon-filter-btn[data-filter="all"]');
    if (allButton) {
        allButton.click();
    }
});