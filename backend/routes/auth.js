// import express from "express";
// import fs from "fs";
// import path from "path";

// const router = express.Router();
// const filePath = path.resolve("data/users.json");

// router.post("/signup", (req, res) => {
//   const { name, email, password } = req.body;
//   const users = fs.existsSync(filePath)
//     ? JSON.parse(fs.readFileSync(filePath))
//     : [];

//   const userExists = users.find(u => u.email === email);
//   if (userExists) return res.status(400).json({ error: "User already exists" });

//   users.push({ name, email, password });
//   fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
//   res.status(201).json({ message: "Signup successful" });
// });

// router.post("/signin", (req, res) => {
//   const { email, password } = req.body;
//   const users = fs.existsSync(filePath)
//     ? JSON.parse(fs.readFileSync(filePath))
//     : [];

//   const user = users.find(u => u.email === email && u.password === password);
//   if (!user) return res.status(401).json({ error: "Invalid credentials" });

//   res.json({ message: "Login successful", user: { name: user.name, email: user.email } });
// });

// export default router;
import express from "express";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const filePath = path.resolve("data/users.json");

// Helper function to read/write users
const getUsers = () => {
  try {
    return fs.existsSync(filePath) 
      ? JSON.parse(fs.readFileSync(filePath))
      : [];
  } catch (err) {
    return [];
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  
  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const users = getUsers();
  const userExists = users.some(u => u.email === email);
  
  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = { 
    id: uuidv4(),
    name, 
    email, 
    password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ 
    message: "Signup successful",
    user: { id: newUser.id, name: newUser.name, email: newUser.email }
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ 
    message: "Login successful", 
    user: { id: user.id, name: user.name, email: user.email }
  });
});

export default router;