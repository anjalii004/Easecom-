import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  wishlist: [],
};

export const add_to_wishlist = createAsyncThunk(
  "/wishlist/add_to_wishlist",
  async ({ userId, productId }) => {
    const response = await axios.post(
      `http://localhost:8000/api/shop/wishlist/add-to-wishlist`,
      { userId, productId }
    );
    return response.data;
  }
);

export const fetch_wishlist_items = createAsyncThunk(
  "/wishlist/fetch_wishlist_items",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:8000/api/shop/wishlist/fetch-wishlist-items/${userId}`
    );
    return response.data;
  }
);

export const delete_wishlist_items = createAsyncThunk(
  "/wishlist/delete_wishlist_items",
  async ({ userId, productId }) => {
    console.log({ userId, productId });

    const response = await axios.delete(
      `http://localhost:8000/api/shop/wishlist/delete-wishlist-item/${userId}/${productId}`
    );
    return response.data;
  }
);

const wishlistSlice = createSlice({
  name: "wishlistSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetch_wishlist_items.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetch_wishlist_items.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlist = action.payload.data;
      })
      .addCase(fetch_wishlist_items.rejected, (state) => {
        state.isLoading = false;
        state.wishlist = [];
      })
      .addCase(delete_wishlist_items.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlist = action.payload.data;
      })
      .addCase(delete_wishlist_items.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(delete_wishlist_items.rejected, (state) => {
        state.isLoading = false;
        state.wishlist = [];
      });
  },
});

export default wishlistSlice.reducer;
