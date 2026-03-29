const MoneyDonation = require("../models/moneyDonation");
const Orphanage = require("../models/Orphanage")
const donateMoney = async (req, res) => {
  try {
    const { orphanageId, amount, paymentMethod } = req.body;
    const orphanage = await Orphanage.findById(orphanageId);
    if (!orphanage) {
      return res.status(404).json({ message: "Orphanage not found" });
    }
    const newDonation = new MoneyDonation({
      user: req.user.id,      
      orphanage: orphanageId,
      amount: amount,
      paymentMethod: paymentMethod,
      status: "SUCCESS" 
    });
    await newDonation.save();
    res.status(201).json({ message: "Donation successful", donation: newDonation });
  } catch (error) {
    console.error("Donation Error:", error);
    res.status(500).json({ message: "Server error while processing donation" });
  }
};

const getMyMoneyDonations = async (req, res) => {
  try {
    const donations = await MoneyDonation.find({ user: req.user.id })
      .populate("orphanage", "name address");
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllMoneyDonations = async (req, res) => {
  try {
    const donations = await MoneyDonation.find()
      .populate("user", "name email") 
      .populate("orphanage", "name")  
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error("Error fetching all money donations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  donateMoney,
  getMyMoneyDonations,
  getAllMoneyDonations
};