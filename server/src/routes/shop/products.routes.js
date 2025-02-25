const express = require("express");
const { getFilteredProducts, getProductDetails } = require("../../controllers/shop/products.controller");
const router = express.Router();

router.get("/get-filtered-products", getFilteredProducts);
router.get("/get-filtered-products/:id", getProductDetails);

module.exports = router;