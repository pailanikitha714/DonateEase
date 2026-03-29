const mongoose = require("mongoose");

const itemDonationSchema = new mongoose.Schema({
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

    itemType: {
        type: String,
        enum: ["clothes", "food", "books"],
        required: true
    },

    pickupAddress: {
        type: String,
        required: true
    },

    pickupDate: {
        type: Date, 
        required: true
    },
    
    timeSlot: {
        type: String, 
        required: true
    },

    deliveryStatus: {
        type: String,
        enum: ["PENDING", "PICKED_UP", "DELIVERED"],
        default: "PENDING",
    },

}, {timestamps: true});

module.exports = mongoose.model("ItemDonation", itemDonationSchema);