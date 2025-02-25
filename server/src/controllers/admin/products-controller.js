const Product = require("../../models/products");
const { imageUploadUtil } = require("../../utils/cloudinary");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);
    return res.json({ result, success: true });
  } catch (err) {
    console.log("Error in Uploading the image to Cloudinary", err);
    res
      .json({
        success: false,
        message: "Error while uploading image to cloudinary",
      })
      .status(400);
  }
};

// add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });
    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (err) {
    console.log("Error while adding a new product, ", err);
    res.status(500).json({
      success: false,
      data: newlyCreatedProduct,
      message: "Couldn't add new Product",
    });
  }
};

// fetch all product
const fetchAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    // console.log(allProducts);
    res.status(200).json({
      success: true,
      data: allProducts,
    });
  } catch (err) {
    console.log("Error while fetching all products, ", err);
    res.status(500).json({
      success: false,
      message: "Couldn't fetch all Products",
    });
  }
};

// edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const product = await Product.findById(id);
    if (!product)
      res.status(201).json({
        success: false,
        message: "No product found!!",
      });

    product.image = image || product.image;
    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.price = price || product.price;
    product.salePrice = salePrice || product.salePrice;
    product.totalStock = totalStock || product.totalStock;

    await product.save();
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (err) {
    console.log("Error while editing the product, ", err);
    res.status(500).json({
      success: false,
      message: "Couldn't edit the Product",
    });
  }
};

// delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log({id});
    const product = await Product.findByIdAndDelete(id);
    if (!product) res.status(404).json({ success: false, message: "Product not found" });
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.log("Error while deleting the product, ", err);
    res.status(500).json({
      success: false,
      message: "Couldn't delete the Product",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
