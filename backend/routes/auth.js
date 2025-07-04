import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const filePath = path.resolve("data/users.json");

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const users = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];

  const userExists = users.find(u => u.email === email);
  if (userExists) return res.status(400).json({ error: "User already exists" });

  users.push({ name, email, password });
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  res.status(201).json({ message: "Signup successful" });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const users = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  res.json({ message: "Login successful", user: { name: user.name, email: user.email } });
});

export default router;
