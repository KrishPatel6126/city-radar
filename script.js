/**
 * CITY RADAR - Main Application Script
 * ------------------------------------
 * Features: 
 * - Dynamic Tab Switching
 * - Real-time Reverse Geocoding (📍)
 * - Intelligent Background Switching
 * - Local Data Integration & Filtering
 */

// --- CONFIGURATION & STATE ---
const CONFIG = {
    DEFAULT_BG: 'backgrounds/default.jpg',
    GEO_API_URL: 'https://nominatim.openstreetmap.org/reverse',
    CITY_MAP: {
        "surat": "surat", "mumbai": "mumbai", "delhi": "delhi",
        "bangalore": "bangalore", "ahmedabad": "ahmedabad",
        "london": "london", "paris": "paris", "tokyo": "tokyo"
    }
};

let appData = {
    localRecommendations: [],
    currentTab: 'internet'
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("City Radar Initializing...");
    await fetchLocalData();
    setupEventListeners();
});

async function fetchLocalData() {
    try {
        const response = await fetch("localData.json");
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();
        appData.localRecommendations = Array.isArray(data) ? data : [data];
    } catch (err) {
        console.warn("Using fallback local data.");
        // Static backup if JSON fails to load
        appData.localRecommendations = [
            {
                name: "Zinga Circle",
                category: "Grocery",
                city: "Surat",
                area: "Jinga Circle",
                budget: "Medium",
                image: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=27j5lcT3HWUXsgsAqlqw3w&w=408&h=240",
                reason: "Best raw sea food"
            }
        ];
    }
}

// --- CORE FUNCTIONS ---

/**
 * Handles Tab Navigation
 */
window.switchSlide = (slideId, activeBtn) => {
    // Update UI elements
    document.querySelectorAll(".slide").forEach(s => s.style.display = 'none');
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));

    const targetSlide = document.getElementById(slideId);
    if (targetSlide) {
        targetSlide.style.display = 'block';
        targetSlide.classList.add("active");
    }
    if (activeBtn) activeBtn.classList.add("active");
    
    appData.currentTab = slideId;
};

/**
 * Geolocation logic with actual City Name lookup
 */
window.getUserLocation = (inputId) => {
    const field = document.getElementById(inputId);
    if (!navigator.geolocation) return alert("Geolocation is not supported.");

    field.placeholder = "Locating city...";
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
            const res = await fetch(`${CONFIG.GEO_API_URL}?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || "Surat";
            
            field.value = city;
            field.placeholder = "City Name";
            
            if (inputId === 'internetCity') setLocation();
        } catch (e) {
            field.value = "Surat"; // Fallback
            if (inputId === 'internetCity') setLocation();
        }
    }, () => {
        field.placeholder = "Location access denied";
        alert("Please enable location permissions.");
    });
};

/**
 * Updates Internet slide context (Background & Title)
 */
window.setLocation = () => {
    const input = document.getElementById("internetCity")?.value.trim();
    if (!input) return;

    const slide = document.getElementById("internet");
    const title = document.getElementById("internetTitle");
    const options = document.getElementById("internetOptions");

    // Dynamic Background Mapping
    const lowerInput = input.toLowerCase();
    const cityKey = Object.keys(CONFIG.CITY_MAP).find(k => lowerInput.includes(k));
    const bgName = cityKey ? CONFIG.CITY_MAP[cityKey] : 'default';

    if (slide) slide.style.backgroundImage = `url('backgrounds/${bgName}.jpg')`;
    if (title) title.innerText = `Exploring ${input}`;
    if (options) options.classList.remove("hidden");
};

/**
 * Performs External Map Search
 */
window.internetSearch = () => {
    const city = document.getElementById("internetCity")?.value.trim();
    const category = document.getElementById("internetCategory")?.value;
    const resultsContainer = document.getElementById("internetResults");

    if (!city || !category) return alert("Select both city and category.");

    resultsContainer.innerHTML = `
        <li class="card" style="cursor:pointer" onclick="openMapSearch('${category} in ${city}')">
            <div class="card-content">
                <strong>Top ${category.toUpperCase()} in ${city}</strong>
                <p class="meta">Click to view live results on Google Maps ↗</p>
            </div>
        </li>
    `;
};

/**
 * Internal Search for Local Recommendations
 */
window.localSearch = () => {
    const container = document.getElementById("localResults");
    const city = document.getElementById("localCity")?.value.toLowerCase().trim();
    const category = document.getElementById("localCategory")?.value.toLowerCase();
    const budget = document.getElementById("localBudget")?.value.toLowerCase();

    const filtered = appData.localRecommendations.filter(item => 
        (!city || item.city.toLowerCase().includes(city)) &&
        (!category || item.category.toLowerCase() === category) &&
        (!budget || item.budget.toLowerCase() === budget)
    );

    container.innerHTML = filtered.length ? "" : '<li class="no-results">No local matches found.</li>';

    filtered.forEach(item => {
        const li = document.createElement("li");
        li.className = "card";
        li.innerHTML = `
            <img src="${item.image}" class="card-img" onerror="this.src='${CONFIG.DEFAULT_BG}'">
            <div class="card-content">
                <strong>${item.name}</strong>
                <div class="meta">
                    <span>📍 ${item.area}</span><br>
                    <span>💰 Budget: ${item.budget}</span>
                    <p class="reason">"${item.reason}"</p>
                </div>
            </div>
        `;
        li.onclick = () => openMapSearch(`${item.name} ${item.city}`);
        container.appendChild(li);
    });
};

// --- HELPER FUNCTIONS ---
window.openMapSearch = (query) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, "_blank");
};

function setupEventListeners() {
    // Add any global listeners here if needed
    console.log("Event listeners active.");
}
