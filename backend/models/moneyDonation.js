const mongoose = require("mongoose");
const Orphanage = require("./Orphanage");

const moneyDonationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    orphanage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orphanage",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },
    
    status: {
        type: String
    },

    paymentMethod: {
        type: String,
        enum: ["UPI","Card","NetBanking"],
        required: true
    }, 
}, {timestamps: true});

module.exports = mongoose.model("MoneyDonation", moneyDonationSchema);