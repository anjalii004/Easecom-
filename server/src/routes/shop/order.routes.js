const express = require("express");
const {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDeatils,
  updateOrderStatusForUser,
} = require("../../controllers/shop/order.controller");

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/capture-order", capturePayment);
router.get("/order-list/:userId", getAllOrdersByUser);
router.get("/order-details/:id", getOrderDeatils);
router.put("/update-order-details/:id", updateOrderStatusForUser);
module.exports = router;