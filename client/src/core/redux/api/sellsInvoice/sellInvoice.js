import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sellInvoiceApi = createApi({
  reducerPath: "sellInvoiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getSellInvoices: builder.query({
      query: ({ pos }) => {
        return {
          url: `/or-sell-invoices?pos=${pos}`,
        };
      },
    }),
    getSellReport: builder.query({
      query: () => {
        return {
          url: `/sales-report-data`,
        };
      },
    }),
    getPuchaceReport: builder.query({
      query: () => {
        return {
          url: `/purchase-report-data`,
        };
      },
    }),
    getCustomerReport: builder.query({
      query: () => {
        return {
          url: `/customer-report-data`,
        };
      },
    }),
    getProfitAndLossReport: builder.query({
      query: () => {
        return {
          url: `/profit&loss-report-data`,
        };
      },
    }),
    getRoleAndpermission: builder.query({
      query: () => {
        return {
          url: `/role-and-permission`,
        };
      },
    }),
  }),
});

export const {
  useGetSellInvoicesQuery,
  useGetSellReportQuery,
  useGetPuchaceReportQuery,
  useGetCustomerReportQuery,
  useGetProfitAndLossReportQuery,
  useGetRoleAndpermissionQuery,
} = sellInvoiceApi;
