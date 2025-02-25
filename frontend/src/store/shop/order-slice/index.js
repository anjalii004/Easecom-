import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

export const create_new_order = createAsyncThunk(
  "/order/create_new_order",
  async (orderData) => {
    const response = await axios.post(
      "http://localhost:8000/api/shop/order/create-order",
      orderData
    );
    return response.data;
  }
);

export const capture_order = createAsyncThunk(
  "/order/capture_order",
  async ({ paymentId, payerId, orderId }) => {
    const response = await axios.post(
      "http://localhost:8000/api/shop/order/capture-order",
      { paymentId, payerId, orderId }
    );
    return response.data;
  }
);

export const get_all_orders = createAsyncThunk(
  "/order/get_all_orders",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:8000/api/shop/order/order-list/${userId}`
    );

    return response.data;
  }
);

export const get_order_details = createAsyncThunk(
  "/order/get_order_details",
  async (id) => {
    const response = await axios.get(
      `http://localhost:8000/api/shop/order/order-details/${id}`
    );
    return response.data;
  }
);

export const update_order_status_for_user = createAsyncThunk(
  "/order/update_order_status_for_user",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `http://localhost:8000/api/shop/order/update-order-details/${id}`,
      { orderStatus }
    );
    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(create_new_order.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(create_new_order.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(create_new_order.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(get_all_orders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(get_all_orders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(get_all_orders.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(get_order_details.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(get_order_details.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(get_order_details.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;
