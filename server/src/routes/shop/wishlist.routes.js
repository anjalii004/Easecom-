const express = require("express");
const {
  addToWishlist,
  fetchAllWishes,
  removeFromWishlist,
} = require("../../controllers/shop/wishlist.controller");
const router = express.Router();

router.post("/add-to-wishlist", addToWishlist);
router.get("/fetch-wishlist-items/:userId", fetchAllWishes);
router.delete("/delete-wishlist-item/:userId/:productId", removeFromWishlist);

module.exports = router;
