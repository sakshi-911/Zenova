// Selecting DOM elements
const searchBar = document.querySelector("#searchBar");
const popularCardsContainer = document.querySelector("#popularCards");
const detailModal = document.querySelector("#detailModal");
const modalBody = document.querySelector("#modalBody");
const closeModal = document.querySelector("#closeModal");

document.getElementById("applyFilters").addEventListener("click", applyFilters);
document.getElementById("resetFilters").addEventListener("click", resetFilters);

// Fetch celestial bodies data
async function fetchCelestialBodies() {
  try {
    const response = await fetch(
      "https://api.le-systeme-solaire.net/rest/bodies/"
    );
    const data = await response.json();

    // Separate planets and moons for better organization
    const planets = data.bodies.filter((body) => body.isPlanet);
    const moons = data.bodies.filter(
      (body) => !body.isPlanet && body.bodyType === "Moon"
    );
    const asteroids = data.bodies.filter(
      (body) => body.bodyType === "Asteroid"
    );

    // Populate cards: Planets first, then Moons
    populateCards([...planets, ...moons, ...asteroids]);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Populate cards in the container
function populateCards(bodies) {
  bodies.forEach((body) => {
    const card = createCard(body);
    popularCardsContainer.appendChild(card);
  });
}

// Create a card for each celestial body
function createCard(body) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-type", body.bodyType);

  // Card content
  card.innerHTML = `
            <h3>${body.englishName || body.name}</h3>
            <p>Type: ${body.bodyType || "Unknown"}</p>
           
        `;

  // Add click event to open modal with details
  card.addEventListener("click", () => openModal(body));

  return card;
}

// Open modal with details
function openModal(body) {
  const isPlanet = body.isPlanet;

  // Modal content
  modalBody.innerHTML = `
            <h2>${body.englishName || body.name}</h2>
            <p><strong>Type:</strong> ${body.bodyType || "Unknown"}</p>
            <p><strong>Mean Radius:</strong> ${
              body.meanRadius ? body.meanRadius + " km" : "Data not available"
            }</p>
            <p><strong>Semi-Major Axis:</strong> ${
              body.semimajorAxis
                ? body.semimajorAxis + " km"
                : "Data not available"
            }</p>
            <p><strong>Perihelion:</strong> ${
              body.perihelion ? body.perihelion + " km" : "Data not available"
            }</p>
            <p><strong>Aphelion:</strong> ${
              body.aphelion ? body.aphelion + " km" : "Data not available"
            }</p>
            <p><strong>Eccentricity:</strong> ${
              body.eccentricity || "Data not available"
            }</p>
            <p><strong>Inclination:</strong> ${
              body.inclination
                ? body.inclination + " degrees"
                : "Data not available"
            }</p>
            <p><strong>Sidereal Orbit:</strong> ${
              body.sideralOrbit
                ? body.sideralOrbit + " days"
                : "Data not available"
            }</p>
            <p><strong>Mass:</strong> ${
              body.mass?.massValue
                ? `${body.mass.massValue} x 10^${body.mass.massExponent} kg`
                : "Data not available"
            }</p>
            <p><strong>Volume:</strong> ${
              body.vol?.volValue
                ? `${body.vol.volValue} x 10^${body.vol.volExponent} km³`
                : "Data not available"
            }</p>
            <p><strong>Density:</strong> ${
              body.density ? body.density + " g/cm³" : "Data not available"
            }</p>
            <p><strong>Gravity:</strong> ${
              body.gravity ? body.gravity + " m/s²" : "Data not available"
            }</p>
            <p><strong>Escape Velocity:</strong> ${
              body.escape ? body.escape + " m/s" : "Data not available"
            }</p>
            <p><strong>Equatorial Radius:</strong> ${
              body.equaRadius ? body.equaRadius + " km" : "Data not available"
            }</p>
            <p><strong>Polar Radius:</strong> ${
              body.polarRadius ? body.polarRadius + " km" : "Data not available"
            }</p>
    
             ${
               body.isPlanet
                 ? `<p><strong>Number of Moons: ${
                     body.moons ? body.moons.length : 0
                   }</strong></p>`
                 : ""
             }
                ${
                  body.isPlanet && body.moons
                    ? `
                            <details>
                                <summary>Moons</summary>
                                <ul>
                                    ${body.moons
                                      .map((moon) => `<li>${moon.moon}</li>`)
                                      .join("")}
                                </ul>
                            </details>
                          `
                    : ""
                }
                ${
                  !body.isPlanet && body.aroundPlanet
                    ? `<p><strong>Orbiting around : <span style="color:#8174A0;">${body.aroundPlanet.planet.toUpperCase()}</span></p>`
                    : ""
                }
            
            <p><strong>Discovered By:</strong> ${
              body.discoveredBy || "Unknown"
            }</p>
            <p><strong>Discovered On:</strong> ${
              body.discoveryDate || "Unknown"
            }</p>
        `;

  detailModal.classList.add("active");
}

// Get moons details for planets

// Close modal event
closeModal.addEventListener("click", () => {
  detailModal.classList.remove("active");
});

// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === detailModal) {
    detailModal.classList.remove("active");
  }
});

// Search bar functionality
searchBar.addEventListener("input", () => {
  const query = searchBar.value.trim().toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    if (name.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

// Fetch data on load
fetchCelestialBodies();

function applyFilters() {
  const typeFilter = document.getElementById("typeFilter").value;
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const bodyType = card.getAttribute("data-type");

    card.style.display =
      typeFilter === "all" || bodyType === typeFilter ? "block" : "none";
  });
}
function resetFilters() {
  document.getElementById("typeFilter").value = "all";

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => (card.style.display = "block"));
}
