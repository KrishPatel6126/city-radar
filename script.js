// Utility function to sanitize text to prevent XSS
function sanitizeText(input) {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
}

// Function to capture geolocation
function captureGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
        }, error => {
            console.error('Error retrieving location:', error);
        });
    } else {
        console.warn('Geolocation is not supported by this browser.');
    }
}

// Input validation function with optional chaining
function validateInput(input) {
    return input?.trim().length > 0; // Checks if input is non-null and non-empty
}

// Function to apply background image styling
function applyBackgroundImage(url) {
    document.body.style.backgroundImage = `url('${url}')`;
}

// Mapping Porto/Portugal city keywords
const cityKeywords = {
    'porto': 'Portugal',
    'portugal': 'Portuguese city'
};

// Main application logic
function main() {
    // Validate user input
    const userInput = document.querySelector('#inputField')?.value;
    if (!validateInput(userInput)) {
        console.error('Invalid input!');
        return;
    }

    // Sanitize user input
    const safeInput = sanitizeText(userInput);
    console.log('Safe input:', safeInput);

    // Capture geolocation
    captureGeolocation();

    // Apply background image (example URL)
    applyBackgroundImage('path/to/your/background-image.jpg');
}

// Running the application
main();