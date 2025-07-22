import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const unitApi = createApi({
  reducerPath: "unitApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Unit"],
  endpoints: (builder) => ({
    createUnit: builder.mutation({
      query: (newUnit) => ({
        url: "/unit", // তোমার backend API route
        method: "POST",
        body: newUnit,
      }),
      invalidatesTags: ["Unit"], // Unit তালিকা আপডেটের জন্য ট্যাগ ইনভ্যালিডেট করে
    }),

    getUnits: builder.query({
      query: ({ posId, unitName, status, time, search, newest, oldest }) => {
        const params = new URLSearchParams();
        if (posId) params.append("posId", posId);
        if (unitName) params.append("unitName", unitName);
        if (status) params.append("status", status);
        if (time) params.append("time", time);
        if (search) params.append("search", search);
        if (newest) params.append("sort", "desc");
        if (oldest) params.append("sort", "asc");

        return `/units?${params.toString()}`;
      },
      providesTags: ["Unit"],
    }),

    getUnitById: builder.query({
      query: (id) => `/units/${id}`,
      providesTags: ["Unit"],
    }),

    updateUnit: builder.mutation({
      query: ({ id, data }) => ({
        url: `/unit/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Unit"],
    }),

    deleteUnit: builder.mutation({
      query: (id) => ({
        url: `/unit/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Unit"],
    }),
  }),
});

export const {
  useCreateUnitMutation,
  useGetUnitsQuery,
  useGetUnitByIdQuery,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitApi;
