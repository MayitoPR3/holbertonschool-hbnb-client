// This script manages user login and visibility of UI elements based on authentication status


// 1. Implementation - Login

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await loginUser(email, password);

                if (response.ok) {
                    const data = await response.json();
                    document.cookie = `token=${data.access_token}; path=/; secure; HttpOnly`;
                    window.location.href = getRedirectURL() || 'index.html';
                } else {
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

    function getRedirectURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('redirect') || null;
    }
});






// 2. Implementation - Index (List of Places)

// Check user authentication
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    setupFilter();
});

function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (!token) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        fetchPlaces(token);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function fetchPlaces(token) {
    try {
        const response = await fetch('http://127.0.0.1:5000/places', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayPlaces(data.places);
    } catch (error) {
        console.error('Error fetching places:', error);
        displayError('Failed to load places. Please try again later.');
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.setAttribute('data-place-id', place.id);

        placeCard.innerHTML = `
            <img src="${place.image}" alt="${place.name}" class="place-image">
            <div class="place-details">
                <h2>${place.name}</h2>
                <p>Price Per Night: $${place.price}</p>
                <p>Location: ${place.location}</p>
                <a href="place.html?placeId=${place.id}" class="details-button">View Details</a>
            </div>
        `;

        placesList.appendChild(placeCard);
    });
}

function setupFilter() {
    document.getElementById('country-filter').addEventListener('change', (event) => {
        const selectedCountry = event.target.value;
        const placeCards = document.querySelectorAll('.place-card');

        placeCards.forEach(card => {
            const location = card.querySelector('.place-details p').textContent;
            card.style.display = selectedCountry === 'All' || location.includes(selectedCountry) ? 'block' : 'none';
        });
    });
}

function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
    } else {
        console.error(message);
    }
}








// 3. Implementation - Place details

//Get place ID from URL
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});

function checkAuthentication() {
    const token = getCookie('token');
    const addReviewSection = document.getElementById('add-review');

    if (!token) {
        addReviewSection.style.display = 'none';
    } else {
        addReviewSection.style.display = 'block';

        const placeId = getPlaceIdFromURL();
        if (placeId) {
            fetchPlaceDetails(token, placeId);
        } else {
            console.error('Place ID is missing in URL');
        }
    }
}

async function fetchPlaceDetails(token, placeId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const place = await response.json();
        displayPlaceDetails(place);
    } catch (error) {
        console.error('Error fetching place details:', error);
        displayError('Failed to load place details. Please try again later.');
    }
}

function displayPlaceDetails(place) {
    const placeDetailsSection = document.getElementById('place-details');
    placeDetailsSection.innerHTML = '';

    const placeCard = document.createElement('div');
    placeCard.className = 'place-card-large';

    placeCard.innerHTML = `
        <img src="${place.image}" alt="${place.name}" class="place-image">
        <h2>${place.name}</h2>
        <p>Price Per Night: $${place.price}</p>
        <p>Location: ${place.location}</p>
    `;

    placeDetailsSection.appendChild(placeCard);
}

function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
    } else {
        console.error(message);
    }
}






// 4. Implementation - Add review

// Check user authentication
document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const token = checkAuthentication();
    const placeId = getPlaceIdFromURL();

    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const reviewText = document.getElementById('review').value;
            const rating = document.getElementById('rating').value;

            if (reviewText.trim() === '' || isNaN(rating) || rating < 1 || rating > 5) {
                displayError('Please provide a valid review and rating.');
                return;
            }

            await submitReview(token, placeId, reviewText, rating);
        });
    }
});

async function submitReview(token, placeId, reviewText, rating) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/places/${placeId}/reviews`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                review: reviewText,
                rating: parseInt(rating, 10)
            })
        });

        handleResponse(response);
    } catch (error) {
        console.error('Error submitting review:', error);
        displayError('Failed to submit review. Please try again.');
    }
}

function handleResponse(response) {
    if (response.ok) {
        alert('Review submitted successfully!');
        document.getElementById('review-form').reset();
    } else {
        alert('Failed to submit review');
    }
}

function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
    } else {
        console.error(message);
    }
}

