// Mobile Nav

const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");

    const isOpen = navigation.classList.contains("open");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    menuButton.textContent = isOpen ? "✕" : "☰";
});

// Fetch Business Members

const membersContainer = document.querySelector("#members-container");

async function getMembers() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Unable to retrieve member information.");
        }

        const members = await response.json();

        displayMembers(members);

    } catch (error) {
        console.error("Error loading members:", error);
        membersContainer.textContent = "Unable to load business listings. Please try again later.";
    }
}

// Display Business Members

function displayMembers(members) {
    membersContainer.innerHTML = "";

    members.forEach((member, index) => {

        const card = document.createElement("article");
        card.classList.add("member-card");

        const image = document.createElement("img");
        image.src = `images/${member.image}`;
        image.alt = `${member.name} business image`;
        image.loading = index === 0 ? "eager" : "lazy";
        image.width = 200;
        image.height = 130;

        if (index === 0) {
            image.fetchPriority = "high";
        }

        const name = document.createElement("h2");
        name.textContent = member.name;

        const address = document.createElement("p");
        address.textContent = member.address;

        const phone = document.createElement("p");
        phone.textContent = member.phone;

        const website = document.createElement("a");
        website.href = member.website;
        website.textContent = "Visit Website";
        website.target = "_blank";
        website.rel = "noopener noreferrer";

        const membership = document.createElement("p");

        const membershipLevels = {
            1: "Member",
            2: "Silver Member",
            3: "Gold Member"
        };

        membership.textContent = membershipLevels[member.membershipLevel];

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(website);
        card.appendChild(membership);

        membersContainer.appendChild(card);
    });
}

getMembers();

// Grid and List View

const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");

gridButton.addEventListener("click", () => {
    membersContainer.classList.add("grid-view");
    membersContainer.classList.remove("list-view");

    gridButton.classList.add("active");
    listButton.classList.remove("active");

    gridButton.setAttribute("aria-pressed", "true");
    listButton.setAttribute("aria-pressed", "false");
});

listButton.addEventListener("click", () => {
    membersContainer.classList.add("list-view");
    membersContainer.classList.remove("grid-view");

    listButton.classList.add("active");
    gridButton.classList.remove("active");

    listButton.setAttribute("aria-pressed", "true");
    gridButton.setAttribute("aria-pressed", "false");
});

// Footer Dates

const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");

currentYear.textContent = new Date().getFullYear();
lastModified.textContent = document.lastModified;
