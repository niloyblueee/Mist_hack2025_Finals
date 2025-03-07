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
        <div class="order-options">
          <input type="number" id="quantity-${item.id}" placeholder="Quantity" min="1" max="${item.stock}" ${item.available ? '' : 'disabled'}>
          <input type="datetime-local" id="pickup-time-${item.id}" ${item.available ? '' : 'disabled'}>
          <select id="payment-method-${item.id}" ${item.available ? '' : 'disabled'}>
            <option value="cash">Cash</option>
            <option value="bkash">bKash</option>
            <option value="card">Card</option>
          </select>
          <button onclick="placeOrder(${item.id})" ${item.available ? '' : 'disabled'}>Order Now</button>
          <button onclick="preOrder(${item.id})" ${item.available ? '' : 'disabled'}>Preorder</button>
        </div>
      `;
      foodList.appendChild(foodItem);
    });
  }
  
  // Function to place an order
  function placeOrder(foodId) {
    const quantity = parseInt(document.getElementById(`quantity-${foodId}`).value);
    const paymentMethod = document.getElementById(`payment-method-${foodId}`).value;
  
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
        status: 'pending'
      };
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
  
      // Show success message
      alert('Order placed successfully!');
  
      // Refresh the food menu
      displayFoodMenu();
    } else {
      alert('Selected item is out of stock or insufficient quantity available.');
    }
  }
  
  // Function to place a preorder
  function preOrder(foodId) {
    const quantity = parseInt(document.getElementById(`quantity-${foodId}`).value);
    const paymentMethod = document.getElementById(`payment-method-${foodId}`).value;
    const pickupTime = document.getElementById(`pickup-time-${foodId}`).value;
  
    const foodItem = cafeteria.find(item => item.id === foodId);
  
    if (foodItem && foodItem.available && foodItem.stock >= quantity) {
      // Reduce stock
      foodItem.stock -= quantity;
      if (foodItem.stock === 0) {
        foodItem.available = false;
      }
  
      // Save updated cafeteria data to localStorage
      localStorage.setItem('cafeteria', JSON.stringify(cafeteria));
  
      // Add preorder to the orders list
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
      alert('Preorder placed successfully!');
  
      // Refresh the food menu
      displayFoodMenu();
    } else {
      alert('Selected item is out of stock or insufficient quantity available.');
    }
  }
  // Function to handle logout
function logout() {

  window.location.href = 'index.html'
}
  // Load data when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    displayFoodMenu();
  });