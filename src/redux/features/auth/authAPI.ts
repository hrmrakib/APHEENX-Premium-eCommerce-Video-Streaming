/* eslint-disable @typescript-eslint/no-explicit-any */
import { setUser } from "./authSlice";
import baseAPI from "@/redux/api/api";

const authAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: credentials,
      }),

      // Transform the response to return only the 'data' object
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

    getMe: builder.query({
      query: () => "/auth/me",

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

    changePassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/change-password/",
        method: "POST",
        body: payload,
      }),
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
  useChangePasswordMutation,
} = authAPI;
export default authAPI;
