// src/redux/api/variantApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const variantApi = createApi({
  reducerPath: "variantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Variant"],
  endpoints: (builder) => ({
    // Create Variant
    createVariant: builder.mutation({
      query: (variantData) => ({
        url: "variants",
        method: "POST",
        body: variantData,
      }),
      invalidatesTags: ["Variant"],
    }),

    // Get All Variants
    getVariants: builder.query({
      query: ({ search = "", status = "", date = "", sort = "", pos = "" }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (date) params.append("date", date);
        if (sort) params.append("sort", sort);
        if (pos) params.append("pos", pos);

        return `variants?${params.toString()}`;
      },
      providesTags: ["Variant"],
    }),

    // Get Single Variant
    getVariantById: builder.query({
      query: (id) => `variants/${id}`,
      providesTags: (result, error, id) => [{ type: "Variant", id }],
    }),

    // Update Variant
    updateVariant: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `variants/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Variant"],
    }),

    // Delete Variant
    deleteVariant: builder.mutation({
      query: (id) => ({
        url: `variants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Variant"],
    }),
  }),
});

export const {
  useCreateVariantMutation,
  useGetVariantsQuery,
  useGetVariantByIdQuery,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
} = variantApi;
