// Fetch cafeteria data from JSON
fetch('../data/cafeteria.json')
  .then(response => response.json())
  .then(data => {
    const pendingOrders = document.getElementById('pending-orders');
    const servedOrders = document.getElementById('served-orders');

    // Simulate some orders (to be replaced with actual data)
    const orders = [
      { id: 1, food: 'Burger', time: '10:00 AM', status: 'pending' },
      { id: 2, food: 'Pizza', time: '10:15 AM', status: 'served' }
    ];

    orders.forEach(order => {
      const li = document.createElement('li');
      li.textContent = `${order.food} - ${order.time}`;
      if (order.status === 'pending') pendingOrders.appendChild(li);
      else servedOrders.appendChild(li);
    });
  });

// Add new food item
document.getElementById('add-food-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('food-name').value;
  const price = document.getElementById('food-price').value;
  const stock = document.getElementById('food-stock').value;
  const image = document.getElementById('food-image').files[0];

  alert(`New food item added: ${name}`);
  // Update JSON with new food item (to be implemented)
});