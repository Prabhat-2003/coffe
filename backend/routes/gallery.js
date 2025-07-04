import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const filePath = path.resolve("data/gallery.json");

router.get("/", (req, res) => {
  const images = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];

  res.json(images);
});

export default router;
