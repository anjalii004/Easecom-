import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
};

export const get_all_orders_for_admin = createAsyncThunk(
  "/order/get_all_orders_for_admin",
  async () => {
    const response = await axios.get(
      `http://localhost:8000/api/admin/orders/order-list`
    );
    console.log("Response = ", response);

    return response.data;
  }
);

export const get_order_details_for_admin = createAsyncThunk(
  "/order/get_order_details_for_admin",
  async (id) => {
    const response = await axios.get(
      `http://localhost:8000/api/admin/orders/order-details/${id}`
    );
    return response.data;
  }
);

export const update_order_details = createAsyncThunk(
  "update_order_details",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `http://localhost:8000/api/admin/orders/update-order-details/${id}`,
      { orderStatus }
    );
    return response.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    resetOrderDetailsForAdmin: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_all_orders_for_admin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(get_all_orders_for_admin.fulfilled, (state, action) => {
        console.log("Action: ", action);

        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(get_all_orders_for_admin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(get_order_details_for_admin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(get_order_details_for_admin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(get_order_details_for_admin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetailsForAdmin } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
