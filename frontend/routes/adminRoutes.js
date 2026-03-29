const express = require("express");
const router = express.Router();
const adminOnly = require("../middleware/adminMiddleware");
const MoneyDonation = require("../models/moneyDonation");
const ItemDonation = require("../models/itemDonation");
const Orphanage = require("../models/Orphanage"); 

router.get("/money-donations", adminOnly, async (req, res) => {
  try {
    const donations = await MoneyDonation.find()
      .populate("user", "name email");
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/item-donations", adminOnly, async (req, res) => {
  try {
    const donations = await ItemDonation.find()
      .populate("user", "name email");
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const totalMoney = await MoneyDonation.aggregate([
      { $match: { status: "SUCCESS" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const itemStats = await ItemDonation.countDocuments({ deliveryStatus: "DELIVERED" });
    const pendingApprovals = await Orphanage.countDocuments({ verified: false });

    res.json({
      totalDonations: totalMoney[0]?.total || 0,
      itemsDonated: itemStats
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

router.patch("/money-donation/:id", adminOnly, async (req, res) => {
  const { status } = req.body;

  try {
    const donation = await MoneyDonation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/item-donation/:id", adminOnly, async (req, res) => {
  const { status } = req.body;

  try {
    const donation = await ItemDonation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
