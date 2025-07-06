import express from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const filePath = path.join(__dirname, '../data/orders.json');

const getOrders = () => {
  try {
    return fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      : [];
  } catch (err) {
    console.error('Error reading orders:', err);
    return [];
  }
};

const saveOrders = (orders) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error('Error saving orders:', err);
    throw new Error('Failed to save orders');
  }
};

// Create new order
router.post('/', (req, res, next) => {
  try {
    const { name, items, address, total } = req.body;

    if (!name || !Array.isArray(items) || !items.length || !address || !total) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const orders = getOrders();
    const newOrder = {
      id: uuidv4(),
      name,
      items,
      address,
      total,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    saveOrders(orders);

    return res.status(201).json({ 
      message: "Order placed successfully!",
      orderId: newOrder.id
    });
  } catch (err) {
    next(err);
  }
});

// Get all orders
router.get('/', (req, res, next) => {
  try {
    const orders = getOrders();
    return res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Update order status
router.patch('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === id);

    if (orderIndex === -1) {
      return res.status(404).json({ error: "Order not found" });
    }

    orders[orderIndex].status = status;
    saveOrders(orders);

    return res.json({ 
      message: "Order status updated",
      order: orders[orderIndex]
    });
  } catch (err) {
    next(err);
  }
});

export default router;