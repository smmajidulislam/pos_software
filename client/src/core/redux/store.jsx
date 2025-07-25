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
      orderApi.middleware
    ),
});

export default store;
