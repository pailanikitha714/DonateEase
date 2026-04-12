const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Orphanage = require("../models/Orphanage");
const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    console.log("REGISTER BODY:",req.body);
  try {
    const { name, email, phone, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user",
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  console.log("LOGIN BODY:",req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.role === "orphanage") {
      const orphanage = await Orphanage.findOne({ user: user._id });
      if (!orphanage) {
        return res.status(404).json({ message: "Orphanage not found" });
      }
      if (orphanage.status === "pending") {
        return res.status(403).json({
          message: "Your request is still pending admin approval ⏳"
        });
      }
      if (orphanage.status === "rejected") {
        return res.status(403).json({
          message: "Your request was rejected by admin ❌"
        });
      }
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
