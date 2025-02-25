const express = require("express");
const {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct
} = require("../../controllers/admin/products-controller");
const { upload } = require("../../utils/cloudinary");

const router = express.Router();
router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add-product", addProduct);
router.get("/fetch-all-product", fetchAllProducts);
router.put("/edit-product/:id", editProduct);
router.post("/delete-product/:id", deleteProduct);

module.exports = router;
