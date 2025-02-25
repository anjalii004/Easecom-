const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    productId: String,
    userId: String,
    username: String,
    reviewMessage: String,
    reviewVal: Number,
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;