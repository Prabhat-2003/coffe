document.addEventListener("DOMContentLoaded", function () {
  // Constants and Configurations
  const API_BASE_URL = "http://localhost:5000/api";
  const body = document.body;
  let cart = [];

  // Mobile Menu Functionality
  const initMobileMenu = () => {
    const navLinks = document.querySelectorAll(".nav-menu .nav-link");
    const menuOpenButton = document.querySelector("#menu-open-button");
    const menuCloseButton = document.querySelector("#menu-close-button");

    if (menuOpenButton && menuCloseButton) {
      menuOpenButton.addEventListener("click", () => {
        body.classList.add("show-mobile-menu", "no-scroll");
      });

      menuCloseButton.addEventListener("click", () => {
        body.classList.remove("show-mobile-menu", "no-scroll");
      });

      navLinks.forEach(link => {
        link.addEventListener("click", () => {
          body.classList.remove("show-mobile-menu", "no-scroll");
        });
      });
    }
  };

  // Background Video Initialization
  const initBackgroundVideo = () => {
    const video = document.getElementById("bg-video");
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    video.load();

    video.play().catch(err => {
      console.warn("Autoplay failed, maybe user interaction is required", err);
    });
  };

  // Swiper Initialization
  const initSwiper = () => {
    new Swiper(".swiper", {
      loop: true,
      spaceBetween: 25,
      grabCursor: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        640: { slidesPerView: 1 },
        900: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  };
  
  // Popup Management
  const initPopups = () => {
    const popupButtons = document.querySelectorAll("[data-popup]");
    const popups = document.querySelectorAll(".popup-overlay");
    const closeButtons = document.querySelectorAll(".close-btn");

    popupButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const popupId = btn.getAttribute("data-popup");
        const popup = document.getElementById(popupId);
        
        popups.forEach(p => p.classList.remove("active"));
        if (popup) {
          popup.classList.add("active");
          body.classList.add("no-scroll");
        }
      });
    });

    closeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        btn.closest(".popup-overlay").classList.remove("active");
        body.classList.remove("no-scroll");
      });
    });

    popups.forEach(popup => {
      popup.addEventListener("click", (e) => {
        if (e.target === popup) {
          popup.classList.remove("active");
          body.classList.remove("no-scroll");
        }
      });
    });
  };

  const initCart = () => {
  // Quantity controls
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const container = this.closest('.quantity-controls');
      const quantityElement = container.querySelector('.quantity');
      let quantity = parseInt(quantityElement.textContent);
      
      if (this.classList.contains('minus') && quantity > 0) {
        quantity--;
      } else if (this.classList.contains('plus')) {
        quantity++;
      }
      
      quantityElement.textContent = quantity;
    });
    // Add this after initCart() function
const initPaymentMethods = () => {
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const cardDetails = document.getElementById('card-details');
  const upiDetails = document.getElementById('upi-details');

  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      cardDetails.style.display = 'none';
      upiDetails.style.display = 'none';
      
      if (radio.value === 'card') {
        cardDetails.style.display = 'grid';
      } else if (radio.value === 'upi') {
        upiDetails.style.display = 'grid';
      }
    });
  });
};

