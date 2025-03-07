function navigateToAnnouncements() {
    window.location.href = "announcements.html";
}

function goBack() {
    window.location.href = "communication-hub.html";
}


function navigateToFAQ() {
    window.location.href = "faq.html";
}

// Toggle FAQ Answers
function toggleAnswer(id) {
    let answer = document.getElementById(id);
    answer.style.display = answer.style.display === "block" ? "none" : "block";
}

function navigatetotsc() {
    window.location.href = "tsc.html";
}
