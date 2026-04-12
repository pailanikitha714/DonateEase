const User = require("../models/User");
const Orphanage = require("../models/Orphanage");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: "user",
    });
    res.status(201).json({ message: "User registered", role: user.role });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });
    if (user.role === "orphanage") {
      const orphanage = await Orphanage.findOne({ user: user._id });
      if (!orphanage) {
        return res.status(404).json({ message: "Orphanage not found" });
      }
      if (orphanage.status === "pending") {
        return res.status(403).json({ message: "Orphanage not approved yet" });
      }
      if (orphanage.status === "rejected") {
        return res.status(403).json({ message: "Your request was rejected by admin" });
      }
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
