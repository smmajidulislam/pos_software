import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // ✅ Create Order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/order",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),
    getOrders: builder.query({
      query: ({
        customer = null,
        status = null,
        reference = "",
        paymentStatus = null,
        search = "",
        sort = null,
        posId,
      } = {}) => {
        const params = new URLSearchParams();

        if (customer) params.append("customer", customer);
        if (status) params.append("status", status);
        if (reference) params.append("reference", reference);
        if (paymentStatus) params.append("paymentStatus", paymentStatus);
        if (search) params.append("search", search);
        if (sort) params.append("sort", sort);
        if (posId) params.append("posId", posId);

        const queryString = params.toString();

        return `/order${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Order"],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useDeleteOrderMutation,
} = orderApi;
