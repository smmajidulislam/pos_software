import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const homepageApi = createApi({
  reducerPath: "homepageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Homepage"],
  endpoints: (builder) => ({
    getHomepage: builder.query({
      query: () => {
        return {
          url: `/dashbord-data`,
        };
      },
    }),
  }),
});

export const { useGetHomepageQuery } = homepageApi;
