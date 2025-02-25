const express = require("express");
const { fetchAllAddress, addAddress, deleteAddress, updateAddress } = require("../../controllers/shop/address.controller");
const router = express.Router();

router.get("/get-all-addresses/:userId", fetchAllAddress);
router.post("/add-address", addAddress);
router.delete("/delete-address/:userId/:addressId", deleteAddress);
router.put("/update-address/:userId/:addressId", updateAddress);

module.exports = router;