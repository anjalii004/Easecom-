import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/product-slice";
import adminOrderSlice from "./admin/order-slice";
import shoppingProductSlice from "./shop/product-slice";
import shoppingCartSlice from "./shop/cart-slice";
import shoppingAddressSlice from "./shop/address-slice";
import shoppingOrderSlice from "./shop/order-slice";
import shoppingReviewSlice from "./shop/review-slice";
import shoppingSearchSlice from "./shop/search-slice";
import shoppingWishlistSlice from "./shop/wishlist-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProducts: adminProductsSlice,
    adminOrders: adminOrderSlice,
    
    shopProducts: shoppingProductSlice,
    shopCart: shoppingCartSlice,
    shopAddress: shoppingAddressSlice,
    shopOrder: shoppingOrderSlice,
    shopReview: shoppingReviewSlice,
    shopSearch: shoppingSearchSlice,
    shopWishlist: shoppingWishlistSlice,
  },
});

export default store;