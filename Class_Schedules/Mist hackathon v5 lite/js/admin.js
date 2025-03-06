// Load users from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Function to display pending management requests
function displayPendingRequests() {
  const pendingRequests = users.filter(user => user.role === 'management' && !user.approved);
  const pendingRequestsList = document.getElementById('pending-requests');

  // Clear the list
  pendingRequestsList.innerHTML = '';

  // Add each pending request to the list
  pendingRequests.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${user.name} (${user.email})
      <button onclick="approveRequest('${user.email}')">Approve</button>
    `;
    pendingRequestsList.appendChild(li);
  });
}

// Function to approve a management request
function approveRequest(email) {
  const user = users.find(u => u.email === email);
  if (user) {
    user.approved = true;
    localStorage.setItem('users', JSON.stringify(users));
    displayPendingRequests(); // Refresh the list
    alert(`Approved request for: ${email}`);
  }
}

// Function to populate the assign user dropdown
function populateAssignUserDropdown() {
  const assignUserDropdown = document.getElementById('assign-user');
  const managementUsers = users.filter(user => user.role === 'management' && user.approved);

  // Clear the dropdown
  assignUserDropdown.innerHTML = '';

  // Add each approved management user to the dropdown
  managementUsers.forEach(user => {
    const option = document.createElement('option');
    option.value = user.email;
    option.textContent = `${user.name} (${user.email})`;
    assignUserDropdown.appendChild(option);
  });
}

// Function to assign a section to a user
document.getElementById('assign-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const userEmail = document.getElementById('assign-user').value;
  const section = document.getElementById('assign-section-type').value;

  const user = users.find(u => u.email === userEmail);
  if (user) {
    user.section = section; // Assign the section
    localStorage.setItem('users', JSON.stringify(users));
    alert(`Assigned ${section} to ${user.name}`);
  }
});

// Load data when the page loads
document.addEventListener('DOMContentLoaded', () => {
  displayPendingRequests();
  populateAssignUserDropdown();
});