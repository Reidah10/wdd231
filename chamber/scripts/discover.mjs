
import places from "../data/discover.json" with { type: "json" };

const discoverGrid = document.querySelector("#discover-grid");
const visitMessage = document.querySelector("#visit-message");

function displayPlaces(places) {
    places.forEach((place, index) => {
        // Create the card
        const card = document.createElement("article");
        card.classList.add("discover-card", `card-${index + 1}`);

        // Create the image
        const image = document.createElement("img");
        image.src = `images/${place.image}`;
        image.alt = place.alt;
        image.loading = index === 0 ? "eager" : "lazy";

        // Create the title
        const title = document.createElement("h2");
        title.textContent = place.name;

        // Create the address
        const address = document.createElement("p");
        address.classList.add("card-address");
        address.textContent = place.address;

        // Create the description
        const description = document.createElement("p");
        description.classList.add("card-description");
        description.textContent = place.description;

        // Create the Learn More link
        const link = document.createElement("a");
        link.href = place.url;
        link.textContent = `Learn More About ${place.name}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        // Class Assignments
        image.classList.add("card-image");
        title.classList.add("card-title");
        link.classList.add("card-link");

        // Add everything to the card
        card.append(image, title, address, description, link);
        discoverGrid.appendChild(card);
    });
}

function displayVisitMessage() {
    const currentVisit = Date.now();
    const lastVisit = localStorage.getItem("lastVisit");

    if (!lastVisit) {
        visitMessage.textContent = 
        "Welcome! Explore local attractions and discover the beauty of Utah Valley.";
    } else {
        const timeDifference = currentVisit - Number(lastVisit);
        const daysSinceLastVisit = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastVisit < 1) {
            visitMessage.textContent = "Back so soon! Awesome!";
        } else if (daysSinceLastVisit === 1) {
            visitMessage.textContent = "You last visited 1 day ago.";
        } else if (daysSinceLastVisit < 365) {
                visitMessage.textContent = 
                "You last visited ${daysSinceLastVisit} days ago.";
        } else {
            visitMessage.textContent = 
            "Welcome back! It's been a while. We hope you enjoy exploring Utah Valley.";
        }
    }

    localStorage.setItem("lastVisit", currentVisit);
}

displayPlaces(places);
displayVisitMessage();
