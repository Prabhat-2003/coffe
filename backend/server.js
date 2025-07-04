// import express from "express";
// import cors from "cors";

// import authRoutes from "./routes/auth.js";
// import contactRoutes from "./routes/contact.js";
// import orderRoutes from "./routes/order.js";
// import menuRoutes from "./routes/menu.js";
// import galleryRoutes from "./routes/gallery.js";

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // API Routes
// app.use("/api/auth", authRoutes);        // Signin & Signup
// app.use("/api/contact", contactRoutes);  // Contact form
// app.use("/api/order", orderRoutes);      // Order submission
// app.use("/api/menu", menuRoutes);        // Get menu
// app.use("/api/gallery", galleryRoutes);  // Get gallery

// // Start server
// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });

// server.js
import express from "express";
import cors from "cors";

// Import route files
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import orderRoutes from "./routes/order.js";
import menuRoutes from "./routes/menu.js";
import galleryRoutes from "./routes/gallery.js";

// Initialize Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);        // POST /signup, /signin
app.use("/api/contact", contactRoutes);  // POST /contact
app.use("/api/order", orderRoutes);      // POST /order
app.use("/api/menu", menuRoutes);        // GET /menu
app.use("/api/gallery", galleryRoutes);  // GET /gallery

// Health check route (optional)
app.get("/", (req, res) => {
  res.send("Coffee Shop API is running ☕");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
