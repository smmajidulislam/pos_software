// src/redux/api/categoryApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}`,
    credentials: "include",
  }),

  tagTypes: ["Category"],

  endpoints: (builder) => ({
    // 🔵 CREATE Category
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // 🔵 READ Category (dynamic: main, sub, sub-sub)
    getCategories: builder.query({
      query: ({
        type,
        pos,
        category,
        status,
        date,
        search,
        oldest,
        newest,
        parent,
      }) => {
        let query = `type=${type}&pos=${pos}`;
        if (parent) query += `&parent=${parent}`;
        if (category) query += `&category=${category}`;
        if (status) query += `&status=${status}`;
        if (date) query += `&date=${date}`;
        if (search) query += `&search=${search}`;
        if (oldest) query += `&sort=asc`;
        if (newest) query += `&sort=desc`;
        return `/categories?${query}`;
      },
      providesTags: ["Category"],
    }),

    // 🔵 READ Single Category by ID
    getCategoryById: builder.query({
      query: (id) => `/category/${id}`,
    }),

    // 🔵 UPDATE Category
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categorie/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // 🔵 DELETE Category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categorie/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
