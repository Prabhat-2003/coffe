document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-menu .nav-link");
  const menuOpenButton = document.querySelector("#menu-open-button");
  const menuCloseButton = document.querySelector("#menu-close-button");
  const body = document.body;

  if (menuOpenButton && menuCloseButton) {
    menuOpenButton.addEventListener("click", () => {
      body.classList.add("show-mobile-menu");
    });

    menuCloseButton.addEventListener("click", () => {
      body.classList.remove("show-mobile-menu");
    });
   navLinks.forEach(link => {
  link.addEventListener("click", () => {
    body.classList.remove("show-mobile-menu");
  });
});
  }
});

window.addEventListener("load", function () {
  const video = document.getElementById("bg-video");

  if (video) {
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    video.load();

    video
      .play()
      .then(() => {
        console.log("Video playing");
      })
      .catch((err) => {
        console.warn(
          "Autoplay failed, maybe user interaction is required",
          err
        );
      });
  }
});

const swiper = new Swiper(".swiper", {
  loop: true,
  spaceBetween: 25,
  grabCursor: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  //responsive breakpoints
  breakpoints: {
    640: {
      slidesPerView: 1,
    },
    900: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

 document.addEventListener("DOMContentLoaded", function () {
        const buttons = document.querySelectorAll("[data-popup]");
        const popups = document.querySelectorAll(".popup-overlay");
        const closeButtons = document.querySelectorAll(".close-btn");

        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            const popupId = btn.dataset.popup;
            const popup = document.getElementById(popupId);
            if (popup) popup.style.display = "flex";
          });
        });

        closeButtons.forEach(btn => {
          btn.addEventListener("click", () => {
            btn.closest(".popup-overlay").style.display = "none";
          });
        });

        window.addEventListener("click", (e) => {
          popups.forEach(popup => {
            if (e.target === popup) popup.style.display = "none";
          });
        });

        const handleForm = (id, endpoint) => {
          const form = document.getElementById(id);
          if (!form) return;

          form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const payload = Object.fromEntries(formData.entries());

            try {
              const res = await fetch(`http://localhost:5000${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
              });
              const data = await res.json();
              alert(data.message || data.error || "Request completed.");
              form.reset();
              form.closest(".popup-overlay").style.display = "none";
            } catch (err) {
              alert("Request failed: " + err.message);
            }
          });
        };

        handleForm("signup-form", "/api/auth/signup");
        handleForm("signin-form", "/api/auth/signin");
        handleForm("order-form", "/api/order");
        handleForm("contact-form", "/api/contact");
      });

 document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("[data-popup]");
    const closeBtns = document.querySelectorAll(".close-btn");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = document.getElementById(btn.dataset.popup);
        if (target) target.classList.add("active");
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        btn.closest(".popup-overlay").classList.remove("active");
      });
    });
  });
  document.addEventListener("DOMContentLoaded", () => {
  const popupButtons = document.querySelectorAll("[data-popup]");
  const popups = document.querySelectorAll(".popup-overlay");
  const closeButtons = document.querySelectorAll(".close-btn");

  popupButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Close any open popup
      popups.forEach((popup) => popup.classList.remove("active"));
      
      // Open the selected popup
      const popupId = btn.getAttribute("data-popup");
      const popup = document.getElementById(popupId);
      if (popup) popup.classList.add("active");
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".popup-overlay").classList.remove("active");
    });
  });
});
// Order Menu Functionality
document.addEventListener("DOMContentLoaded", function() {
  // Initialize cart
  let cart = [];
  
  // Quantity controls
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const quantityElement = productCard.querySelector('.quantity');
      let quantity = parseInt(quantityElement.textContent);
      
      if (this.classList.contains('minus') ){
        quantity = Math.max(0, quantity - 1);
      } else {
        quantity += 1;
      }
      
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
  
  function addToCart(name, price, quantity) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ name, price, quantity });
    }
    
    updateCart();
  }
  
  function updateCart() {
    const cartItemsElement = document.querySelector('.cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    let total = 0;
    
    // Clear cart display
    cartItemsElement.innerHTML = '';
    
    // Add each item to cart display
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
    
    // Update total
    totalAmountElement.textContent = total.toFixed(2);
  }
  
  // Checkout button
  document.querySelector('.checkout-btn')?.addEventListener('click', function() {
    if (cart.length > 0) {
      alert(`Order placed! Total: $${document.getElementById('total-amount').textContent}`);
      cart = [];
      updateCart();
    } else {
      alert('Your cart is empty!');
    }
  });
  
  // Link Order Now button to order menu section
  document.querySelector('.order-now')?.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('order-menu').scrollIntoView({ behavior: 'smooth' });
  });
});
// Add this at the top of script.js
const API_BASE_URL = "http://localhost:5000/api";

// Update the handleForm function
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
      
      // For signin, store user in localStorage
      if (endpoint === "/auth/signin") {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        updateAuthUI();
      }
    } catch (err) {
      alert(err.message || "An error occurred");
    }
  });
};

// Add auth state management
function updateAuthUI() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const authButtons = document.querySelector(".buttons");
  
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
    // Reattach event listeners to new buttons
    document.querySelector("[data-popup='signin-popup']")
      .addEventListener("click", () => document.getElementById("signin-popup").classList.add("active"));
    document.querySelector("[data-popup='signup-popup']")
      .addEventListener("click", () => document.getElementById("signup-popup").classList.add("active"));
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  updateAuthUI();
}

// Initialize auth UI on load
document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
  
  // Update order form submission
  const orderForm = document.getElementById("order-form");
  if (orderForm) {
    orderForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      
      if (!currentUser) {
        alert("Please sign in to place an order");
        document.getElementById("signin-popup").classList.add("active");
        return;
      }

      const formData = new FormData(orderForm);
      const payload = {
        name: formData.get("name"),
        address: formData.get("address"),
        items: formData.get("items").split(",").map(item => item.trim()),
        total: document.getElementById("total-amount").textContent
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
      } catch (err) {
        alert(err.message || "Order failed");
      }
    });
  }
});