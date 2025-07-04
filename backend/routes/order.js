import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const filePath = path.resolve("data/orders.json");

router.post("/", (req, res) => {
  const { name, items, address } = req.body;

  if (!name || !Array.isArray(items) || !items.length || !address) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const orders = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];

  orders.push({ name, items, address, createdAt: new Date().toISOString() });
  fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
  res.status(201).json({ message: "Order placed successfully!" });
});

export default router;
