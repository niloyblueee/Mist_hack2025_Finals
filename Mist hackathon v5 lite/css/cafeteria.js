// Load cafeteria data from localStorage
let cafeteria = JSON.parse(localStorage.getItem('cafeteria')) || [
    {
      id: 1,
      name: 'Burger',
      price: 120,
      stock: 10,
      image: 'images/burger.jpg',
      available: true
    },
    {
      id: 2,
      name: 'Pizza',
      price: 250,
      stock: 5,
      image: 'images/pizza.jpg',
      available: true
    },
    {
      id: 3,
      name: 'Pasta',
      price: 180,
      stock: 0,
      image: 'images/pasta.jpg',
      available: false
    }
  ];
  
  // Function to display the food menu
  function displayFoodMenu() {
    const foodList = document.getElementById('food-list');
    foodList.innerHTML = '';
  
    cafeteria.forEach(item => {
      const foodItem = document.createElement('div');
      foodItem.className = 'food-item';
      foodItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="${item.available ? '' : 'blur'}">
        <h3>${item.name}</h3>
        <p>Price: ${item.price} BDT</p>
        <p>Stock: ${item.stock}</p>
        <p class="${item.available ? '' : 'not-available'}">${item.available ? 'Available' : 'Not Available'}</p>
      `;
      foodList.appendChild(foodItem);
    });
  }
  
  // Function to populate the food item dropdown
  function populateFoodDropdown() {
    const foodDropdown = document.getElementById('food-item');
    foodDropdown.innerHTML = '';
  
    cafeteria.forEach(item => {
      if (item.available) {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} - ${item.price} BDT`;
        foodDropdown.appendChild(option);
      }
    });
  }
  
  // Function to handle order submission
  document.getElementById('order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const foodId = parseInt(document.getElementById('food-item').value);
    const quantity = parseInt(document.getElementById('order-quantity').value);
    const paymentMethod = document.getElementById('payment-method').value;
    const pickupTime = document.getElementById('pickup-time').value;
  
    const foodItem = cafeteria.find(item => item.id === foodId);
  
    if (foodItem && foodItem.available && foodItem.stock >= quantity) {
      // Reduce stock
      foodItem.stock -= quantity;
      if (foodItem.stock === 0) {
        foodItem.available = false;
      }
  
      // Save updated cafeteria data to localStorage
      localStorage.setItem('cafeteria', JSON.stringify(cafeteria));
  
      // Add order to the orders list
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      const newOrder = {
        id: orders.length + 1,
        foodId,
        quantity,
        paymentMethod,
        pickupTime,
        status: 'pending'
      };
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
  
      // Show success message
      alert('Order placed successfully!');
  
      // Refresh the food menu and dropdown
      displayFoodMenu();
      populateFoodDropdown();
    } else {
      alert('Selected item is out of stock or insufficient quantity available.');
    }
  });
  
  // Load data when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    displayFoodMenu();
    populateFoodDropdown();
  });