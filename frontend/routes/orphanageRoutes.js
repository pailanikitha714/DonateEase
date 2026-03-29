const express = require("express");
const router = express.Router();
const Orphanage = require("../models/Orphanage");

router.get("/", async (req, res) => {
  try {
    const orphanages = await Orphanage.find({}); 
    console.log(`🔍 DEBUG: Backend received request. Found ${orphanages.length} orphanages.`);
    res.json(orphanages);
  } catch (error) {
    console.error("❌ ERROR in orphanageRoutes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, address, city, pincode, needs } = req.body;
    const newOrphanage = new Orphanage({ 
      name, 
      address, 
      city, 
      pincode, 
      needs
    });
    await newOrphanage.save();
    res.status(201).json(newOrphanage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;