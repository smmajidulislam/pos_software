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
  }),
});

export const { useGetSellInvoicesQuery } = sellInvoiceApi;
