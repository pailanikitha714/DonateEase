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

router.get("/orphanages/pending", adminOnly, async (req, res) => {
  try {
    const orphanages = await Orphanage.find({ verified: false });
    res.json(orphanages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/orphanage/approve/:id", async (req, res) => {
  const orphanage = await Orphanage.findByIdAndUpdate(
    req.params.id,
    { status: "approved", verified: true },
    { new: true }
  );
  res.json({ message: "Approved ✅", orphanage });
});

router.patch("/orphanage/reject/:id", async (req, res) => {
  const orphanage = await Orphanage.findByIdAndUpdate(
    req.params.id,
    { status: "rejected", verified: false },
    { new: true }
  );

  res.json({ message: "Rejected ❌", orphanage });
});

module.exports = router;
