const mongoose = require("mongoose");
const Orphanage = require("./models/Orphanage");
require("dotenv").config();

const sampleOrphanages = [
  {
    name: "Sunrise Orphan Home",
    address: "123 MG Road",
    city: "Bangalore",
    pincode: "560001",
    needs: ["Clothes", "Books"],
    verified: true
  },
  {
    name: "Hope Haven",
    address: "45 Sector 18",
    city: "Delhi",
    pincode: "110020",
    needs: ["Food", "Money"],
    verified: true
  },
  {
    name: "Little Steps Shelter",
    address: "78 Park Street",
    city: "Kolkata",
    pincode: "700016",
    needs: ["Education", "Toys"],
    verified: true
  },
  {
    name: "Future Stars",
    address: "12 Andheri West",
    city: "Mumbai",
    pincode: "400058",
    needs: ["Furniture", "Electronics"],
    verified: true
  },
  {
    name: "Agartala Care Center",
    address: "89 Krishna Nagar",
    city: "Agartala",
    pincode: "799001",
    needs: ["Food", "Medicines"],
    verified: true
  },
  {
    name: "Chennai Children Home",
    address: "33 Marina Beach Road",
    city: "Chennai",
    pincode: "600001",
    needs: ["Clothes", "Books", "Food"],
    verified: true
  },
  {
    name: "Hyderabad Help Center",
    address: "10 Hi-Tech City",
    city: "Hyderabad",
    pincode: "500081",
    needs: ["School Supplies"],
    verified: true
  },
  {
    name: "Pune Shelter",
    address: "56 Pune University Road",
    city: "Pune",
    pincode: "411007",
    needs: ["Money", "Vegetables"],
    verified: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔗 Connected to MongoDB...");

    await Orphanage.deleteMany({});
    console.log("🗑️  Cleared existing orphanages...");

    await Orphanage.insertMany(sampleOrphanages);
    console.log("🌱 Seeded orphanages successfully!");

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seedDB();
