let localData = [];

/* Load local public data */
fetch("localData.json")
    .then(res => res.json())
    .then(data => localData = data);

/* Slide switching */
function showSlide(id, btn) {
    document.querySelectorAll(".slide").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    btn.classList.add("active");
}

/* INTERNET RECOMMENDED */
function internetSearch() {
    const city = internetCity.value;
    const category = internetCategory.value;
    const list = internetResults;

    list.innerHTML = "";
    if (!city || !category) return;

    const li = document.createElement("li");
    li.innerHTML = `
        <strong>${category.toUpperCase()} in ${city}</strong>
        <div class="meta">Click to open Google Maps</div>
    `;

    li.onclick = () => {
        window.open(
            `https://www.google.com/maps/search/${encodeURIComponent(category + " near " + city)}`,
            "_blank"
        );
    };

    list.appendChild(li);
}

/* LOCAL PUBLIC RECOMMENDED (WITH HOSTEL + BUDGET) */
function localSearch() {
    const city = localCity.value.toLowerCase();
    const category = localCategory.value;
    const budget = localBudget.value;
    const list = localResults;

    list.innerHTML = "";

    const filtered = localData.filter(p =>
        p.city.toLowerCase().includes(city) &&
        (category === "" || p.category === category) &&
        (budget === "" || p.budget === budget)
    );

    if (filtered.length === 0) {
        list.innerHTML = "<li>No verified recommendations found.</li>";
        return;
    }

    filtered.forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${p.name}</strong>
            <div class="meta">
                ${p.category.toUpperCase()} • ${p.area} • Budget: ${p.budget}
            </div>
        `;

        li.onclick = () => {
            window.open(
                `https://www.google.com/maps/search/${encodeURIComponent(p.name + " " + p.area + " " + p.city)}`,
                "_blank"
            );
        };

        list.appendChild(li);
    });
}
