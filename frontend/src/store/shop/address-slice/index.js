import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};

export const add_new_address = createAsyncThunk(
  "/address/add_new_address",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:8000/api/shop/address/add-address",
      formData
    );
    return response.data;
  }
);

export const fetch_all_addresses = createAsyncThunk(
  "/address/fetch_all_addresses",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:8000/api/shop/address/get-all-addresses/${userId}`
    );
    return response.data;
  }
);

export const edit_address = createAsyncThunk(
  "/address/edit_address",
  async ({ userId, addressId, formData }) => {
    const response = await axios.put(
      `http://localhost:8000/api/shop/address/update-address/${userId}/${addressId}`,
      formData
    );
    return response.data;
  }
);

export const delete_address = createAsyncThunk(
  "/address/delete_address",
  async ({ userId, addressId }) => {
    const response = await axios.delete(
      `http://localhost:8000/api/shop/address/delete-address/${userId}/${addressId}`
    );
    return response.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(add_new_address.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(add_new_address.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(add_new_address.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      })
      .addCase(fetch_all_addresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetch_all_addresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetch_all_addresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});


export default addressSlice.reducer;