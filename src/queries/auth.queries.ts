import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

// --- Types ---
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

export interface AuthResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    verified: boolean;
    role?: "user" | "admin";
  };
  token: string;
  message: string;
}

// --- API Calls ---
const loginApi = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login/", payload);
  return data;
};

const registerApi = async (
  payload: RegisterPayload,
): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>(
    "/auth/register/",
    payload,
  );
  return data;
};

const verifyEmailApi = async (
  payload: VerifyEmailPayload,
): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>(
    "/auth/verify-email/",
    payload,
  );
  return data;
};

const fetchUserApi = async (): Promise<AuthResponse["user"]> => {
  const { data } = await api.get<AuthResponse["user"]>("/auth/me");
  return data;
};

const logoutApi = async (): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>("/auth/logout");
  return data;
};

// --- Hooks ---
export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
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
  return useMutation({
    mutationFn: registerApi,
  });
};

export const useLogoutMutation = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
    onError: () => {
      // Even if API call fails, clear local state
      logout();
      queryClient.clear();
    },
  });
};

export const useUserQuery = () => {
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUserApi,
    enabled: !!token,
    retry: false, // Don't retry on 401s
  });
};
