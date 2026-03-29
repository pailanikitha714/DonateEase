const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const {
  donateMoney,
  getMyMoneyDonations,
  getAllMoneyDonations
} = require("../controllers/moneyDonationController");

router.post("/", protect, donateMoney);

router.get("/my", protect, getMyMoneyDonations);

router.get("/all", protect, adminOnly, getAllMoneyDonations);

module.exports = router;
