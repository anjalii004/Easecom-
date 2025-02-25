const Product = require("../../models/products");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    console.log({keyword});
    if (!keyword || typeof keyword !== "string")
      return res.status(400).json({
        success: false,
        message: "invalid key string",
      });
    const regEx = new RegExp(keyword, "i");
    const createProductQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx },
      ],
    };
    const searchResults = await Product.find(createProductQuery);
    return res
      .status(200)
      .json({
        success: true,
        message: "Results fetched successfully",
        data: searchResults,
      });
  } catch (err) {
    console.log("Error while searching the product, ", err);
    return res.status(500).json({
      success: false,
      message: "couldnt' search, error occurred!",
    });
  }
};

module.exports = {searchProducts};