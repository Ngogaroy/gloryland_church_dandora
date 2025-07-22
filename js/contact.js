document.addEventListener('DOMContentLoaded', () => {
    // Get the contact form and the message display area
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop the browser from submitting the form normally

            // Clear any old messages and reset their styling
            formMessage.textContent = '';
            formMessage.className = 'form-message'; // Reset to base class

            // Get values from form fields and remove leading/trailing whitespace
            const name = contactForm.elements['name'].value.trim();
            const email = contactForm.elements['email'].value.trim();
            const subject = contactForm.elements['subject'].value.trim();
            const message = contactForm.elements['message'].value.trim();

            // --- Basic Form Validation ---
            if (!name || !email || !subject || !message) {
                displayMessage('Please fill in all required fields.', 'error');
                return; // Stop the function if validation fails
            }

            // Validate email format using a helper function
            if (!validateEmail(email)) {
                displayMessage('Please enter a valid email address.', 'error');
                return; // Stop the function if validation fails
            }

            // --- Simulated Form Submission ---
            // In a real, live application, you would replace this section
            // with code that sends the form data to a backend server.
            // This usually involves using the `fetch()` API or `XMLHttpRequest`.
            // Example of what it *could* look like (requires a server-side endpoint):
            /*
            fetch('/submit-contact-form', { // Replace '/submit-contact-form' with your actual server endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, subject, message }), // Send data as JSON
            })
            .then(response => response.json()) // Parse the JSON response from the server
            .then(data => {
                if (data.success) { // Assuming your server sends a { success: true } response
                    displayMessage('Thank you for your message! We will get back to you soon.', 'success');
                    contactForm.reset(); // Clear the form fields on success
                } else {
                    displayMessage('There was an error sending your message. Please try again later.', 'error');
                }
            })
            .catch(error => {
                console.error('Submission Error:', error); // Log any network or server errors
                displayMessage('An unexpected error occurred. Please try again.', 'error');
            });
            */

            // For now, we'll just simulate a successful submission and clear the form.
            displayMessage('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset(); // Clear the form after simulated submission
        });
    }

    // Helper function to display messages (success or error)
    function displayMessage(msg, type) {
        formMessage.textContent = msg; // Set the message text
        formMessage.classList.add(type); // Add 'success' or 'error' class for styling
        formMessage.style.display = 'block'; // Make sure the message element is visible

        // For success messages, hide them automatically after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none'; // Hide the message
                formMessage.textContent = ''; // Clear text
                formMessage.className = 'form-message'; // Reset classes
            }, 5000); // 5000 milliseconds = 5 seconds
        }
    }

    // Helper function for basic email format validation
    function validateEmail(email) {
        // Simple regex for email validation (can be more robust if needed)
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});