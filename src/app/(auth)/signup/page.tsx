/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/features/auth/authAPI";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const [registerMutation, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Valid email is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerMutation({
        name: fullName,
        email,
        password,
        password_confirm: confirmPassword,
      });

      toast.success("Sign up successful. Please verify your email");
      router.push(`/verify?email=${email}&type=signup`);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred during sign up";

      setError(errorMessage);
    }
  };

  return (
    <div className='w-full max-w-md'>
      <div className='card-border p-8 bg-surface/50'>
        <h1 className='text-2xl font-bold text-center text-foreground'>
          Create Account
        </h1>
        <p className='mt-2 text-center text-sm text-muted'>
          Join the premium experience
        </p>

        <form onSubmit={handleSubmit} className='mt-8 space-y-5'>
          {error && (
            <div className='rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger'>
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              Full Name
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
                    d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                  />
                </svg>
              </span>
              <input
                type='text'
                placeholder='Full Name'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className='input-field pl-8!'
              />
            </div>
          </div>

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
              Enter Password
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
                className='input-field pl-8! pr-8!'
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

          {/* Confirm Password */}
          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              Enter Password Again
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
                type={showConfirm ? "text" : "password"}
                placeholder='Enter your password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='input-field pl-8! pr-8!'
              />
              <button
                type='button'
                onClick={() => setShowConfirm(!showConfirm)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors'
              >
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  {showConfirm ? (
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

          <button
            type='submit'
            disabled={isLoading}
            className='btn-gold w-full py-3 text-sm disabled:opacity-50'
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className='text-center text-sm text-muted'>
            Already have an account?{" "}
            <Link
              href='/signin'
              className='text-gold hover:text-gold-light transition-colors'
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
