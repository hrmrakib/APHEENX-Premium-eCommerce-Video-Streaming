import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function useAuth() {
  // Select the auth slice directly for cleaner access
  const { user, token, profileLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  return {
    user,
    token,
    profileLoading,
    /**
     * isLoggedIn is true only if we have both a user object and a valid token.
     * This prevents false positives if the state isn't cleared properly.
     */
    isLoggedIn: !!user && !!token,
    /**
     * Helper to check if the user is authenticated but hasn't verified their email yet.
     * Useful for triggering the useResendVerificationEmailMutation.
     */
    isVerified: user?.is_email_verified ?? false,
    /**
     * Quick role check helper
     */
    isAdmin: user?.role === "admin",
  };
}
