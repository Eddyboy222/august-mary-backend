// routes/adminRoutes.js
import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {
  const { password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid password" });
  }

  res.json({ message: "Access granted" });
});

export default router;
