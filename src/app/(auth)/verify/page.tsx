/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, useCallback, Suspense, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import {
  useResendOtpMutation,
  useVerifyEmailMutation,
  useVerifyResetOtpMutation,
} from "@/redux/features/auth/authAPI";

function VerifyPageComponent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "";
  const router = useRouter();
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyResetOtpMutation] = useVerifyResetOtpMutation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendEmail, { isLoading: isResending }] = useResendOtpMutation();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = useCallback(async () => {
    const fullCode = code.join("").trim();

    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    try {
      let res;

      if (type === "signup") {
        res = await verifyEmail({ email, otp: fullCode }).unwrap();
      } else {
        res = await verifyResetOtpMutation({
          email,
          otp: fullCode,
        }).unwrap();
      }

      toast.success(res?.message);

      router.push(
        type === "signup"
          ? "/login"
          : `/reset-password?reset_token=${res?.data?.reset_token}`,
      );
    } catch (err: any) {
      setError(err?.data?.message || "Verification failed. Please try again.");
    }
  }, [code, email, type, router, verifyEmail, verifyResetOtpMutation]);

  const handleResend = async () => {
    try {
      const res = await resendEmail({
        email,
        purpose: "password_reset",
      }).unwrap();

      console.log({ res });
      if (res?.message) {
        toast.success(res.message || "OTP Resent successfully");
      }
    } catch (error: any) {
      toast.success(error?.data?.message || "OTP Resent successfully");

      console.log(error);
    }

    setResendTimer(60);
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className='w-full max-w-md'>
      <div className='card-border p-8 bg-surface/50'>
        <h1 className='text-2xl font-bold text-center text-foreground'>
          Enter Verification Code
        </h1>
        <p className='mt-2 text-center text-sm text-muted'>
          We&apos;ve sent a 6-digit code to{" "}
          <span className='text-gold'>{email || "your email"}</span>
        </p>

        {error && (
          <div className='mt-4 rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger'>
            {error}
          </div>
        )}

        {/* OTP Inputs */}
        <div className='mt-8 flex justify-center gap-3' onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className='h-12 w-12 rounded-lg border border-border bg-transparent text-center text-lg font-semibold text-foreground outline-none transition-all focus:border-gold focus:shadow-[0_0_0_2px_rgba(212,168,67,0.1)]'
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying || isResending}
          className='btn-gold mt-8 w-full py-3 text-sm disabled:opacity-50'
        >
          {isVerifying ? "Verifying..." : "Verify Your account"}
        </button>

        <p className='mt-4 text-center text-sm text-muted'>
          Didn&apos;t received any code?{" "}
          {resendTimer > 0 ? (
            <span className='text-gold'>Resend in {resendTimer}s</span>
          ) : (
            <button
              disabled={isResending}
              title={`${isResending && "OTP requesting ....."}`}
              onClick={handleResend}
              className='text-gold hover:text-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isResending ? "Resending..." : "Resend code"}
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<p>loading ...</p>}>
      <VerifyPageComponent />
    </Suspense>
  );
}
