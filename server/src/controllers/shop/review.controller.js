const Order = require("../../models/Order");
const Product = require("../../models/products");
const Review = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, username, reviewMessage, reviewVal } = req.body;
    console.log({ productId, userId, username, reviewMessage, reviewVal });
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const newReview = new Review({
      productId,
      userId,
      username,
      reviewMessage,
      reviewVal,
    });
    await newReview.save();

    const reviews = await Review.find({ productId });
    const totalReviews = reviews.length;
    const averageReview = reviews.reduce(
      (sum, review) => sum + review.reviewVal / totalReviews
    );

    await Product.findByIdAndUpdate(productId, { averageReview });
    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: newReview,
    });
  } catch (err) {
    console.log("Couldn't add product review", err);
    return res.status(500).json({
      success: false,
      message: "Error while adding product review",
    });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId });
    if (!reviews)
      return res.status(500).json({
        success: false,
        message: "No reviews found",
      });
    console.log({reviews});
    
    return res.status(201).json({
      success: true,
      message: "Successfully fetched all reviews",
      data: reviews,
    });
  } catch (err) {
    console.log("Cannot fetch all the reviews, ", err);
    return res.status(500).json({
      success: false,
      message: "Couldn't get the comments",
    });
  }
};

module.exports = { addProductReview, getAllReviews };
