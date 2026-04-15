/* ================= LOAD LOCAL DATA ================= */

let localdata = [];

fetch("localdata.json")
  .then(res => res.json())
  .then(data => {
    localdata = Array.isArray(data) ? data : [data];
    console.log("Local data loaded:", localdata);
  })
  .catch(err => console.log("Error loading JSON:", err));


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
    "delhi": "delhi",
    "bangalore": "bangalore",
    "hyderabad": "hyderabad",
    "ahmedabad": "ahmedabad"
  };

  let imageKey = "default";

  if (indiaCities[input]) imageKey = indiaCities[input];

  else if (
    input.includes("argentina") ||
    input.includes("buenos aires") ||
    input.includes("rosario")
  ) imageKey = "argentina";

  else if (
    input.includes("brazil") ||
    input.includes("rio") ||
    input.includes("sao paulo")
  ) imageKey = "brazil";

  else if (
  input.includes("spain") ||
  input.includes("madrid") ||
  input.includes("barcelona")
) {
  imageKey = "barcelona";
}
 else if (
  input.includes("portugal") ||
  input.includes("lisbon") ||
  input.includes("porto")
) {
  imageKey = "portugal";
}

  else if (input.includes("germany") || input.includes("berlin"))
    imageKey = "berlin";

  else if (input.includes("italy") || input.includes("rome"))
    imageKey = "rome";
  
  else if (input.includes("england") || input.includes("manchester"))
    imageKey = "manchester";

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


/* ================= SMART SCORING FUNCTION ================= */

function calculateScore(place, selectedBudget) {

  let score = 0;

  // Budget Match
  if (place.budget.toLowerCase() === selectedBudget) score += 5;

  // Usage Frequency Weight
  if (place.usageFrequency.toLowerCase() === "weekly") score += 4;
  else if (place.usageFrequency.toLowerCase() === "monthly") score += 2;

  return score;
}


/* ================= LOCAL SEARCH ================= */

function localSearch() {

  const resList = document.getElementById("localResults");
  resList.innerHTML = "";

  const city = document.getElementById("localCity").value.trim().toLowerCase();
  const category = document.getElementById("localCategory").value.trim().toLowerCase();
  const budget = document.getElementById("localBudget").value.trim().toLowerCase();

  let filtered = localData.filter(p =>
    p.city.toLowerCase().includes(city) &&
    p.category.toLowerCase().includes(category)
  );

  if (!filtered.length) {
    resList.innerHTML = `<li style="grid-column:1/-1">No verified results found</li>`;
    return;
  }

  // Apply scoring
  filtered = filtered.map(p => ({
    ...p,
    score: calculateScore(p, budget)
  }));

  // Sort by score
  filtered.sort((a, b) => b.score - a.score);

  filtered.forEach((p, index) => {

    const li = document.createElement("li");

    li.classList.add("fade-in");
    li.style.animationDelay = `${index * 0.08}s`;

    li.innerHTML = `
      ${index === 0 ? `<div class="badge">Top Recommended</div>` : ""}
      ${p.image ? `<img src="${p.image}" class="card-img">` : ""}
      <strong>${p.name}</strong>
      <div class="meta">
        <b>Area:</b> ${p.area}<br>
        <b>Budget:</b> ${p.budget}<br>
        <b>Recommended For:</b> ${p.recommendedFor.join(", ")}<br>
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
