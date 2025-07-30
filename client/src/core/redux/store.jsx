import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { apiSlice } from "./api/authapi/authApi";
import { posApi } from "./api/posApi/posApi";
import { categoryApi } from "./api/categoryApi/categoryApi";
import { brandApi } from "./api/brandApi/brandApi";
import { unitApi } from "./api/unitApi/unitApi";
import { wareHouseApi } from "./api/wareHouseApi/wareHouseApi";
import { variantApi } from "./api/variantApi/variantApi";
import { productApi } from "./api/productapi/productApi";
import { supplierApi } from "./api/supplierApi/supplierApi";
import { userApi } from "./api/userApi/userApi";
import { orderApi } from "./api/orderApi/orderApi";
import { parchaceApi } from "./api/purchageApi/purchaceApi";
import { paymentApi } from "./api/paymentApi/paymentApi";
import { sellInvoiceApi } from "./api/sellsInvoice/sellInvoice";
import { homepageApi } from "./api/homepageApi/homepageApi";
import posCartReducer from "./actions/orderAction";

const store = configureStore({
  reducer: {
    ...rootReducer,
    posCart: posCartReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [posApi.reducerPath]: posApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [unitApi.reducerPath]: unitApi.reducer,
    [wareHouseApi.reducerPath]: wareHouseApi.reducer,
    [variantApi.reducerPath]: variantApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [supplierApi.reducerPath]: supplierApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [parchaceApi.reducerPath]: parchaceApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [sellInvoiceApi.reducerPath]: sellInvoiceApi.reducer,
    [homepageApi.reducerPath]: homepageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      posApi.middleware,
      categoryApi.middleware,
      brandApi.middleware,
      unitApi.middleware,
      wareHouseApi.middleware,
      variantApi.middleware,
      productApi.middleware,
      supplierApi.middleware,
      userApi.middleware,
      orderApi.middleware,
      parchaceApi.middleware,
      paymentApi.middleware,
      sellInvoiceApi.middleware,
      homepageApi.middleware
    ),
});

export default store;
