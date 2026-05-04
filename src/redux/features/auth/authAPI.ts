/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setUser } from "./authSlice";

// --- Types ---
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  is_email_verified: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

export interface AuthData {
  access: string;
  user: UserProfile;
}

export type AuthResponse = ApiResponse<AuthData>;

// --- API Slice ---
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage?.getItem("access_token");

        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthData, any>({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: credentials,
      }),
      // Transform the response to return only the 'data' object
      transformResponse: (response: AuthResponse) => response.data,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setUser({ user: data.user, token: data.access }));
        } catch (err) {
          console.error("Login failed", err);
        }
      },
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<{ message: string }, any>({
      query: (payload) => ({
        url: "/auth/register/",
        method: "POST",
        body: payload,
      }),
    }),

    verifyEmail: builder.mutation<
      { message: string },
      { email: string; otp: string }
    >({
      query: (payload) => ({
        url: "/auth/verify-email/",
        method: "POST",
        body: payload,
      }),
    }),

    resendOtp: builder.mutation<any, { email: string; purpose: string }>({
      query: (body) => ({
        url: "/auth/resend-otp/",
        method: "POST",
        body,
      }),
    }),

    getMe: builder.query<UserProfile, void>({
      query: () => "/auth/me",
      transformResponse: (response: ApiResponse<UserProfile>) => response.data,
      providesTags: ["User"],
    }),

    // 6. LOGOUT
    logout: builder.mutation<{ detail: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          //   dispatch(logout());
        } catch {
          console.error("Logout failed");
        }
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