// Then add this to your initialization section at the bottom of the file
initPaymentMethods();
  });

  // Add to cart buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const name = productCard.querySelector('h3').textContent;
      const price = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
      const quantity = parseInt(productCard.querySelector('.quantity').textContent);
      
      if (quantity > 0) {
        addToCart(name, price, quantity);
        // Reset quantity after adding to cart
        productCard.querySelector('.quantity').textContent = '0';
      }
    });
  });

  // Checkout button
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (cart.length > 0) {
        document.getElementById('order-popup').classList.add('active');
      } else {
        alert('Your cart is empty!');
      }
    });
  }
};

  const addToCart = (name, price, quantity) => {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ name, price, quantity });
    }
    
    updateCart();
  };

  const updateCart = () => {
    const cartItemsElement = document.querySelector('.cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    let total = 0;
    
    cartItemsElement.innerHTML = '';
    
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      
      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.innerHTML = `
        <span>${item.name} (${item.quantity})</span>
        <span>$${itemTotal.toFixed(2)}</span>
      `;
      cartItemsElement.appendChild(cartItemElement);
    });
    
    totalAmountElement.textContent = total.toFixed(2);
    document.getElementById('order-items').value = cart.map(item => `${item.name} (${item.quantity})`).join(', ');
    document.getElementById('order-total').value = total.toFixed(2);
  };

  // Authentication Management
  const updateAuthUI = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const authButtons = document.querySelector(".auth-buttons");
    
    if (!authButtons) return;
    
    if (currentUser) {
      authButtons.innerHTML = `
        <button class="signin" id="logout-btn">Logout</button>
        <span class="user-greeting">Hi, ${currentUser.name}</span>
      `;
      document.getElementById("logout-btn").addEventListener("click", logout);
    } else {
      authButtons.innerHTML = `
        <button class="signin" data-popup="signin-popup">Sign In</button>
        <button class="signup" data-popup="signup-popup">Sign Up</button>
      `;
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    updateAuthUI();
  };

  // Form Handling
  const handleForm = (id, endpoint) => {
    const form = document.getElementById(id);
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      
      try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Request failed");
        }

        const data = await res.json();
        alert(data.message || "Success!");
        form.reset();
        form.closest(".popup-overlay").classList.remove("active");
        
        if (endpoint === "/auth/signin") {
          localStorage.setItem("currentUser", JSON.stringify(data.user));
          updateAuthUI();
        }
      } catch (err) {
        alert(err.message || "An error occurred");
      }
    });
    const payload = {
  userId: currentUser.id,
  items: cart.map(item => `${item.name} (${item.quantity})`).join(', '),
  total: document.getElementById("total-amount").textContent,
  address: document.querySelector("#order-form input[name='address']").value,
  paymentMethod: document.querySelector("#order-form input[name='payment']:checked").value,
  cardDetails: document.querySelector("#order-form input[name='payment']:checked").value === 'card' ? {
    number: document.querySelector("#order-form input[name='card-number']").value,
    expiry: document.querySelector("#order-form input[name='card-expiry']").value,
    cvv: document.querySelector("#order-form input[name='card-cvv']").value
  } : null,
  upiId: document.querySelector("#order-form input[name='payment']:checked").value === 'upi' ? 
    document.querySelector("#order-form input[name='upi-id']").value : null
};
  };

  // Order Form Submission
  const initOrderForm = () => {
    const orderForm = document.getElementById("order-form");
    if (!orderForm) return;

    orderForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      
      if (!currentUser) {
        alert("Please sign in to place an order");
        document.getElementById("signin-popup").classList.add("active");
        return;
      }

      const payload = {
        userId: currentUser.id,
        items: cart.map(item => `${item.name} (${item.quantity})`).join(', '),
        total: document.getElementById("total-amount").textContent,
        address: document.getElementById("order-address").value,
        notes: document.getElementById("order-notes").value
      };

      try {
        const res = await fetch(`${API_BASE_URL}/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error("Order failed");
        
        const data = await res.json();
        alert(`Order successful! Your order ID: ${data.orderId}`);
        orderForm.reset();
        document.querySelector(".cart-items").innerHTML = "";
        document.getElementById("total-amount").textContent = "0.00";
        cart = [];
        document.getElementById("order-popup").classList.remove("active");
      } catch (err) {
        alert(err.message || "Order failed");
      }
    });
  };

  // Initialize all components
  initMobileMenu();
  initBackgroundVideo();
  initSwiper();
  initPopups();
  initCart();
  updateAuthUI();
  handleForm("signup-form", "/auth/signup");
  handleForm("signin-form", "/auth/signin");
  handleForm("contact-form", "/contact");
  initOrderForm();
});

// Load video after window loads
window.addEventListener("load", function () {
  const video = document.getElementById("bg-video");
  if (video) video.play().catch(() => {});
});
// Cart functionality
let cart = [];

// Initialize Payment Methods
function initPaymentMethods() {
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const cardDetails = document.getElementById('card-details');
  const upiDetails = document.getElementById('upi-details');
  
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      cardDetails.style.display = 'none';
      upiDetails.style.display = 'none';
      
      if (radio.value === 'card') {
        cardDetails.style.display = 'block';
      } else if (radio.value === 'upi') {
        upiDetails.style.display = 'block';
      }
    });
  });
  
  // Format card number input
  const cardNumberInput = document.querySelector('input[name="card-number"]');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
    });
  }
  
  // Format expiry date input
  const expiryInput = document.querySelector('input[name="card-expiry"]');
  if (expiryInput) {
    expiryInput.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 5);
    });
  }
}

// Update Cart and Order Summary
function updateCart() {
  const cartItemsElement = document.querySelector('.cart-items');
  const totalAmountElement = document.getElementById('total-amount');
  let total = 0;
  
  cartItemsElement.innerHTML = '';
  
  cart.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
      <span>${item.name} × ${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    cartItemsElement.appendChild(itemElement);
    total += item.price * item.quantity;
  });
  
  totalAmountElement.textContent = total.toFixed(2);
  updateOrderSummary();
  
  // Trigger cart updated event
  const event = new Event('cartUpdated');
  document.dispatchEvent(event);
}

function updateOrderSummary() {
  const orderItemsDisplay = document.getElementById('order-items-display');
  const popupTotalDisplay = document.getElementById('total-amount-display'); // Popup total
  const cartTotalDisplay = document.querySelector('.cart-total span'); // Cart total
  const orderBtnTotal = document.getElementById('order-btn-total');
  
  let total = 0;
  orderItemsDisplay.innerHTML = '';
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const itemElement = document.createElement('div');
    itemElement.className = 'order-item';
    itemElement.innerHTML = `
      <span>${item.name} × ${item.quantity}</span>
      <span>$${itemTotal.toFixed(2)}</span>
    `;
    orderItemsDisplay.appendChild(itemElement);
  });
  
  const formattedTotal = total.toFixed(2);
  
  // Update ALL total displays
  if (popupTotalDisplay) popupTotalDisplay.textContent = formattedTotal;
  if (cartTotalDisplay) cartTotalDisplay.textContent = formattedTotal;
  if (orderBtnTotal) orderBtnTotal.textContent = formattedTotal;
}
// Add to Cart Functionality
function addToCart(productName, productPrice) {
  const existingItem = cart.find(item => item.name === productName);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      name: productName,
      price: productPrice,
      quantity: 1
    });
  }
  
  updateCart();
}

// Remove from Cart Functionality
function removeFromCart(productName) {
  const itemIndex = cart.findIndex(item => item.name === productName);
  
  if (itemIndex !== -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity--;
    } else {
      cart.splice(itemIndex, 1);
    }
    updateCart();
  }
}

// Handle Form Submission
function handleOrderSubmission(e) {
  e.preventDefault();
  
  const form = e.target;
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  
  // Prepare order data
  const orderData = {
    customer: {
      name: form.elements['name'].value,
      email: form.elements['email'].value,
      phone: form.elements['phone'].value,
      address: form.elements['address'].value,
      instructions: form.elements['instructions'].value
    },
    items: [...cart],
    total: parseFloat(document.getElementById('total-amount-display').textContent),
    payment: {
      method: paymentMethod,
      details: getPaymentDetails(paymentMethod)
    },
    date: new Date().toISOString()
  };
  
  // Process based on payment method
  switch(paymentMethod) {
    case 'card':
      if (!validateCardPayment()) {
        alert('Please enter valid card details');
        return;
      }
      processCardPayment(orderData);
      break;
      
    case 'paypal':
      processPayPalPayment(orderData);
      break;
      
    case 'upi':
      if (!validateUPIPayment()) {
        alert('Please enter a valid UPI ID');
        return;
      }
      processUPIPayment(orderData);
      break;
      
    default: // cash
      completeOrder(orderData);
      break;
  }
}

// Helper functions
function getPaymentDetails(method) {
  switch(method) {
    case 'card':
      return {
        cardNumber: document.querySelector('input[name="card-number"]').value.replace(/\s/g, ''),
        cardName: document.querySelector('input[name="card-name"]').value,
        expiry: document.querySelector('input[name="card-expiry"]').value,
        cvv: document.querySelector('input[name="card-cvv"]').value
      };
    case 'upi':
      return {
        upiId: document.querySelector('input[name="upi-id"]').value
      };
    default:
      return null;
  }
}

function validateCardPayment() {
  const cardNumber = document.querySelector('input[name="card-number"]').value.replace(/\s/g, '');
  const expiry = document.querySelector('input[name="card-expiry"]').value;
  const cvv = document.querySelector('input[name="card-cvv"]').value;
  
  return cardNumber.length >= 13 && cardNumber.length <= 19 &&
         /^\d{2}\/\d{2}$/.test(expiry) &&
         /^\d{3,4}$/.test(cvv);
}

function validateUPIPayment() {
  const upiId = document.querySelector('input[name="upi-id"]').value;
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId);
}

// Payment processors (mock implementations)
function processCardPayment(orderData) {
  // In a real app, you would integrate with a payment gateway here
  console.log('Processing card payment...', orderData);
  setTimeout(() => {
    completeOrder(orderData);
  }, 2000);
}

function processPayPalPayment(orderData) {
  // In a real app, you would redirect to PayPal
  console.log('Redirecting to PayPal...', orderData);
  setTimeout(() => {
    completeOrder(orderData);
  }, 3000);
}

function processUPIPayment(orderData) {
  // In a real app, you would initiate UPI payment
  console.log('Initiating UPI payment...', orderData);
  setTimeout(() => {
    completeOrder(orderData);
  }, 2000);
}

function completeOrder(orderData) {
  // Send to server or handle locally
  console.log('Order completed:', orderData);
  
  // Show success message
  alert(`Order placed successfully!\nTotal: $${orderData.total.toFixed(2)}\nPayment Method: ${orderData.payment.method}`);
  
  // Close popup and reset cart
  document.getElementById('order-popup').style.display = 'none';
  cart = [];
  updateCart();
}

// Popup functionality
function openOrderPopup() {
  updateOrderSummary();
  document.getElementById('order-popup').style.display = 'flex';
}

function closeOrderPopup() {
  document.getElementById('order-popup').style.display = 'none';
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize payment methods
  initPaymentMethods();
  
  // Set up event listeners
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const product = this.closest('.product');
      const name = product.querySelector('h3').textContent;
      const price = parseFloat(product.querySelector('.price').textContent.replace('$', ''));
      addToCart(name, price);
    });
  });
  
  document.querySelector('.checkout-btn').addEventListener('click', openOrderPopup);
  document.querySelector('.close-btn').addEventListener('click', closeOrderPopup);
  
  // Update order summary when cart changes
  document.addEventListener('cartUpdated', updateOrderSummary);
  
  // Handle form submission
  document.getElementById('order-form').addEventListener('submit', handleOrderSubmission);
  
  // Initial cart update
  updateCart();
  
});