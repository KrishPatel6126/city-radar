/* ================= DATA & INITIALIZATION ================= */
let localData = [
  {
    "name": "Zinga Circle",
    "category": "Grocery",
    "city": "Surat",
    "area": "Jinga Circle (Near Dotiwala Bakery)",
    "budget": "Medium",
    "image": "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=27j5lcT3HWUXsgsAqlqw3w&cb_client=search.gws-prod.gps&w=408&h=240&yaw=313.82266&pitch=0&thumbfov=100",
    "reason": "Best budget fishes and raw sea food",
  },
  {
    "name": "Sainath Alooopuri",
    "category": "Food",
    "city": "Surat",
    "area": "L.P.S School",
    "budget": "Low",
    "image": "https://lh3.googleusercontent.com/p/AF1QipN3-y1z5J5g8x7k9l8m6n5o4p3q2r1s0t9u8v7w=s1360-w1360-h1020", 
    "reason": "Taste of the food is the reason to visit"
  }
];

// Load external data if available
fetch("localData.json")
  .then(res => res.ok ? res.json() : Promise.reject(new Error("Invalid response")))
  .then(data => {
    localData = Array.isArray(data) ? data : [data];
    console.log("Local data synced.");
  })
  .catch((err) => {
    console.warn("Failed to load localData.json:", err.message || err);
    console.log("Using internal backup data.");
  });

/* ================= UTILITY FUNCTIONS ================= */
/**
 * Sanitize text to prevent XSS attacks
 * @param {string} text - The text to sanitize
 * @returns {string} - Sanitized text
 */
function sanitizeText(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Validate user input with optional chaining
 * @param {string} input - The input to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateInput(input) {
  return input?.trim().length > 0;
}

/* ================= NAVIGATION ================= */
function switchSlide(id, btn) {
  // Remove active state from all slides and tabs
  document.querySelectorAll(".slide").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  
  // Activate selected slide and tab
  const targetSlide = document.getElementById(id);
  if (targetSlide) targetSlide.classList.add("active");
  if (btn) btn.classList.add("active");
}

/* ================= GEOLOCATION ================= */
function getUserLocation(inputId) {
  const field = document.getElementById(inputId);
  if (!field) {
    console.error("Input field not found:", inputId);
    return;
  }

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  field.placeholder = "Locating...";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      // Defaulting to Surat as a placeholder for reverse geocoding
      field.value = "Surat"; 
      field.placeholder = "Enter city or country";
      console.log(`Location obtained - Latitude: ${latitude}, Longitude: ${longitude}`);
      if(inputId === 'internetCity') setLocation(); 
    },
    (error) => {
      field.placeholder = "Location failed";
      let errorMsg = "Unknown geolocation error";
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMsg = "Permission denied for geolocation";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg = "Position unavailable";
          break;
        case error.TIMEOUT:
          errorMsg = "Geolocation request timed out";
          break;
      }
      console.error("Geolocation error:", errorMsg);
    }
  );
}

/* ================= INTERNET SECTION LOGIC ================= */
function setLocation() {
  const input = document.getElementById("internetCity")?.value?.trim().toLowerCase();
  if (!input) return;

  const slide = document.getElementById("internet");
  const title = document.getElementById("internetTitle");
  const options = document.getElementById("internetOptions");

  const cityKeywords = {
    "surat": "surat", 
    "mumbai": "mumbai", 
    "bombay": "mumbai",
    "delhi": "delhi", 
    "bangalore": "bangalore", 
    "bengaluru": "bangalore",
    "hyderabad": "hyderabad", 
    "ahmedabad": "ahmedabad",
    "argentina": "argentina", 
    "brazil": "brazil", 
    "spain": "barcelona",
    "porto": "portugal", 
    "portugal": "portugal", 
    "germany": "berlin", 
    "italy": "rome"
  };

  let imageKey = "default";
  const matchedKey = Object.keys(cityKeywords).find(key => input.includes(key));
  if (matchedKey) imageKey = cityKeywords[matchedKey];

  if (slide) {
    slide.style.backgroundImage = `url("backgrounds/${imageKey}.jpg")`;
    slide.style.backgroundSize = "cover";
    slide.style.backgroundPosition = "center";
    slide.style.backgroundRepeat = "no-repeat";
  }
  
  if (title) {
    title.innerText = `Discover the Best Places in ${input.charAt(0).toUpperCase() + input.slice(1)}`;
  }
  
  if (options) {
    options.classList.remove("hidden");
  }
}

function internetSearch() {
  const results = document.getElementById("internetResults");
  const city = document.getElementById("internetCity")?.value?.trim();
  const category = document.getElementById("internetCategory")?.value?.trim();
  
  if (!city || !category) {
    alert("Please enter both a city and a category.");
    return;
  }

  if (!results) {
    console.error("Results container not found");
    return;
  }

  results.innerHTML = "";
  const li = document.createElement("li");
  li.className = "card";
  li.innerHTML = `
    <div class="card-content" style="padding:15px;">
      <strong>${sanitizeText(category.toUpperCase())} in ${sanitizeText(city)}</strong>
      <div class="meta">Click to open in Google Maps</div>
    </div>
  `;

  li.style.cursor = "pointer";
  li.onclick = () => {
    const query = encodeURIComponent(`${category} near ${city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  results.appendChild(li);
}

/* ================= LOCAL SECTION LOGIC ================= */
function localSearch() {
  const resList = document.getElementById("localResults");
  
  if (!resList) {
    console.error("Results list container not found");
    return;
  }

  const city = document.getElementById("localCity")?.value?.trim().toLowerCase() || "";
  const category = document.getElementById("localCategory")?.value?.trim().toLowerCase() || "";
  const budget = document.getElementById("localBudget")?.value?.trim().toLowerCase() || "";

  resList.innerHTML = "";

  const filtered = localData.filter(p =>
    (city === "" || p.city.toLowerCase().includes(city)) &&
    (category === "" || p.category.toLowerCase().includes(category)) &&
    (budget === "" || p.budget.toLowerCase().includes(budget))
  );

  if (!filtered.length) {
    resList.innerHTML = `<li style="grid-column:1/-1; text-align:center; padding: 20px;">No verified results found.</li>`;
    return;
  }

  filtered.forEach(p => {
    const li = document.createElement("li");
    li.className = "card";
    li.style.cursor = "pointer";
    
    const imgHtml = p.image 
      ? `<img src="${p.image}" class="card-img" onerror="this.src='backgrounds/default.jpg'" alt="${sanitizeText(p.name)}">` 
      : `<div class="no-img" style="height:150px; background:#222;"></div>`;

    li.innerHTML = `
      ${imgHtml}
      <div class="card-content" style="padding:15px;">
        <strong style="display:block; margin-bottom:5px;">${sanitizeText(p.name)}</strong>
        <div class="meta" style="font-size:0.85em; color:#ccc; line-height:1.4;">
          <b>Area:</b> ${sanitizeText(p.area)}<br>
          <b>Reason:</b> ${sanitizeText(p.reason)}<br>
          <b>Budget:</b> ${sanitizeText(p.budget)}
        </div>
      </div>
    `;

    li.onclick = () => {
      const query = encodeURIComponent(`${p.name} ${p.city}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    };
    
    resList.appendChild(li);
  });
}
