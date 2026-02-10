/* ================= LOCAL DATA ================= */
let localData = [
  {
    "name": "Sainath Alooopuri",
    "category": "Food",
    "city": "Surat",
    "area": "L.P.S School",
    "budget": "Low",
    "image": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.zomato.com%2Fsurat%2Fsainath-live-aalu-puri-rander%2Forder&psig=AOvVaw2XG2kmmvW_1R3LLe7lLTNZ&ust=1770838069465000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMCY5eXTz5IDFQAAAAAdAAAAABAM",
    "reason": "Taste of the food is the reason to visit"
  }
];

// Try loading external data (overrides backup if found)
fetch("localData.json")
  .then(res => res.json())
  .then(data => {
    localData = Array.isArray(data) ? data : [data];
    console.log("Local data loaded from file:", localData);
  })
  .catch(() => console.log("Using backup local data"));

/* ================= LOCATION FEATURE ================= */
function getUserLocation(inputId) {
  const field = document.getElementById(inputId);
  if (!navigator.geolocation) return;

  field.placeholder = "Locating...";
  navigator.geolocation.getCurrentPosition(() => {
    field.value = "Surat"; // demo default
    field.placeholder = "Enter city or country";
  });
}

/* ================= SLIDE SWITCH ================= */
function switchSlide(id, btn) {
  document.querySelectorAll(".slide").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  btn.classList.add("active");
}

/* ================= SET LOCATION & BACKGROUND ================= */
function setLocation() {
  const input = document.getElementById("internetCity").value.trim().toLowerCase();
  if (!input) return;

  const slide = document.getElementById("internet");
  const title = document.getElementById("internetTitle");
  const options = document.getElementById("internetOptions");

  const indiaCities = {
    "surat": "surat",
    "mumbai": "mumbai",
    "bombay": "mumbai",
    "delhi": "delhi",
    "new delhi": "delhi",
    "bangalore": "bangalore",
    "bengaluru": "bangalore",
    "hyderabad": "hyderabad",
    "ahmedabad": "ahmedabad"
  };

  let imageKey = "default";

  // 🇮🇳 INDIA (exact city match)
  if (indiaCities[input]) {
    imageKey = indiaCities[input];
  }

  // 🇦🇷 ARGENTINA — check FIRST to avoid "rio" conflict
  else if (
    input.includes("argentina") ||
    input.includes("buenos aires") ||
    input.includes("rosario") ||
    input.includes("cordoba") ||
    input.includes("mendoza")
  ) {
    imageKey = "argentina";
  }

  // 🇧🇷 BRAZIL — AFTER argentina
  else if (
    input === "rio" ||
    input.includes(" rio ") ||
    input.includes("rio de janeiro") ||
    input.includes("sao paulo") ||
    input.includes("brazil") ||
    input.includes("brasilia") ||
    input.includes("salvador")
  ) {
    imageKey = "brazil";
  }

  // 🇪🇸 SPAIN
  else if (
    input.includes("spain") ||
    input.includes("madrid") ||
    input.includes("valencia") ||
    input.includes("sevilla") ||
    input.includes("seville")
  ) {
    imageKey = "barcelona";
  }

  // 🇵🇹 PORTUGAL
  else if (
    input.includes("portugal") ||
    input.includes("lisbon") ||
    input.includes("porto") ||
    input.includes("coimbra") ||
    input.includes("faro")
  ) {
    imageKey = "portugal";
  }

  // 🇩🇪 GERMANY
  else if (
    input.includes("germany") ||
    input.includes("berlin") ||
    input.includes("munich") ||
    input.includes("hamburg") ||
    input.includes("frankfurt")
  ) {
    imageKey = "berlin";
  }

  // 🇮🇹 ITALY
  else if (
    input.includes("italy") ||
    input.includes("rome") ||
    input.includes("milan") ||
    input.includes("venice") ||
    input.includes("florence") ||
    input.includes("naples")
  ) {
    imageKey = "rome";
  }

  slide.style.backgroundImage = `url("backgrounds/${imageKey}.jpg")`;
  title.innerText =
    `Discover the Best Places in ${input.charAt(0).toUpperCase() + input.slice(1)}`;

  options.classList.remove("hidden");
}


/* ================= INTERNET SEARCH ================= */
function internetSearch() {
  const results = document.getElementById("internetResults");
  results.innerHTML = "";

  const city = document.getElementById("internetCity").value.trim();
  const category = document.getElementById("internetCategory").value.trim();
  if (!city || !category) return;

  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${category.toUpperCase()} in ${city}</strong>
    <div class="meta">Open in Google Maps</div>
  `;

  li.onclick = () => {
    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(category + " near " + city)}`,
      "_blank"
    );
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
    p.city.toLowerCase().includes(city) &&
    p.category.toLowerCase().includes(category) &&
    p.budget.toLowerCase().includes(budget)
  );

  if (!filtered.length) {
    resList.innerHTML = `<li style="grid-column:1/-1">No verified results found</li>`;
    return;
  }

  filtered.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.image ? `<img src="${p.image}" class="card-img">` : ""}
      <strong>${p.name}</strong>
      <div class="meta">
        <b>Area:</b> ${p.area}<br>
        <b>Reason:</b> ${p.reason}
      </div>
    `;

    li.onclick = () => {
      window.open(
        `https://www.google.com/maps/search/${encodeURIComponent(p.name + " " + p.city)}`,
        "_blank"
      );
    };

    resList.appendChild(li);
  });
}
