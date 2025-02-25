const Product = require("../../models/products");
const Wishlist = require("../../models/Wishlist");

const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId)
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    let wish = await Wishlist.findOne({ userId });
    if (!wish) wish = new Wishlist({ userId, items: [] });

    wish.items.push({ productId });
    await wish.save();

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist successfully",
    });
  } catch (err) {
    console.log("Error while adding the product to wishlist ", err);
    return res.json({
      success: false,
      message: "Couldn't add the product to wishlist",
    });
  }
};

const fetchAllWishes = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    const wish = await Wishlist.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });
    if (!wish)
      return res
        .status(404)
        .json({ success: false, message: "No saved products found" });

    const validItems = wish.items.filter(
      (productItems) => productItems.productId
    );
    if (validItems.length < wish.items.length) {
      wish.items = validItems;
      await wish.save();
    }
    const populateWishedItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
    }));

    return res.status(200).json({
      success: true,
      message: "fetched wishlist items successfully",
      data: { ...wish._doc, items: populateWishedItems },
    });
  } catch (err) {
    console.log("Error while fetching all wishes ", err);
    return res.json({
      success: false,
      message: "Couldn't fetch all wishes",
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    console.log({ userId, productId });
    
    if (!userId || !productId)
      return res
        .status(400)
        .json({ success: false, message: "Invalid data provided" });

    const wish = await Wishlist.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice category",
    });

    if (!wish)
      return res
        .status(404)
        .json({
          success: false,
          message: "Product doesn't exists in wishlist",
        });

    wish.items = wish.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    console.log("WishItems = ", wish.items);

    await wish.save();
    await wish.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });
    const populateWishedItems = wish.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : null,
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
    }));

    return res.status(200).json({
      success: true,
      message: "fetched wishlist items successfully",
      data: { ...wish._doc, items: populateWishedItems },
    });
  } catch (err) {
    console.log("Error occured while removing the item, ", err);
    return res.json({
      success: false,
      message: "Couldn't remove item from wishlist",
    });
  }
};

module.exports = { addToWishlist, fetchAllWishes, removeFromWishlist };
