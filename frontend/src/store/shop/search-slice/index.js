import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  results: [],
  isLoading: false,
};

export const get_search_results = createAsyncThunk(
  "/search/get_search_results",
  async (keyword) => {
    const response = await axios.get(
      `http://localhost:8000/api/shop/search/${keyword}`
    );
    return response.data;
  }
);

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(get_search_results.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(get_search_results.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.data;
      })
      .addCase(get_search_results.rejected, (state) => {
        state.isLoading = false;
        state.results = [];
      });
  },
});

export default searchSlice.reducer;