const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = new express();
const authRouter = require("../src/routes/auth/auth.route");
const adminProductRouter = require("../src/routes/admin/products.route");
const adminOrderRouter = require("../src/routes/admin/order.routes");
const shopProductRouter = require("../src/routes/shop/products.routes");
const shopCartRouter = require("../src/routes/shop/cart.routes");
const shopAddressRouter = require("../src/routes/shop/address.routes");
const shopOrderRouter = require("../src/routes/shop/order.routes");
const shopReviewRouter = require("../src/routes/shop/reviews.routes");
const shopSearchRouter = require("../src/routes/shop/search.routes");
const shopWishlistRouter = require("../src/routes/shop/wishlist.routes");
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env",
});


//middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// routes
app.use("/api/auth", authRouter);

app.use("/api/admin/products", adminProductRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/reviews", shopReviewRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/wishlist", shopWishlistRouter);

module.exports = app;