const express = require("express");
const router = express.Router();
const {
  addToCart,
  fetchCartItems,
  updateCartItemQuantity,
  deleteCartItem,
} = require("../../controllers/shop/cart.controller");

router.post("/add-to-cart", addToCart);
router.get("/get-cart-items/:userId", fetchCartItems);
router.put("/edit-cart-item", updateCartItemQuantity);
router.delete("/:userId/:productId", deleteCartItem);

module.exports = router;