const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/products");
const paypal = require("../../utils/paypal");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log("Error in proceeding the payment = ", error);
        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
        });
      } else {
        const newOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });
        await newOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(200).json({
          success: true,
          approvalURL,
          orderId: newOrder._id,
        });
      }
    });
  } catch (err) {
    console.log("Error occured while placing the order, ", err);
    res.status(500).json({
      success: false,
      message: "Couldn't place the order, please try again later",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({
        success: false,
        message: "The order you are looking for doesn't exists",
      });
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });

      product.totalStock -= item.quantity;
      await product.save();
    }

    const getCartId = order.cartId;
    const cart = await Cart.findByIdAndDelete(getCartId);

    await order.save();
    res.status(200).json({
      success: true,
      message: "Congrats!! Order confirmed",
      data: order,
    });
  } catch (err) {
    console.log("Error occured while placing the order payment, ", err);
    res.status(500).json({
      success: false,
      message: "couldn't PAY the order, please try again later",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId });
    if (!orders.length)
      return res.status(200).json({
        success: false,
        message: "No orders found for this account",
      });

    return res.status(200).json({
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

const getOrderDeatils = async (req, res) => {
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

const updateOrderStatusForUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order not found",
      });
    }

    await Order.findByIdAndUpdate(id, { orderStatus });
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (err) {
    console.log("Error while cancelling the order", err);
    return res.status(500).json({
      success: false,
      message: "couldn't cancel the order",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDeatils,
  updateOrderStatusForUser,
};
