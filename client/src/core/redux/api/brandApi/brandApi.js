import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    // Create
    createBrand: builder.mutation({
      query: (newBrand) => ({
        url: "brand",
        method: "POST",
        body: newBrand,
      }),
      invalidatesTags: ["Brand"],
    }),

    // Get All
    // brandApi.js
    getAllBrands: builder.query({
      query: ({ posId, brand, status, time, search, newest, oldest }) => {
        const params = new URLSearchParams();
        if (posId) params.append("posId", posId);
        if (brand) params.append("brand", brand);
        if (status) params.append("status", status);
        if (time) params.append("time", time);
        if (search) params.append("search", search);
        if (newest) params.append("sort", "desc");
        if (oldest) params.append("sort", "asc");

        return `/brands?${params.toString()}`;
      },
      providesTags: ["Brand"],
    }),

    // Get One
    getBrandById: builder.query({
      query: (id) => `brands/${id}`,
      providesTags: ["Brand"],
    }),

    // Update
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `brand/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),

    // Delete
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `brand/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useCreateBrandMutation,
  useGetAllBrandsQuery,
  useGetBrandByIdQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
