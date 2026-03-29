const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const {
  donateItem,
  getMyItemDonations,
  getAllItemDonations,
  updateDeliveryStatus
} = require("../controllers/itemDonationController");

router.post("/", protect, donateItem);

router.get("/my", protect, getMyItemDonations);

router.get("/all", protect, adminOnly, getAllItemDonations);

router.put("/:id/status", protect, adminOnly, updateDeliveryStatus);

module.exports = router;
