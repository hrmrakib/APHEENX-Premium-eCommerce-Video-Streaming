import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useAuthStore } from "@/store/authStore";

// --- Types (unchanged) ---
export interface LoginPayload {
  email: string;
  password: string;
}
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}
export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

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
export interface AuthResponse {
  user: UserProfile;
  token: string;
}

// ─────────────────────────────────────────────
// PUBLIC API CALLS — use axiosPublic directly
// (no token, safe to call outside a hook)
// ─────────────────────────────────────────────
const loginApi = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await axiosPublic.post<AuthResponse>(
    "/auth/login/",
    payload,
  );
  return data;
};

const registerApi = async (
  payload: RegisterPayload,
): Promise<{ message: string }> => {
  const { data } = await axiosPublic.post<{ message: string }>(
    "/auth/register/",
    payload,
  );
  return data;
};

const verifyEmailApi = async (
  payload: VerifyEmailPayload,
): Promise<{ message: string }> => {
  const { data } = await axiosPublic.post<{ message: string }>(
    "/auth/verify-email/",
    payload,
  );
  return data;
};

const forgotPasswordApi = async (
  payload: ForgotPasswordPayload,
): Promise<{ message: string }> => {
  const { data } = await axiosPublic.post<{ message: string }>(
    "/auth/forgot-password/",
    payload,
  );
  return data;
};

// ─────────────────────────────────────────────
// SECURE API CALL FACTORIES — receive axiosSecure
// instance passed in from the hook below
// ─────────────────────────────────────────────

const fetchUserApi = async (
  axiosSecure: ReturnType<typeof useAxiosSecure>,
): Promise<AuthResponse["user"]> => {
  const { data } = await axiosSecure.get<AuthResponse["user"]>("/auth/me");
  return data;
};

const logoutApi = async (
  axiosSecure: ReturnType<typeof useAxiosSecure>,
): Promise<{ detail: string }> => {
  const { data } = await axiosSecure.post<{ detail: string }>("/auth/logout");
  return data;
};

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────
export const useLoginMutation = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({ mutationFn: registerApi });
};

export const useVerifyEmailMutation = () => {
  return useMutation({ mutationFn: verifyEmailApi });
};

export const useForgotPasswordMutation = () => {
  return useMutation({ mutationFn: forgotPasswordApi });
};

export const useLogoutMutation = () => {
  const axiosSecure = useAxiosSecure();
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutApi(axiosSecure),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
    onError: () => {
      logout();
      queryClient.clear();
    },
  });
};

export const useUserQuery = () => {
  const axiosSecure = useAxiosSecure();
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUserApi(axiosSecure),
    enabled: !!token,
    retry: false,
  });
};
