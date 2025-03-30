// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function addToCart(productId, name, price) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    showNotification('Product removed from cart!');
}

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="products.html" class="cta-button">Continue Shopping</a>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    updateCartSummary();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const summaryElements = {
        subtotal: document.getElementById('subtotal'),
        shipping: document.getElementById('shipping'),
        tax: document.getElementById('tax'),
        total: document.getElementById('total')
    };

    if (summaryElements.subtotal) summaryElements.subtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (summaryElements.shipping) summaryElements.shipping.textContent = `$${shipping.toFixed(2)}`;
    if (summaryElements.tax) summaryElements.tax.textContent = `$${tax.toFixed(2)}`;
    if (summaryElements.total) summaryElements.total.textContent = `$${total.toFixed(2)}`;

    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.disabled = cart.length === 0;
    }
}

// Mobile Navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

if (burger && nav) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });
}

// Product Filtering
const filterInputs = document.querySelectorAll('.filters input, .filters select');
if (filterInputs.length > 0) {
    filterInputs.forEach(input => {
        input.addEventListener('change', filterProducts);
    });
}

function filterProducts() {
    const categoryFilters = Array.from(document.querySelectorAll('.filters input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    const priceRange = document.getElementById('price-range').value;
    const sortBy = document.getElementById('sort-by').value;
    
    // Implement filtering logic here
    console.log('Filtering products:', { categoryFilters, priceRange, sortBy });
}

// Contact Form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        showNotification('Message sent successfully!');
        contactForm.reset();
    });
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDisplay();
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.id);
            const productCard = button.closest('.product-card');
            const name = productCard.querySelector('h3').textContent;
            const price = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
            addToCart(productId, name, price);
        });
    });
}); 