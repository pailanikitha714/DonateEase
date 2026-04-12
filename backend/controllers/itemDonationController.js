const ItemDonation = require("../models/itemDonation");

const donateItem = async (req, res) => {
    try {
        if (req.user.role !== "user") {
          return res.status(403).json({ message: "Only users can donate" });
        }
        const {orphanageId, itemType, pickupAddress, pickupDate, timeSlot} = req.body;
        if(!orphanageId || !itemType || !pickupAddress)
        {
            return res.status(400).json({message: "All fields are required"});
        }
        const donation = await ItemDonation.create({
            user: req.user.id,
            orphanage: orphanageId,
            itemType,
            pickupAddress,
            pickupDate,
            timeSlot,
            deliveryStatus: "PENDING",
        });
        res.status(201).json({
            message: "Item donation created successfully",
            donation
        });
    } 
    catch(error) {
        res.status(500).json({message: error.message});
    }
};

const getMyItemDonations = async (req, res) => {
  try {
    const donations = await ItemDonation.find({ user: req.user.id })
      .populate("orphanage", "name address");
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllItemDonations = async (req, res) => {
  try {
    const donations = await ItemDonation.find()
      .populate("user", "name email")
      .populate("orphanage", "name")
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error("Error fetching all item donations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateDeliveryStatus = async (req, res) => {
    try {
        const {status} = req.body;
        const donation = await ItemDonation.findById(req.params.id);
        if(!donation)
        {
            return res.status(401).json({message: "Donation not found"});
        }
        donation.deliveryStatus = status;
        await donation.save();
        res.status(200).json({
            message: "Delivery status updated",
            donation
        });
    }
    catch(error)
    {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
  donateItem,
  getMyItemDonations,
  getAllItemDonations,
  updateDeliveryStatus
};
