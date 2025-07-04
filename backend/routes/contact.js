import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const filePath = path.resolve("data/messages.json");

router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const newMessage = {
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  };

  let messages = [];

  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      messages = JSON.parse(data);
    } catch (err) {
      messages = [];
    }
  }

  messages.push(newMessage);
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

  res.status(201).json({ message: "Message saved successfully!" });
});

export default router;
