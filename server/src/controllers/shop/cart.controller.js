const Cart = require("../../models/Cart");
const Product = require("../../models/products");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    console.log({ userId, productId, quantity });

    if (!userId || !productId || !quantity || quantity <= 0 || isNaN(quantity))
      return res
        .status(400)
        .json({ success: false, message: "Invalid data provided" });

    const prod = await Product.findById(productId);
    if (!prod)
      return res
        .status(404)
        .json({ success: false, message: "No such product found..." });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();
    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cart,
    });
  } catch (err) {
    console.error("Couldn't add item to cart:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Error while adding item to the cart",
    });
  }
};


const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res.status(404).json({ success: false, message: "No user found" });

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "No cart product found..." });

    const validItems = cart.items.filter((prodItems) => prodItems.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      success: true,
      message: "fetched cart items successfully",
      data: { ...cart._doc, items: populateCartItems },
    });
  } catch (err) {
    console.log("Couldn't fetch items to cart");
    res.json({
      success: false,
      message: "Error while fetching items of cart",
    });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity <= 0)
      return res
        .status(400)
        .json({ success: false, message: "Invalid data provided" });

    let cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
        
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (!findCurrentProductIndex)
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : null,
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      success: true,
      message: "fetched cart items successfully",
      data: { ...cart._doc, items: populateCartItems },
    });
  } catch (err) {
    console.log("Couldn't update item of cart");
    res.json({
      success: false,
      message: "Error while updating item to the cart",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId)
      return res
        .status(400)
        .json({ success: false, message: "Invalid data provided" });

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice category",
    });

    console.log("cart item = ", cart);

    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "No cart product found..." });

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : null,
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (err) {
    console.log("Couldn't delete item from cart ", err);
    res.json({
      success: false,
      message: "Error while deleting item from the cart",
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQuantity,
  deleteCartItem,
};
