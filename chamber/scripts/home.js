
/* ====== Business Spotlights ====== */

const spotlightsContainer = document.querySelector("#spotlights-container");

async function getSpotlights() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Unable to retrieve member information.");
        }

        const members = await response.json();

        // Filter for Gold and Silver Members
        const eligibleMembers = members.filter(
            member => member.membershipLevel === 2 ||
                      member.membershipLevel === 3
        );

        // Randomly shuffle eligible members
        for (let i = eligibleMembers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [eligibleMembers[i], eligibleMembers[j]] =
                [eligibleMembers[j], eligibleMembers[i]];
        }

        // Select three random members
        const selectedMembers = eligibleMembers.slice(0, 3);

        displaySpotlights(selectedMembers);

    } catch (error) {
        console.error("Error loading business spotlights:", error);
        spotlightsContainer.textContent =
            "Unable to load business spotlights. Please try again later.";
    }
}

// Display Business Spotlights

function displaySpotlights(members) {
    spotlightsContainer.innerHTML = "";

    const membershipLevels = {
        2: "Silver Member",
        3: "Gold Member"
    };

    members.forEach(member => {

        const card = document.createElement("article");
        card.classList.add("spotlight-card");

        const image = document.createElement("img");
        image.src = `images/${member.image}`;
        image.alt = `${member.name} logo`;
        image.loading = "lazy";
        image.width = 180;
        image.height = 120;

        const name = document.createElement("h3");
        name.textContent = member.name;

        const phone = document.createElement("p");
        phone.textContent = member.phone;

        const address = document.createElement("p");
        address.textContent = member.address;

        const website = document.createElement("a");
        website.href = member.website;
        website.textContent = "Visit Website";
        website.target = "_blank";
        website.rel = "noopener noreferrer";

        const membership = document.createElement("p");
        membership.textContent =
            membershipLevels[member.membershipLevel];

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(phone);
        card.appendChild(address);
        card.appendChild(website);
        card.appendChild(membership);

        spotlightsContainer.appendChild(card);
    });
}

if (spotlightsContainer) {
    getSpotlights();
}
