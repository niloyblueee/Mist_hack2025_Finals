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
  
  // Load orders from localStorage
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  
  // Function to display pending and served orders
  function displayOrders() {
    const pendingOrdersList = document.getElementById('pending-orders-list');
    const servedOrdersList = document.getElementById('served-orders-list');
  
    pendingOrdersList.innerHTML = '';
    servedOrdersList.innerHTML = '';
  
    let totalCash = 0;
    let totalBkash = 0;
    let totalCard = 0;
  
    orders.forEach(order => {
      const foodItem = cafeteria.find(item => item.id === order.foodId);
      if (!foodItem) return; // Skip if food item is not found
  
      const orderTotal = foodItem.price * order.quantity;
  
      const li = document.createElement('li');
      li.innerHTML = `
        <p>Order ID: ${order.id}</p>
        <p>Food: ${foodItem.name}</p>
        <p>Quantity: ${order.quantity}</p>
        <p>Total: ${orderTotal} BDT</p>
        <p>Payment Method: ${order.paymentMethod}</p>
        ${order.pickupTime ? `<p>Pickup Time: ${order.pickupTime}</p>` : ''}
        ${order.status === 'pending' ? `<button onclick="markAsServed(${order.id})">Mark as Served</button>` : ''}
      `;
  
      if (order.status === 'pending') {
        pendingOrdersList.appendChild(li);
      } else {
        servedOrdersList.appendChild(li);
      }
  
      // Update payment summary
      if (order.status === 'served') {
        switch (order.paymentMethod) {
          case 'cash':
            totalCash += orderTotal;
            break;
          case 'bkash':
            totalBkash += orderTotal;
            break;
          case 'card':
            totalCard += orderTotal;
            break;
        }
      }
    });
  
    // Update payment summary
    document.getElementById('total-cash').textContent = totalCash;
    document.getElementById('total-bkash').textContent = totalBkash;
    document.getElementById('total-card').textContent = totalCard;
    document.getElementById('total-collection').textContent = totalCash + totalBkash + totalCard;
  }
  
  // Function to mark an order as served
  function markAsServed(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'served';
      localStorage.setItem('orders', JSON.stringify(orders));
      displayOrders();
    }
  }
  
  // Function to display food items
  function displayFoodItems() {
    const foodItemsList = document.getElementById('food-items-list');
    foodItemsList.innerHTML = '';
  
    cafeteria.forEach(item => {
      const foodItem = document.createElement('div');
      foodItem.className = 'food-item';
      foodItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="${item.available ? '' : 'blur'}">
        <h3>${item.name}</h3>
        <p>Price: ${item.price} BDT</p>
        <p>Stock: ${item.stock}</p>
        <p class="${item.available ? '' : 'not-available'}">${item.available ? 'Available' : 'Not Available'}</p>
        <div class="food-item-actions">
          <button onclick="editFoodItem(${item.id})">Edit</button>
          <button onclick="deleteFoodItem(${item.id})">Delete</button>
        </div>
      `;
      foodItemsList.appendChild(foodItem);
    });
  }
  
  // Function to edit a food item
  function editFoodItem(foodId) {
    const foodItem = cafeteria.find(item => item.id === foodId);
    if (foodItem) {
      const newName = prompt('Enter new name:', foodItem.name);
      const newPrice = parseFloat(prompt('Enter new price:', foodItem.price));
      const newStock = parseInt(prompt('Enter new stock:', foodItem.stock));
  
      if (newName && !isNaN(newPrice) && !isNaN(newStock)) {
        foodItem.name = newName;
        foodItem.price = newPrice;
        foodItem.stock = newStock;
        foodItem.available = newStock > 0;
  
        // Save updated cafeteria data to localStorage
        localStorage.setItem('cafeteria', JSON.stringify(cafeteria));
  
        // Refresh the food items list
        displayFoodItems();
      } else {
        alert('Invalid input. Please try again.');
      }
    }
  }
  
  // Function to delete a food item
  function deleteFoodItem(foodId) {
    if (confirm('Are you sure you want to delete this food item?')) {
      cafeteria = cafeteria.filter(item => item.id !== foodId);
  
      // Save updated cafeteria data to localStorage
      localStorage.setItem('cafeteria', JSON.stringify(cafeteria));
  
      // Refresh the food items list
      displayFoodItems();
    }
  }
  
  // Function to add a new food item
  document.getElementById('add-food-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('food-name').value;
    const price = parseFloat(document.getElementById('food-price').value);
    const stock = parseInt(document.getElementById('food-stock').value);
    const imageFile = document.getElementById('food-image').files[0];
  
    if (name && price && stock && imageFile) {
      // Convert the image file to Base64
      const reader = new FileReader();
      reader.onload = function (event) {
        const base64Image = event.target.result;
  
        // Create a new food item
        const newFoodItem = {
          id: cafeteria.length + 1,
          name,
          price,
          stock,
          image: base64Image, // Store the Base64 image
          available: stock > 0
        };
  
        // Add the new food item to the cafeteria array
        cafeteria.push(newFoodItem);
        localStorage.setItem('cafeteria', JSON.stringify(cafeteria));
  
        // Show success message
        alert('Food item added successfully!');
  
        // Clear the form
        document.getElementById('add-food-form').reset();
  
        // Refresh the food items list
        displayFoodItems();
      };
      reader.readAsDataURL(imageFile); // Read the image file as Base64
    } else {
      alert('Please fill out all fields.');
    }
  });
  
  // Load data when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    displayOrders();
    displayFoodItems();
  });