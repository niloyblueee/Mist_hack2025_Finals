// Initialize the users array from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [
  
    {
      "id": "admin1",
      "name": "Admin",
      "email": "admin@bracu.ac.bd",
      "password": "admin123",
      "role": "admin",
      "approved": true
    }
  
] || [];
console.log(users)

// Function to handle login
document.getElementById('signin').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;

  // Find the user in the users array
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Check if the user is a management user and not approved
    if (user.role === 'management' && !user.approved) {
      alert('Your account is pending approval from the admin.');
      return;
    }

    // Redirect based on the user's role and assigned section
    switch (user.role) {
      case 'student':
        showLoggedInUI(user);
        break;
      case 'management':
        if (user.section) {
          switch (user.section) {
            case 'cafeteria':
              window.location.href = 'cafeteria-management.html';
              break;
            case 'bus':
              window.location.href = 'bus-management.html';
              break;
            case 'events':
              window.location.href = 'event-management.html';
              break;
            default:
              alert('No section assigned. Please contact the admin.');
              break;
          }
        } else {
          alert('No section assigned. Please contact the admin.');
        }
        break;
      case 'admin':
        window.location.href = 'admin.html';
        break;
      default:
        alert('Invalid user role.');
        break;
    }
  } else {
    alert('Invalid email or password!');
  }
});

// Function to show the logged-in UI (for students)
function showLoggedInUI(user) {
  // Hide the login/signup forms
  document.getElementById('signin').style.display = 'none';
  document.getElementById('signup').style.display = 'none';

  // Show the logged-in message
  document.getElementById('logged-in-message').textContent = `Welcome, ${user.name}! You are logged in.`;

  // Show the logged-in user's name in the navigation bar
  document.getElementById('logged-in-user').textContent = `Hi, ${user.name}`;

  // Show the appropriate features based on the user's role
  if (user.role === 'student') {
    document.getElementById('student-features').style.display = 'grid';
  }
}

// Function to handle logout
function logout() {
  // Clear the logged-in UI
  document.getElementById('logged-in-message').textContent = '';
  document.getElementById('logged-in-user').textContent = '';
  document.getElementById('student-features').style.display = 'none';
  document.getElementById('management-services').style.display = 'none';

  // Show the login/signup forms
  document.getElementById('signin').style.display = 'block';
  document.getElementById('signup').style.display = 'none';

  alert('You have been logged out.');
  window.location.href = '../index.html'
}

// Function to handle signup
document.getElementById('signup').addEventListener('submit', (e) => {
  e.preventDefault();
  const userType = document.getElementById('user-type').value;
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const id = document.getElementById('signup-id').value;
  const password = document.getElementById('signup-password').value;

  // Only validate department and semester for students
  let department = null;
  let semester = null;
  if (userType === 'student') {
    department = document.getElementById('signup-department').value;
    semester = document.getElementById('signup-semester').value;

    // Validate student fields
    if (!department || !semester) {
      alert('Please fill out all fields for student signup.');
      return;
    }
  }

  // Create a new user object
  const newUser = {
    id,
    name,
    email,
    password,
    role: userType,
    department: userType === 'student' ? department : null,
    semester: userType === 'student' ? semester : null,
    approved: userType === 'management' ? false : true, // Management users need approval
    section: null // Section will be assigned by admin
  };

  // Add the new user to the users array
  users.push(newUser);

  // Save the updated users array to localStorage
  localStorage.setItem('users', JSON.stringify(users));

  // Show a success message
  alert('Sign Up Successful! Please wait for approval if you are management.');

  // Clear the form
  document.getElementById('signup').reset();
});

// Function to go to the Cafeteria page
function goToCafeteria() {
  window.location.href = 'cafeteria.html';
}

// Function to go to the Cafeteria Management page
function goToCafeteriaManagement() {
  window.location.href = 'cafeteria-management.html';
}
function goToBus() {
  window.location.href = '../bus/final.html';
}

// Function to switch between Login and Sign Up tabs
function openTab(tabName) {
  // Hide all tab content
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(tab => tab.classList.remove('active'));

  // Show the selected tab content
  document.getElementById(tabName).classList.add('active');
}

// Function to toggle fields based on user type (student or management)
function toggleSignupFields() {
  const userType = document.getElementById('user-type').value;
  const departmentField = document.getElementById('signup-department');
  const semesterField = document.getElementById('signup-semester');

  if (userType === 'student') {
    departmentField.style.display = 'block';
    semesterField.style.display = 'block';
    departmentField.setAttribute('required', true);
    semesterField.setAttribute('required', true);
  } else {
    departmentField.style.display = 'none';
    semesterField.style.display = 'none';
    departmentField.removeAttribute('required');
    semesterField.removeAttribute('required');
  }
}

// Initialize the form fields based on the default user type
document.addEventListener('DOMContentLoaded', () => {
  toggleSignupFields(); // Set the initial state of the form fields
});