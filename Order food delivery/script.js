
// Cart as a Map: key=item id, value={item, quantity}
const cart = new Map();

// Render menu items to #menu-items container
function renderMenu() {
  const container = document.getElementById('menu-items');
  container.innerHTML = ''; // Clear

  menuItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p>₹${item.price}</p>
      <button data-id="${item.id}">Add to Cart</button>
    `;

    container.appendChild(card);
  });

  // Attach event listeners to buttons
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      addToCart(id);
    });
  });
}

// Add item to cart (or increment quantity)
function addToCart(id) {
  if (cart.has(id)) {
    const cartItem = cart.get(id);
    cartItem.quantity++;
  } else {
    const item = menuItems.find(i => i.id === id);
    cart.set(id, { item, quantity: 1 });
  }
  renderCart();
}

// Remove item from cart or reduce quantity
function removeFromCart(id) {
  if (!cart.has(id)) return;

  const cartItem = cart.get(id);
  if (cartItem.quantity > 1) {
    cartItem.quantity--;
  } else {
    cart.delete(id);
  }
  renderCart();
}

// Render the cart UI in #cart-container
function renderCart() {
  const container = document.getElementById('cart-container');
  container.innerHTML = ''; // Clear

  if (cart.size === 0) {
    container.innerHTML = '<p>No items yet. Add something from the menu!</p>';
    return;
  }

  let total = 0;
  cart.forEach(({ item, quantity }) => {
    total += item.price * quantity;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span>${item.name} x${quantity}</span>
      <div>
        <span>₹${item.price * quantity}</span>
        <button data-id="${item.id}">Remove</button>
      </div>
    `;

    container.appendChild(div);
  });

  // Total price element
  const totalEl = document.createElement('div');
  totalEl.id = 'cart-total';
  totalEl.textContent = `Total: ₹${total}`;
  container.appendChild(totalEl);

  // Attach event listeners to remove buttons
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      removeFromCart(id);
    });
  });
}

// Handle order form submission
function handleOrderSubmit(event) {
  event.preventDefault();
  if (cart.size === 0) {
    alert('Your cart is empty! Please add items before placing an order.');
    return;
  }
  const form = event.target;
  const name = form.querySelector('input[placeholder="Your Name"]').value.trim();
  const address = form.querySelector('input[placeholder="Delivery Address"]').value.trim();
  const phone = form.querySelector('input[placeholder="Phone Number"]').value.trim();

  if (!name || !address || !phone) {
    alert('Please fill all the fields.');
    return;
  }

  alert(`Thank you, ${name}! Your order has been placed.\nWe will deliver to: ${address}\nContact: ${phone}`);

  // Clear cart and form
  cart.clear();
  renderCart();
  form.reset();
}

window.onload = () => {
  renderMenu();
  renderCart();

  // Order form listener
  const orderForm = document.getElementById('order-form');
  orderForm.addEventListener('submit', handleOrderSubmit);
};
