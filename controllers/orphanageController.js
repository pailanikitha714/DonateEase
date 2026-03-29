const Orphanage = require("../models/Orphanage");

const createOrphanage = async (req, res) => {
    try {
        const orphanage = await Orphanage.create(req.body);
        res.status(201).json(orphanage);
    }
    catch(error) {
        res.status(500).json({message: error.message});
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