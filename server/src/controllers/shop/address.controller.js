const Address = require("../../models/Address");

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;
    if (!userId || !address || !city || !pincode || !phone) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
      });
    }
    const newAddress = new Address({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });
    await newAddress.save();
    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: newAddress,
    });
  } catch (err) {
    console.log("Error while adding address", err);
    res.status(500).json({
      success: false,
      message: "Couldn't add address due to server error",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User id and address id are required",
      });
    }
    const address = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Address deleted successfully",
      data: address,
    });
  } catch (err) {
    console.log("Error while adding address", err);
    res.status(500).json({
      success: false,
      message: "Couldn't add address due to server error",
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User id and address id are required",
      });
    }
    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      formData,
      { new: true }
    );
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (err) {
    console.log("Error while adding address", err);
    res.status(500).json({
      success: false,
      message: "Couldn't add address due to server error",
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }
    const addresses = await Address.find({ userId });
    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: addresses,
    });
  } catch (err) {
    console.log("Error while fetching all addresses", err);
    res.status(500).json({
      success: false,
      message: "Couldn't fetch all addresses due to server error",
    });
  }
};

module.exports = { addAddress, deleteAddress, updateAddress, fetchAllAddress };
