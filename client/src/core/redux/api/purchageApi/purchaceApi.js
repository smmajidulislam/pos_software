import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const parchaceApi = createApi({
  reducerPath: "parchaceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Parchace"],

  endpoints: (builder) => ({
    createParchace: builder.mutation({
      query: (data) => ({
        url: "/product/purchace",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Parchace"],
    }),
    getAllParchace: builder.query({
      query: ({ pos }) => {
        if (pos) return `/product/purchace?pos=${pos}`;
        return "";
      },
    }),
    getPurchaseReportFOrPurchaseSection: builder.query({
      query: () => ({
        url: "/purchase-report",
      }),
    }),
    getParchaseRetrun: builder.query({
      query: (refarnce) => ({
        url: `/purchase-return-data?reference=${refarnce}`,
      }),
      invalidatesTags: ["Parchace"],
    }),
    createPurchaseReturn: builder.mutation({
      query: (data) => ({
        url: "/purchase-return-create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Parchace"],
    }),
    getAllPurchaseReturns: builder.query({
      query: () => ({
        url: "purchase-all-return",
      }),
    }),
  }),
});

export const {
  useCreateParchaceMutation,
  useGetAllParchaceQuery,
  useGetPurchaseReportFOrPurchaseSectionQuery,
  useGetParchaseRetrunQuery,
  useCreatePurchaseReturnMutation,
  useGetAllPurchaseReturnsQuery,
} = parchaceApi;
