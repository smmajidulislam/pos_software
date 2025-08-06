import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userProfileApi = createApi({
  reducerPath: "adminProfile",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["UserProfile"],
  endpoints: (builder) => ({
    // 🔹 Create or Update Profile (POST)
    upsertUserProfile: builder.mutation({
      query: (profileData) => ({
        url: "/users-profile",
        method: "POST",
        body: profileData,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    // 🔹 Get User Profile by Email (GET)
    getUserProfile: builder.query({
      query: (email) => `/users-profile?email=${email}`, // নিচে note দেখুন!
      providesTags: ["UserProfile"],
    }),
  }),
});

export const { useUpsertUserProfileMutation, useGetUserProfileQuery } =
  userProfileApi;
