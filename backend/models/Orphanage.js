const mongoose = require("mongoose");

const orphanageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    
    name: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    pincode: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    needs: {
        type: [String],
        default: []
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

    verified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Orphanage",orphanageSchema);