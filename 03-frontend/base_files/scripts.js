// This script manages user login and visibility of UI elements based on authentication status


// 1. Implementation - Login

// Add an event listener for the form submission
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Retrieve email and password values from the form
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Perform login
                const response = await loginUser(email, password);

                if (response.ok) {
                    const data = await response.json();
                    // Store JWT token in cookie
                    document.cookie = `token=${data.access_token}; path=/`;
                    // Redirect to main page
                    window.location.href = 'index.html';
                } else {
                    // Handle login failure
                    const error = await response.json();
                    displayError(`Login failed: ${error.message || response.statusText}`);
                }
            } catch (error) {
                displayError(`An error occurred: ${error.message}`);
            }
        });
    }

    async function loginUser(email, password) {
        return fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
    }

    function displayError(message) {
        // Create or select the error message element
        let errorDiv = document.getElementById('error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'error-message';
            errorDiv.style.color = 'red';
            errorDiv.style.marginTop = '10px';
            loginForm.insertAdjacentElement('afterend', errorDiv);
        }
        errorDiv.textContent = message;
    }
});




// 2. Implementation - Index (List of Places)

// Check user authentication
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (!token) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        // Fetch places data if the user is authenticated
        fetchPlaces(token);
    }
}
function getCookie(name) {
    //Function to get a cookie value by its name
    //Your code here
}

//Fetch places data
async function fetchPlaces(token) {
    //Make a GET request to fetch places data
    //Include the token in the Authorization header
    //Handle the response and pass the data to displayPlaces function
}

//Populate places list
function displayPlaces(places) {
    // Clear the current content of the places list
    // Iterate over the places data
    // For each place, create a div element and set its content
    // Append the created element to the places list
}

//Implement client-side filtering
document.getElementById('country-filter').addEventListener('change', (event) => {
    // Get the selected country value
    // Iterate over the places and show/hide them based on the selected country
});






// 3. Implementation - Place details

//Get place ID from URL
function getPlaceIdFromURL() {
    // Extract the place ID from window.location.search
    // Your code here
}

//Check user authentication
function checkAuthentication() {
    const token = getCookie('token');
    const addReviewSection = document.getElementById('add-review');

    if (!token) {
        addReviewSection.style.display = 'none';
    } else {
        addReviewSection.style.display = 'block';
        // Store the token for later use
        fetchPlaceDetails(token, placeId);
    }
}

function getCookie(name) {
    // Function to get a cookie value by its name
    // Your code here
}

//Fetch Place Details
async function fetchPlaceDetails(token, placeId) {
    // Make a GET request to fetch place details
    // Include the token in the Authorization header
    // Handle the response and pass the data to displayPlaceDetails function
}

//Populate place details
function displayPlaceDetails(place) {
    // Clear the current content of the place details section
    // Create elements to display the place details (name, description, location, images)
    // Append the created elements to the place details section
}





// 4. Implementation - Add review

//Check user authentication
function checkAuthentication() {
    const token = getCookie('token');
    if (!token) {
        window.location.href = 'index.html';
    }
    return token;
}

function getCookie(name) {
    // Function to get a cookie value by its name
    // Your code here
}

//Get place ID from URL
function getPlaceIdFromURL() {
    // Extract the place ID from window.location.search
    // Your code here
}

//Setup event listener for review form
document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const token = checkAuthentication();
    const placeId = getPlaceIdFromURL();

    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            // Get review text from form
            // Make AJAX request to submit review
            // Handle the response
        });
    }
});

//Make AJAX request to submit review
async function submitReview(token, placeId, reviewText) {
    // Make a POST request to submit review data
    // Include the token in the Authorization header
    // Send placeId and reviewText in the request body
    // Handle the response
}

//Handle API response
function handleResponse(response) {
    if (response.ok) {
        alert('Review submitted successfully!');
        // Clear the form
    } else {
        alert('Failed to submit review');
    }
}
