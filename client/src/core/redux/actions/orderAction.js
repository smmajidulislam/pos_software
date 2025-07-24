import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [], // array of { productInfo, quantity }
  gstRate: 0.05, // default 5%
  shippingCharge: 0,
  discountValue: 0,
  discountType: "percent", // 'percent' or 'cash'
};
const posCartSlice = createSlice({
  name: "posCart",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const existing = state.products.find((p) => p._id === action.payload._id);
      if (existing) {
        return;
      } else {
        state.products.push({ ...action.payload, quantity: 1 });
      }
    },

    removeProduct: (state, action) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
    },

    clearCart: (state) => {
      state.products = [];
    },

    setGstRate: (state, action) => {
      state.gstRate = action.payload;
    },

    setShippingCharge: (state, action) => {
      state.shippingCharge = action.payload;
    },

    setDiscount: (state, action) => {
      state.discountValue = action.payload.value;
      state.discountType = action.payload.type;
    },
  },
});

export const {
  addProduct,
  removeProduct,
  incrementQty,
  decrementQty,
  clearCart,
  setGstRate,
  setShippingCharge,
  setDiscount,
} = posCartSlice.actions;

export default posCartSlice.reducer;
