const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const morgan = require("morgan");

app.use(cors({
  origin: "https://donate-ease-orcin.vercel.app",
  credentials: true
}));

app.use(express.json());

app.use(morgan("dev"));

const authRoutes = require("./routes/authRoutes");
const orphanageRoutes = require("./routes/orphanageRoutes");
const moneyDonationRoutes = require("./routes/moneyDonationRoutes");
const itemDonationRoutes = require("./routes/itemDonationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const verifyToken = require("./middleware/verifyToken");

app.use("/api/auth", authRoutes);
app.use("/api/orphanages", orphanageRoutes);
app.use("/api/donate/money", moneyDonationRoutes);
app.use("/api/donate/item", itemDonationRoutes);
app.use("/api/admin", verifyToken, adminRoutes);

app.get("/", (req, res) => {
  res.send("DonateEase Backend Running 🚀");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
