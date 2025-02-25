import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  isLoading: false,
};

export const add_to_cart = createAsyncThunk(
  "/cart/add_to_cart",
  async ({ userId, productId, quantity }) => {
    const response = await axios.post(
      `http://localhost:8000/api/shop/cart/add-to-cart`,
      { userId, productId, quantity }
    );
    return response.data;
  }
);

export const fetch_cart_items = createAsyncThunk(
  "/cart/fetch_cart_items",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:8000/api/shop/cart/get-cart-items/${userId}`
    );
    return response.data;
  }
);

export const edit_cart_item = createAsyncThunk(
  "/cart/edit_cart_item",
  async ({ userId, productId, quantity }) => {
    const response = await axios.put(
      `http://localhost:8000/api/shop/cart/edit-cart-item`,
      { userId, productId, quantity }
    );
    return response.data;
  }
);

export const delete_cart_item = createAsyncThunk(
  "/cart/delete_cart_item",
  async ({ userId, productId }) => {
    const response = await axios.delete(
      `http://localhost:8000/api/shop/cart/${userId}/${productId}`
    );
    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(add_to_cart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(add_to_cart.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(add_to_cart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetch_cart_items.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetch_cart_items.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetch_cart_items.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(edit_cart_item.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(edit_cart_item.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(edit_cart_item.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(delete_cart_item.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(delete_cart_item.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(delete_cart_item.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      });
  },
});

export default shoppingCartSlice.reducer;
