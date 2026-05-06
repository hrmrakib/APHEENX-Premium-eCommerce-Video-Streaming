/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser, userTrack } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { saveTokens } from "@/service/authService";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      // Parse the full JSON response
      const result = await response.json();

      if (response.status !== 200) {
        toast.error(result.message);
        return;
      }

      if (response?.ok) {
        await saveTokens(result?.data?.access);
        dispatch(userTrack());
        dispatch(
          setUser({
            user: result?.data?.user,
            token: result?.data?.access,
          }),
        );

        // According to your backend response, the data is nested in 'data'
        if (response.ok && result.data?.access) {
          const { access } = result.data;

          // Store the token
          localStorage.setItem("access_token", access);
          console.log("Token stored successfully");

          // Redirect using your router
          router.push("/");
        }
      } else {
        // Handle backend validation errors (e.g., result.message)
        console.error("Login failed:", result.message || "Unknown error");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to login");
      // Handle network errors
      console.error("Network error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md'>
      <div className='card-border p-8 bg-surface/50'>
        <h1 className='text-2xl font-bold text-center text-foreground'>
          Welcome Back !!
        </h1>
        <p className='mt-2 text-center text-sm text-muted'>
          Sign in to access your premium account
        </p>

        <form onSubmit={handleSubmit} className='mt-8 space-y-5'>
          {error && (
            <div className='rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger'>
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              Email Address
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted'>
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.5'
                    d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75'
                  />
                </svg>
              </span>
              <input
                type='email'
                placeholder='Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='input-field pl-8!'
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              Email Address
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted'>
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.5'
                    d='M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z'
                  />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='input-field pl-8! pr-10'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors'
              >
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  {showPassword ? (
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='1.5'
                      d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
                    />
                  ) : (
                    <>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='1.5'
                        d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='1.5'
                        d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className='flex items-center justify-between'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className='h-4 w-4 rounded border-border accent-gold'
              />
              <span className='text-sm text-foreground'>Remember me</span>
            </label>
            <Link
              href='/forgot-password'
              className='text-sm text-gold hover:text-gold-light transition-colors'
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='btn-gold w-full py-3 text-sm disabled:opacity-50'
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          <p className='text-center text-sm text-muted'>
            Don&apos;t have an account?{" "}
            <Link
              href='/signup'
              className='text-gold hover:text-gold-light transition-colors'
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
