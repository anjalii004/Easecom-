const Order = require("../../models/Order");

const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({});
    if (!orders.length)
      return res.status(200).json({
        success: false,
        message: "No orders found for this account",
      });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.log("Error occured while fetching all Orders, ", err);
    res.status(500).json({
      success: false,
      message: "couldn't fetch the orders, please try again later",
    });
  }
};

const getOrderDeatilsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.log("Error while getting the order details, ", err);
    res.status(500).json({
      success: false,
      message: "couldn't get the order details",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {orderStatus} = req.body;

    console.log({id, orderStatus});
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order exists",
      });
    }

    await Order.findByIdAndUpdate(id, { orderStatus });
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (err) {
    console.log("Error in updating the order status, ", err);
    return res.status(500).json({
      success: false,
      message: "Couldnt update the order status",
    });
  }
};
module.exports = { getAllOrdersForAdmin, getOrderDeatilsForAdmin, updateOrderStatus };
