const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const Orphanage = require("../models/Orphanage");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

const MoneyDonation = require("../models/moneyDonation");
const ItemDonation = require("../models/itemDonation");

router.get("/", async (req, res) => {
  try {
    const orphanages = await Orphanage.find({ verified: true })
    .populate("user", "email"); 
    res.json(orphanages);
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, address, pincode, phone, needs, email, password } = req.body;
    if (!name || !address || !pincode || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,       
      phone,   
      email,
      password: hashedPassword,
      role: "orphanage"
    });
    await newUser.save();
    const newOrphanage = new Orphanage({
      name,
      address,
      pincode,
      phone,
      needs: needs.map(n => n.trim()),
      user: newUser._id,
      verified: false  
    });
    await newOrphanage.save();
    res.status(201).json({
      message: "Orphanage registered successfully. Wait for admin approval."
    });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const orphanage = await Orphanage.findOne({ user: req.user._id || req.user.id });

    if (!orphanage) {
      return res.status(404).json({ message: "Orphanage not found" });
    }
    const money = await MoneyDonation.aggregate([
      { $match: { orphanage: orphanage._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const delivered = await ItemDonation.countDocuments({
      orphanage: orphanage._id,
      deliveryStatus: "DELIVERED"
    });
    const pending = await ItemDonation.countDocuments({
      orphanage: orphanage._id,
      deliveryStatus: "PENDING"
    });
    const recentMoney = await MoneyDonation.find({ orphanage: orphanage._id })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);
    const recentItems = await ItemDonation.find({ orphanage: orphanage._id })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({
      orphanage, 
      totalMoney: money[0]?.total || 0,
      itemsReceived: delivered,
      pendingItems: pending,
      recentMoney,
      recentItems
    });
  } catch (err) {
    console.error("❌ DASHBOARD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;