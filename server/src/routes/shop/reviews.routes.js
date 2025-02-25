const express = require("express");
const {
  addProductReview,
  getAllReviews,
} = require("../../controllers/shop/review.controller");
const router = express.Router();

router.post("/add-new-review", addProductReview);
router.get("/get-reviews/:productId", getAllReviews);

module.exports = router;
