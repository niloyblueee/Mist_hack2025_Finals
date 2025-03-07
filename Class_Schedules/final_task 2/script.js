document.addEventListener("DOMContentLoaded", function () {
    let facultyData = {};
    const userTooltip = document.getElementById("userTooltip"); // Get user tooltip element
    const profile = document.querySelector(".profile"); // Get profile container

    let hoverTimeout;

    // Profile hover functionality
    profile.addEventListener("mouseenter", function () {
        clearTimeout(hoverTimeout); // Clear any existing timeout
        userTooltip.style.display = "block"; // Show the tooltip
    });

    profile.addEventListener("mouseleave", function () {
        // Start a timeout when leaving the profile icon
        hoverTimeout = setTimeout(() => {
            if (!userTooltip.matches(':hover')) {
                userTooltip.style.display = "none"; // Hide the tooltip if the mouse is not over it
            }
        }, 300); // 300ms delay before hiding
    });

    // Keep the tooltip visible if the mouse is over it
    userTooltip.addEventListener("mouseenter", function () {
        clearTimeout(hoverTimeout); // Clear the timeout
        userTooltip.style.display = "block"; // Ensure the tooltip stays visible
    });

    userTooltip.addEventListener("mouseleave", function () {
        // Hide the tooltip when the mouse leaves it
        hoverTimeout = setTimeout(() => {
            userTooltip.style.display = "none";
        }, 300); // 300ms delay before hiding
    });

    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            const user = data.users[0];
            facultyData = data.faculty;
            displayUserInfo(user); // Populate user info immediately
            displaySchedule(user.schedule);
            setupFacultyTooltips();
            setupClassReminders(user.schedule);
        });

    function setupFacultyTooltips() {
        const facultyTooltip = document.getElementById('facultyTooltip');
        let hoverTimeout;

        document.querySelectorAll('.faculty-name').forEach(cell => {
            cell.addEventListener('mouseenter', (e) => {
                clearTimeout(hoverTimeout);
                showTooltip(cell);
            });

            cell.addEventListener('mouseleave', (e) => {
                // Start timeout when leaving cell
                hoverTimeout = setTimeout(() => {
                    if (!facultyTooltip.matches(':hover')) {
                        facultyTooltip.style.display = "none";
                    }
                }, 100);
            });
        });

        facultyTooltip.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
        });

        facultyTooltip.addEventListener('mouseleave', () => {
            facultyTooltip.style.display = "none";
        });
    }

    function showTooltip(cell) {
        const text = cell.textContent;
        const facultyCode = text.split('-')[2].trim();
        const faculty = facultyData[facultyCode];

        if (faculty) {
            const rect = cell.getBoundingClientRect();
            facultyTooltip.style.left = `${rect.left + window.scrollX - 10}px`;
            facultyTooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;

            facultyTooltip.innerHTML = `
                    <strong>${faculty.name}</strong><br>
                    ${faculty.designation}<br>
                    Email: <a class="email-link" 
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=${faculty.email}"
                            target="_blank"
                            style="display: inline-block; padding: 5px 0;">
                        ${faculty.email}
                    </a>
                `;
            facultyTooltip.style.display = "block";
        }
    }

    function positionTooltip(event, tooltip) {
        const x = event.clientX + 15;
        const y = event.clientY + 15;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }

    function displayUserInfo(user) {
        userTooltip.innerHTML = `
            <strong>${user.name}</strong><br>
            ID: ${user.id}<br>
            Dept: ${user.department}<br>
            Semester: ${user.semester}<br>
            <a href="#" id="signOutLink" style="color: #1a73e8; text-decoration: underline; cursor: pointer;">Sign Out</a>
        `;

        // Add event listener for the sign-out link
        const signOutLink = document.getElementById('signOutLink');
        signOutLink.addEventListener('click', function (e) {
            e.preventDefault();
            signOut();
        });
    }

    function signOut() {
        // Perform sign-out actions here
        alert('You have been signed out.');
        // Redirect to login page or perform other sign-out actions
        window.location.href = '../../Mist hackathon v5 lite/index.html' // Replace with your login page URL
    }

    function setupClassReminders(schedule) {
        const reminderBox = document.createElement('div');
        reminderBox.id = 'classReminder';
        reminderBox.className = 'hidden';
        document.body.appendChild(reminderBox);

        function checkClassTimes() {
            const now = new Date();
            const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            let nextClass = null;

            schedule.forEach(classItem => {
                Object.entries(classItem.days).forEach(([day, classInfo]) => {
                    if (day === currentDay && classInfo) {
                        const [startStr, endStr] = classItem.time.split(' - ');

                        // Parse start time
                        const [startTime, endTime] = [startStr, endStr].map(timeStr => {
                            const [timePart, modifier] = timeStr.split(' ');
                            let [hours, minutes] = timePart.split(':');
                            hours = parseInt(hours);
                            minutes = parseInt(minutes || '0');
                            const modifierLower = modifier.toLowerCase();

                            if (modifierLower === 'pm' && hours < 12) hours += 12;
                            if (modifierLower === 'am' && hours === 12) hours = 0;

                            const date = new Date(now);
                            date.setHours(hours, minutes, 0, 0);

                            // If time already passed today, move to next week
                            if (date < now) date.setDate(date.getDate());
                            return date;
                        });

                        const timeDiff = (startTime - now) / (1000 * 60);
                        const isCurrentClass = now >= startTime && now <= endTime;

                        const formatOptions = {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                        };

                        if (isCurrentClass) {
                            nextClass = {
                                message: `Current Class: ${classInfo}`,
                                time: `Until ${endTime.toLocaleTimeString([], formatOptions)}`
                            };
                        } else if (timeDiff > 0 && timeDiff <= 15) {
                            nextClass = {
                                message: `Upcoming Class: ${classInfo}`,
                                time: `Starts at ${startTime.toLocaleTimeString([], formatOptions)}`
                            };
                        }
                    }
                });
            });

            if (nextClass) {
                reminderBox.innerHTML = `
                    <strong>${nextClass.message}</strong><br>
                    ${nextClass.time}
                `;
                reminderBox.classList.remove('hidden');
            } else {
                reminderBox.classList.add('hidden');
            }
        }

        // Check every minute
        setInterval(checkClassTimes, 60000);
        checkClassTimes(); // Initial check
    }

    function displaySchedule(schedule) {
        const tableBody = document.getElementById("scheduleTable");
        tableBody.innerHTML = "";

        schedule.forEach(classItem => {
            const row = document.createElement("tr");
            const timeCell = document.createElement("td");
            timeCell.textContent = classItem.time;
            row.appendChild(timeCell);

            const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            days.forEach(day => {
                const dayCell = document.createElement("td");
                dayCell.textContent = classItem.days[day] || "";

                if (classItem.days[day]) {
                    dayCell.classList.add("faculty-name");
                }

                row.appendChild(dayCell);
            });

            tableBody.appendChild(row);
        });
    }
});
