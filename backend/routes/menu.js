import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const filePath = path.resolve("data/menu.json");

router.get("/", (req, res) => {
  const menu = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];

  res.json(menu);
});

export default router;
