// script.js

// Sanitize text to prevent XSS
function sanitizeText(input) {
    const div = document.createElement('div');
    div.innerText = input;
    return div.innerHTML;
}

// Get user's geolocation
function getGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleError);
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // Use latitude and longitude as needed
}

function handleError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.error("An unknown error occurred.");
            break;
    }
}

// Input validation with optional chaining
function validateInput(input) {
    return input?.trim() !== ''; // Valid if input is non-empty
}

// Background image styling
function setBackgroundImage(url) {
    document.body.style.backgroundImage = `url(${url})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
}

// Main logic
window.onload = function() {
    const userInput = document.getElementById('user-input').value;
    if (validateInput(userInput)) {
        const sanitizedInput = sanitizeText(userInput);
        console.log(`User input: ${sanitizedInput}`);
        // Further processing logic...
    } else {
        console.error('Invalid input.');
    }
    getGeolocation();
    setBackgroundImage('path/to/your/image.jpg'); // Update with an actual image path
    // Handling porto/portugal keywords
    const cities = ['Porto', 'Portugal'];
    console.log(cities);
};