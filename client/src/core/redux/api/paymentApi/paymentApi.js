import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    // 🔹 Create Payment
    createPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payments",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payment"],
    }),

    // 🔹 Read All Payments
    getAllPayments: builder.query({
      query: ({ orderId }) => {
        let query = {};
        if (orderId) query.orderId = orderId;
        const queryString = new URLSearchParams(query).toString();
        return `/payments${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Payment"],
    }),

    // 🔹 Read Single Payment
    getPaymentById: builder.query({
      query: (id) => `/payments/${id}`,
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    // 🔹 Update Payment
    updatePayment: builder.mutation({
      query: ({ id, ...paymentData }) => ({
        url: `/payments/${id}`,
        method: "PUT",
        body: paymentData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Payment", id },
        { type: "Payment" },
      ],
    }),

    // 🔹 Delete Payment
    deletePayment: builder.mutation({
      query: (id) => ({
        url: `/payments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = paymentApi;
