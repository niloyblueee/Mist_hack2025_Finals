// Load lost and found items from localStorage
let lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];

// Function to display lost items
function displayLostItems() {
  const lostItemsList = document.getElementById('lost-items');
  lostItemsList.innerHTML = '';

  lostItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>Description:</strong> ${item.description}</p>
      <p><strong>Lost Location:</strong> ${item.location}</p>
      <p><strong>Date Lost:</strong> ${item.date}</p>
      <button onclick="deleteItem(${index})">Delete</button>
    `;
    lostItemsList.appendChild(li);
  });
}

// Function to add a new lost item
document.getElementById('lost-item-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const itemName = document.getElementById('item-name').value;
  const itemDescription = document.getElementById('item-description').value;
  const itemLocation = document.getElementById('item-location').value;
  const itemDate = document.getElementById('item-date').value;

  if (itemName && itemDescription && itemLocation && itemDate) {
    const newItem = {
      name: itemName,
      description: itemDescription,
      location: itemLocation,
      date: itemDate
    };

    // Add the new item to the lostItems array
    lostItems.push(newItem);
    localStorage.setItem('lostItems', JSON.stringify(lostItems));

    // Show success message
    alert('Lost item reported successfully!');

    // Clear the form
    document.getElementById('lost-item-form').reset();

    // Refresh the lost items list
    displayLostItems();
  } else {
    alert('Please fill out all fields.');
  }
});

// Function to delete a specific lost item
function deleteItem(index) {
  if (confirm('Are you sure you want to delete this item?')) {
    lostItems.splice(index, 1);
    localStorage.setItem('lostItems', JSON.stringify(lostItems));
    displayLostItems();
  }
}

// Function to delete all lost items (Admin Only)
function deleteAllItems() {
  if (confirm('Are you sure you want to delete all items?')) {
    lostItems = [];
    localStorage.setItem('lostItems', JSON.stringify(lostItems));
    displayLostItems();
  }
}

// Load data when the page loads
document.addEventListener('DOMContentLoaded', () => {
  displayLostItems();
});