import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const posApi = createApi({
  reducerPath: "posApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Pos"],

  endpoints: (builder) => ({
    // ✅ Create POS
    createPos: builder.mutation({
      query: (data) => ({
        url: "/pos",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pos"],
    }),

    // ✅ Get All POS (with optional query)
    getAllPos: builder.query({
      query: (params) => {
        const query = new URLSearchParams(params).toString();
        return {
          url: `/pos${query ? `?${query}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Pos"],
    }),

    // ✅ Get Single POS by ID
    getPosById: builder.query({
      query: (id) => ({
        url: `/pos/${id}`,
        method: "GET",
      }),
      providesTags: ["Pos"],
    }),

    // ✅ Update POS by ID
    updatePos: builder.mutation({
      query: ({ id, data }) => ({
        url: `/pos/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Pos"],
    }),

    // ✅ Delete POS by ID
    deletePos: builder.mutation({
      query: (id) => ({
        url: `/pos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pos"],
    }),
  }),
});

export const {
  useCreatePosMutation,
  useGetAllPosQuery,
  useGetPosByIdQuery,
  useUpdatePosMutation,
  useDeletePosMutation,
} = posApi;
