// This script manages user login and visibility of UI elements based on authentication status

document.addEventListener('DOMContentLoaded', () => {
    // Example login check. Replace this with your actual login check logic.
    const isLoggedIn = document.cookie.split(';').some(item => item.trim().startsWith('token='));

    if (isLoggedIn) {
        // Hide the "Add a Review" button and show the review form if user is logged in
        document.getElementById('add-review-button').style.display = 'none';
        document.getElementById('review-form').style.display = 'block';
    } else {
        // Hide the review form and show the "Add a Review" button if user is not logged in
        document.getElementById('review-form').style.display = 'none';
        document.getElementById('add-review-button').style.display = 'block';
    }

    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Retrieve the email and password from the form
            const email = loginForm.querySelector('input[name="email"]').value;
            const password = loginForm.querySelector('input[name="password"]').value;

            // Call the function to handle login
            await loginUser(email, password);
        });
    }
});

async function loginUser(email, password) {
    try {
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // Handle the API response
        if (response.ok) {
            const data = await response.json();
            // Store JWT token in a cookie
            document.cookie = `token=${data.access_token}; path=/`;
            // Redirect to the main page
            window.location.href = 'index.html';
        } else {
            // Display error message if login fails
            const errorData = await response.json();
            alert('Login failed: ' + (errorData.message || response.statusText));
        }
    } catch (error) {
        // Handle unexpected errors
        alert('An error occurred: ' + error.message);
    }
}
