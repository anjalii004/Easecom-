const express = require("express");
const { getOrderDeatilsForAdmin, getAllOrdersForAdmin, updateOrderStatus } = require("../../controllers/admin/order-controller");

const router = express.Router();
router.get("/order-list", getAllOrdersForAdmin);
router.get("/order-details/:id", getOrderDeatilsForAdmin);
router.put("/update-order-details/:id", updateOrderStatus);
module.exports = router;