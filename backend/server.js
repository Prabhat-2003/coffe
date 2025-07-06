import express from 'express';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  dataPath: join(__dirname, 'data')
};

// Initialize Express
const app = express();

// Data directory setup
const initializeDataDirectory = () => {
  if (!fs.existsSync(config.dataPath)) {
    fs.mkdirSync(config.dataPath);
    
    const initialData = {
      menu: [],
      users: [],
      messages: [],
      orders: [],
      gallery: []
    };
    
    Object.entries(initialData).forEach(([file, data]) => {
      fs.writeFileSync(
        join(config.dataPath, `${file}.json`),
        JSON.stringify(data, null, 2)
      );
    });
  }
};
initializeDataDirectory();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../frontend')));

// Import routes
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import orderRoutes from './routes/order.js';
import menuRoutes from './routes/menu.js';
import galleryRoutes from './routes/gallery.js';

// API Router
const apiRouter = express.Router();

// Auth routes with validation
apiRouter.use('/auth', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, authRoutes);

// Contact routes with validation
apiRouter.use('/contact', [
  body('name').notEmpty().trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('message').notEmpty().trim().escape()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, contactRoutes);

// Other routes
apiRouter.use('/order', orderRoutes);
apiRouter.use('/menu', menuRoutes);
apiRouter.use('/gallery', galleryRoutes);

// Mount API router
app.use('/api', apiRouter);

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    environment: config.env,
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  
  const response = {
    error: config.env === 'development' ? err.message : 'Something went wrong',
    ...(config.env === 'development' && { stack: err.stack })
  };

  res.status(err.status || 500).json(response);
});

// Start server
app.listen(config.port, () => {
  console.log(`
  🚀 Server started
  --------------------------
  Mode: ${config.env}
  Port: ${config.port}
  Data: ${config.dataPath}
  URL: http://localhost:${config.port}
  `);
});