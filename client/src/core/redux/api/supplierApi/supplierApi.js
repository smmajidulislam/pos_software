import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const supplierApi = createApi({
  reducerPath: "supplierApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["supllier"],
  endpoints: (builder) => ({
    getSuppliers: builder.query({
      query: ({ posId, search, filter }) => {
        const params = new URLSearchParams();
        if (posId) params.append("posId", posId);
        if (search) params.append("search", search);
        if (filter) params.append("filter", filter);

        return `/supllier?${params.toString()}`;
      },
      providesTags: ["supllier"],
    }),

    getSupplierById: builder.query({
      query: (id) => `/supllier/${id}`,
      providesTags: ["supllier"],
    }),

    createSupplier: builder.mutation({
      query: (data) => ({
        url: "/supllier",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["supllier"],
    }),

    updateSupplier: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/supllier/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["supllier"],
    }),

    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: `/supllier/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["supllier"],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi;
