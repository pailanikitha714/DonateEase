const mongoose = require("mongoose");

const orphanageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    pincode: {
        type: String,
        required: true
    },

    needs: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model("Orphanage",orphanageSchema);