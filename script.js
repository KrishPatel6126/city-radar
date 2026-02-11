/* ================= LOCAL DATA ================= */
let localData = [
  {
    "name": "Zinga Circle",
    "category": "Grocery",
    "city": "Surat",
    "area": "Jinga Circle (Near Dotiwala Bakery)",
    "budget": "Medium",
    "image": "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=27j5lcT3HWUXsgsAqlqw3w&cb_client=search.gws-prod.gps&w=408&h=240&yaw=313.82266&pitch=0&thumbfov=100",
    "reason": "Taste of the food is the reason to visit"
  }, // <--- FIXED: Added missing comma here
  {
    "name": "Sainath Alooopuri",
    "category": "Food",
    "city": "Surat",
    "area": "L.P.S School",
    "budget": "Low",
    // NOTE: This long URL might expire. Consider hosting images locally or using permanent links.
    "image": "https://lh3.googleusercontent.com/p/AF1QipN3-y1z5J5g8x7k9l8m6n5o4p3q2r1s0t9u8v7w=s1360-w1360-h1020", 
    "reason": "Taste of the food is the reason to visit"
  }
];

// Try loading external data (overrides backup if found)
fetch("localData.json")
  .then(res => {
    if (!res.ok) throw new Error("File not found");
    return res.json();
  })
  .then(data => {
    localData = Array.isArray(data) ? data : [data];
    console.log("Local data loaded from file:", localData);
  })
  .catch(() => console.log("Using backup local data"));

/* ================= LOCATION FEATURE ================= */
function getUserLocation(inputId) {
  const field = document.getElementById(inputId);
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  field.placeholder = "Locating...";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // In a real app, you would use a reverse geocoding API here.
      // For this demo, we default to Surat.
      field.value = "Surat"; 
      field.placeholder = "Enter city or country";
      setLocation(); // Auto-trigger the background change
    },
    (error) => {
      field.placeholder = "Location failed";
      console.error("Error getting location:", error);
    }
  );
}

/* ================= SLIDE SWITCH ================= */
function switchSlide(id, btn) {
  document.querySelectorAll(".slide").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  
  const targetSlide = document.getElementById(id);
  if (targetSlide) targetSlide.classList.add("active");
  if (btn) btn.classList.add("active");
}

/* ================= SET LOCATION & BACKGROUND ================= */
function setLocation() {
  const input = document.getElementById("internetCity").value.trim().toLowerCase();
  if (!input) return;

  const slide = document.getElementById("internet");
  const title = document.getElementById("internetTitle");
  const options = document.getElementById("internetOptions");

  // Define keywords mapped to image filenames
  const cityKeywords = {
    "surat": "surat",
    "mumbai": "mumbai", "bombay": "mumbai",
    "delhi": "delhi",
    "bangalore": "bangalore", "bengaluru": "bangalore",
    "hyderabad": "hyderabad",
    "ahmedabad": "ahmedabad",
    "argentina": "argentina", "buenos aires": "argentina",
    "rio": "brazil", "brazil": "brazil", "sao paulo": "brazil",
    "spain": "barcelona", "madrid": "barcelona", "barcelona": "barcelona",
    "portugal": "portugal", "lisbon": "portugal",
    "germany": "berlin", "berlin": "berlin", "munich": "berlin",
    "italy": "rome", "rome": "rome", "venice": "rome"
  };

  let imageKey = "default";

  // Check if input contains any of our keywords
  const matchedKey = Object.keys(cityKeywords).find(key => input.includes(key));
  
  if (matchedKey) {
    imageKey = cityKeywords[matchedKey];
  }

  // Update DOM
  slide.style.backgroundImage = `url("backgrounds/${imageKey}.jpg")`;
  
  // Capitalize first letter for title
  const displayCity = input.charAt(0).toUpperCase() + input.slice(1);
  title.innerText = `Discover the Best Places in ${displayCity}`;

  options.classList.remove("hidden");
}

/* ================= INTERNET SEARCH ================= */
function internetSearch() {
  const results = document.getElementById("internetResults");
  results.innerHTML = "";

  const city = document.getElementById("internetCity").value.trim();
  const category = document.getElementById("internetCategory").value.trim();
  
  if (!city || !category) {
    alert("Please enter both a city and a category.");
    return;
  }

  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${category.toUpperCase()} in ${city}</strong>
    <div class="meta">Click to open in Google Maps</div>
  `;

  // FIXED: Correct Template Literal Syntax and standard Maps URL
  li.onclick = () => {
    const query = encodeURIComponent(`${category} near ${city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  results.appendChild(li);
}

/* ================= LOCAL SEARCH ================= */
function localSearch() {
  const resList = document.getElementById("localResults");
  resList.innerHTML = "";

  const city = document.getElementById("localCity").value.trim().toLowerCase();
  const category = document.getElementById("localCategory").value.trim().toLowerCase();
  const budget = document.getElementById("localBudget").value.trim().toLowerCase();

  const filtered = localData.filter(p =>
    (city === "" || p.city.toLowerCase().includes(city)) &&
    (category === "" || p.category.toLowerCase().includes(category)) &&
    (budget === "" || p.budget.toLowerCase().includes(budget))
  );

  if (!filtered.length) {
    resList.innerHTML = `<li style="grid-column:1/-1; text-align:center;">No verified results found for your criteria.</li>`;
    return;
  }

  filtered.forEach(p => {
    const li = document.createElement("li");
    
    // Fallback image if none provided
    const imgHtml = p.image 
      ? `<img src="${p.image}" class="card-img" onerror="this.style.display='none'">` 
      : `<div class="no-img">No Image</div>`;

    li.innerHTML = `
      ${imgHtml}
      <div class="card-content">
        <strong>${p.name}</strong>
        <div class="meta">
          <b>Area:</b> ${p.area}<br>
          <b>Reason:</b> ${p.reason}
        </div>
      </div>
    `;

    // FIXED: Correct Template Literal Syntax
    li.onclick = () => {
      const query = encodeURIComponent(`${p.name} ${p.city}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    };

    resList.appendChild(li);
  });
}
