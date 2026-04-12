const Orphanage = require("../models/Orphanage");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const moneyDonation = require("../models/moneyDonation");
const itemDonation = require("../models/itemDonation");

const getOrphanageDashboard = async (req, res) => {
  try {
    const orphanage = await Orphanage.findOne({ user: req.user.id });
    if (!orphanage) {
      return res.status(404).json({ message: "Orphanage not found" });
    }
    const moneyDonations = await moneyDonation.find({
      orphanage: orphanage._id,
    }).populate("user", "name email");
    const itemDonations = await itemDonation.find({
      orphanage: orphanage._id,
    }).populate("user", "name email");
    const totalMoney = moneyDonations.reduce(
      (sum, d) => sum + d.amount,
      0
    );
    const itemsReceived = itemDonations.filter(
      (d) => d.deliveryStatus === "DELIVERED"
    ).length;
    const pendingItems = itemDonations.filter(
      (d) => d.deliveryStatus === "PENDING"
    ).length;
    res.json({
      orphanage: {
        name: orphanage.name,
        address: orphanage.address,
        city: orphanage.city,
        phone: orphanage.phone,
        email: req.user.email   
      },
      totalMoney,
      itemsReceived,
      pendingItems,
      recentMoney: moneyDonations,
      recentItems: itemDonations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createOrphanage = async (req, res) => {
    try {
        const { name, email, phone, password, address, pincode, needs } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "orphanage"
        });
        const orphanage = await Orphanage.create({
            user: user._id,
            name,
            address,
            pincode,
            phone,
            needs: needs || []
        });
        res.status(201).json({
            message: "Orphanage registered successfully",
            orphanage
        });

    } catch (error) {
        console.error("❌ FULL ERROR:", error);
        console.error("❌ MESSAGE:", error.message);
        console.error("❌ CODE:", error.code);
        res.status(500).json({ message: error.message });
    }
};

const getAllOrphanages = async (req, res) => {
    try {
        const orphanages = await Orphanage.find();
        res.status(200).json(orphanages);
    } 
    catch(error) {
        res.status(500).json({message: error.message});
    }
};

const getNearbyOrphanages = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }
    const orphanages = await Orphanage.find({
      address: {$regex: city, $options: "i"}
    });
    res.status(200).json(orphanages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createOrphanage,
    getAllOrphanages,
    getNearbyOrphanages
};