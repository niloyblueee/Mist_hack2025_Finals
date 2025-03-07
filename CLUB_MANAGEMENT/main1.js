document.addEventListener("DOMContentLoaded", function () {
    fetchEnrolledClubs();
    fetchUpcomingEvents();
    updateSuggestions();

    document.querySelectorAll(".preferences input").forEach(input => {
        input.addEventListener("change", updateSuggestions);
    });
});


function fetchEnrolledClubs() {
    fetch("http://127.0.0.1:5000/enrolled-clubs")
        .then(response => response.json())
        .then(data => {
            const enrolledList = document.getElementById("enrolled-clubs-list");
            enrolledList.innerHTML = "";
            data.enrolled_clubs.forEach(club => {
                const li = document.createElement("li");
                li.textContent = club;
                enrolledList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching enrolled clubs:", error));
}

// Toggle dropdown visibility
function toggleDropdown() {
    const dropdown = document.getElementById("userDropdown");
    dropdown.classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.user-icon') && !event.target.closest('.user-icon')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Sign out functionality
function signOut() {
    alert("Signing out...");
    window.location.href = 'CLUB_MANAGEMENT/Mist_hack2025_Finals/Mist hackathon v5 lite/index.html';
    // Add your sign-out logic here (e.g., redirect to login page)
    window.location.href = '../Mist hackathon v5 lite/index.html'
}

function fetchUpcomingEvents() {
    fetch("http://127.0.0.1:5000/upcoming-events")
        .then(response => response.json())
        .then(data => {
            const eventsList = document.getElementById("events-list");
            eventsList.innerHTML = "";
            data.forEach(event => {
                const li = document.createElement("li");
                li.innerHTML = `${event.event}<div class="event-date">${event.date}</div>`; // Date on the next line
                eventsList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching events:", error));
}


function updateSuggestions() {
    const selectedPreferences = Array.from(document.querySelectorAll(".preferences input:checked"))
        .map(checkbox => checkbox.value);

    fetch("http://127.0.0.1:5000/club-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: selectedPreferences })
    })
    .then(response => response.json())
    .then(data => {
        const suggestionsList = document.getElementById("suggestions-list");
        suggestionsList.innerHTML = "";

        data.suggested_clubs.forEach(club => {
            const listItem = document.createElement("li");
            listItem.textContent = club;

            const joinButton = document.createElement("button");
            joinButton.textContent = "Join";
            joinButton.className = "join-btn";
            joinButton.onclick = () => requestToJoinClub(club);

            listItem.appendChild(joinButton);
            suggestionsList.appendChild(listItem);
        });
    })
    .catch(error => console.error("Error fetching suggestions:", error));
}

function requestToJoinClub(club) {
    const notification = document.getElementById("notification");
    notification.textContent = "Requesting to join...";
    notification.style.display = "block";

    setTimeout(() => {
        fetch("http://127.0.0.1:5000/join-club", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ club })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Club joined successfully") {
                fetchEnrolledClubs(); // Refresh list
                notification.textContent = "Successfully joined!";
            } else {
                notification.textContent = "Already enrolled or error!";
            }
            setTimeout(() => notification.style.display = "none", 2000);
        })
        .catch(error => {
            console.error("Error joining club:", error);
            notification.textContent = "Error joining!";
            setTimeout(() => notification.style.display = "none", 2000);
        });
    }, 2000);
}
