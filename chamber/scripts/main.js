
// Mobile Nav

const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        navigation.classList.toggle("open");

        const isOpen = navigation.classList.contains("open");

        menuButton.setAttribute("aria-expanded", isOpen);
        menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        menuButton.textContent = isOpen ? "✕" : "☰";
    });
}

// Fetch Business Members (Directory Page)

const membersContainer = document.querySelector("#members-container");

if (membersContainer) {

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
}

// Footer Dates

const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent = document.lastModified;
}


// Timestamp

const timestampField = document.querySelector("#timestamp");

if (timestampField) {
    timestampField.value = new Date().toISOString();
}

// Modals

const membershipLinks = document.querySelectorAll(".membership-link");
const closeButtons = document.querySelectorAll(".close-modal");

membershipLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const modalId = link.dataset.modal;
        const modal = document.querySelector(`#${modalId}`);

        if (modal) {
            modal.showModal();
        }
    });
});

closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modal = button.closest("dialog");

        if (modal) {
            modal.close();
        }
    });
});


// Membership Card Scroll Animation
const membershipCards = document.querySelectorAll(".membership-card");

if ("IntersectionObserver" in window) {
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.remove("is-pending");
                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    membershipCards.forEach((card) => {
        card.classList.add("is-pending");
        cardObserver.observe(card);
    });
} else {
    membershipCards.forEach((card) => {
        card.classList.add("is-visible");
    });
}

// Thank You
const submissionDetails = document.querySelector("#submission-details");

if (submissionDetails) {
    const params = new URLSearchParams(window.location.search);

    const timestamp = params.get("timestamp");
    const submittedDate = timestamp ? new Date(timestamp) : null;

    const formattedDate = submittedDate && !Number.isNaN(submittedDate.getTime())
        ? submittedDate.toLocaleString()
        : "Unavailable";

    const membershipLevels = {
        np: "NP Membership",
        bronze: "Bronze Membership",
        silver: "Silver Membership",
        gold: "Gold Membership"
    };

    const details = [
        ["First Name", params.get("first-name")],
        ["Last Name", params.get("last-name")],
        ["Email", params.get("email")],
        ["Phone", params.get("phone")],
        ["Business / Organization", params.get("organization")],
        ["Membership Level", membershipLevels[params.get("membership")] || "Not provided"],
        ["Date Submitted", formattedDate]
    ];

    details.forEach(([label, value]) => {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");

        strong.textContent = `${label}: `;
        paragraph.appendChild(strong);
        paragraph.appendChild(document.createTextNode(value || "Not provided"));

        submissionDetails.appendChild(paragraph);
    });
}
