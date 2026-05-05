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

    isLoggedIn: !!user && !!token,

    isVerified: user?.is_email_verified ?? false,

    isAdmin: user?.role === "admin",
  };
}
