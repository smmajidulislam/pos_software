import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const wareHouseApi = createApi({
  reducerPath: "wareHouseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["WareHouse"],
  endpoints: (builder) => ({
    // 🔹 Create
    createWareHouse: builder.mutation({
      query: (newData) => ({
        url: "/warehouse",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["WareHouse"],
    }),

    // 🔹 Read - All
    getWareHouses: builder.query({
      query: (posId) => ({
        url: `/warehouse?pos=${posId}`,
      }),
      providesTags: ["WareHouse"],
    }),

    // 🔹 Read - One
    getWareHouseById: builder.query({
      query: (id) => `/warehouse/${id}`,
      providesTags: (result, error, id) => [{ type: "WareHouse", id }],
    }),

    // 🔹 Update
    updateWareHouse: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/warehouse/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "WareHouse", id }],
    }),

    // 🔹 Delete
    deleteWareHouse: builder.mutation({
      query: (id) => ({
        url: `/warehouse/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WareHouse"],
    }),
  }),
});

export const {
  useCreateWareHouseMutation,
  useGetWareHousesQuery,
  useGetWareHouseByIdQuery,
  useUpdateWareHouseMutation,
  useDeleteWareHouseMutation,
} = wareHouseApi;
