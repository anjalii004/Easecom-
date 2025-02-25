import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const add_new_review = createAsyncThunk(
  "/order/add_new_review",
  async ({productId, userId, username, reviewMessage, reviewVal}) => {
    const response = await axios.post(
      "http://localhost:8000/api/shop/reviews/add-new-review",
      { productId, userId, username, reviewMessage, reviewVal }
    );
    console.log({response});
    return response.data;
  }
);

export const get_all_review = createAsyncThunk(
  "/order/get_all_review",
  async (id) => {
    const response = await axios.get(
      `http://localhost:8000/api/shop/reviews/get-reviews/${id}`
    );
    return response.data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(get_all_review.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(get_all_review.fulfilled, (state, action) => {
        console.log(action, "action");     
        state.isLoading = false;
        state.reviews = action.payload.data || [];
      })
      .addCase(get_all_review.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
