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

  // Cart and Order Management
  const initCart = () => {
    // Quantity controls
    document.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const quantityElement = productCard.querySelector('.quantity');
        let quantity = parseInt(quantityElement.textContent);
        
        quantity = this.classList.contains('minus') 
          ? Math.max(0, quantity - 1) 
          : quantity + 1;
        
        quantityElement.textContent = quantity;
      });
    });
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
        const quantity = parseInt(productCard.querySelector('.quantity').textContent);
        
        if (quantity > 0) {
          addToCart(productName, productPrice, quantity);
          productCard.querySelector('.quantity').textContent = '0';
        }
      });
    });
    
    // Checkout button
    document.querySelector('.checkout-btn')?.addEventListener('click', function() {
      if (cart.length > 0) {
        document.getElementById("order-popup").classList.add("active");
      } else {
        alert('Your cart is empty!');
      }
    });
    
    // Order Now button
    document.querySelector('.order-now')?.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('order-menu').scrollIntoView({ behavior: 'smooth' });
    });
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