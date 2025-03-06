// Fetch cafeteria data from JSON
fetch('../data/cafeteria.json')
  .then(response => response.json())
  .then(data => {
    const foodList = document.getElementById('food-list');
    data.forEach(item => {
      const foodItem = document.createElement('div');
      foodItem.className = 'food-item';
      foodItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="${item.available ? '' : 'blur'}">
        <h3>${item.name}</h3>
        <p>Price: ${item.price} BDT</p>
        <p>Stock: ${item.stock}</p>
        <button onclick="orderFood(${item.id})" ${item.available ? '' : 'disabled'}>Order Now</button>
      `;
      foodList.appendChild(foodItem);
    });
  });

// Function to handle food ordering
function orderFood(foodId) {
  alert(`Order placed for food ID: ${foodId}`);
  // Update stock in JSON (to be implemented)
}