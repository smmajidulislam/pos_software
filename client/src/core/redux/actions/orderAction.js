import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [], // product list
  taxRate: 5, // in percent
  shipping: 15, // flat rate
  discountType: "percent", // or "cash"
  discountValue: 10, // 10% or 500 taka
};

const orderSlice = createSlice({
  name: "orderAction",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const product = action.payload;
      const existing = state.products.find((item) => item._id === product._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.products.push({ ...product, quantity: 1 });
      }
    },

    removeProduct: (state, action) => {
      const productId = action.payload;
      state.products = state.products.filter((item) => item._id !== productId);
    },

    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const item = state.products.find((p) => p._id === _id);
      if (item) item.quantity = quantity;
    },

    clearProducts: (state) => {
      state.products = [];
    },

    setTaxRate: (state, action) => {
      state.taxRate = action.payload;
    },

    setShipping: (state, action) => {
      state.shipping = action.payload;
    },

    setDiscount: (state, action) => {
      const { type, value } = action.payload;
      state.discountType = type;
      state.discountValue = value;
    },
  },
});

export const {
  addProduct,
  removeProduct,
  updateQuantity,
  clearProducts,
  setTaxRate,
  setShipping,
  setDiscount,
} = orderSlice.actions;

export default orderSlice.reducer;

// Selector to calculate totals
export const selectOrderSummary = (state) => {
  const { products, taxRate, shipping, discountType, discountValue } =
    state.order;

  const subTotal = products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = (taxRate / 100) * subTotal;

  let discount = 0;
  if (discountType === "percent") {
    discount = (discountValue / 100) * subTotal;
  } else if (discountType === "cash") {
    discount = discountValue;
  }

  const total = subTotal + tax + shipping - discount;

  return {
    subTotal,
    tax,
    shipping,
    discount,
    total,
  };
};
