"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PaymentFailPage() {
  const [show, setShow] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 100);
    const t2 = setTimeout(() => setShowContent(true), 900);
    // Trigger shake after icon draws
    const t3 = setTimeout(() => setShake(true), 1200);
    const t4 = setTimeout(() => setShake(false), 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleRetry = () => {
    router.push("/checkout");
  };

  return (
    <div className='relative min-h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden px-4'>
      {/* Ambient red glow */}
      <div
        className='pointer-events-none absolute inset-0'
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 40%, rgba(220,38,38,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid texture */}
      <div
        className='pointer-events-none absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage:
            "linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Card */}
      <div
        className='relative z-10 w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#111111] p-10 text-center shadow-2xl'
        style={{
          boxShadow:
            "0 0 60px rgba(220,38,38,0.05), 0 8px 40px rgba(0,0,0,0.6)",
          opacity: show ? 1 : 0,
          transform: show
            ? "translateY(0) scale(1)"
            : "translateY(24px) scale(0.97)",
          transition:
            "opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Animated X icon */}
        <div
          className='mx-auto mb-8 flex h-24 w-24 items-center justify-center'
          style={{
            animation: shake
              ? "shakeIcon 0.45s cubic-bezier(0.36,0.07,0.19,0.97)"
              : "none",
          }}
        >
          <svg
            viewBox='0 0 96 96'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='h-full w-full'
          >
            {/* Outer ring base */}
            <circle cx='48' cy='48' r='44' stroke='#2a2a2a' strokeWidth='4' />
            {/* Animated ring */}
            <circle
              cx='48'
              cy='48'
              r='44'
              stroke='#dc2626'
              strokeWidth='4'
              strokeLinecap='round'
              strokeDasharray='276.46'
              strokeDashoffset='0'
              transform='rotate(-90 48 48)'
              style={{
                strokeDashoffset: show ? 0 : 276.46,
                transition:
                  "stroke-dashoffset 0.85s cubic-bezier(0.4,0,0.2,1) 0.15s",
              }}
            />
            {/* X — first stroke */}
            <line
              x1='33'
              y1='33'
              x2='63'
              y2='63'
              stroke='#dc2626'
              strokeWidth='5'
              strokeLinecap='round'
              strokeDasharray='50'
              strokeDashoffset='0'
              style={{
                strokeDashoffset: show ? 0 : 50,
                transition: "stroke-dashoffset 0.4s ease 0.85s",
              }}
            />
            {/* X — second stroke */}
            <line
              x1='63'
              y1='33'
              x2='33'
              y2='63'
              stroke='#dc2626'
              strokeWidth='5'
              strokeLinecap='round'
              strokeDasharray='50'
              strokeDashoffset='0'
              style={{
                strokeDashoffset: show ? 0 : 50,
                transition: "stroke-dashoffset 0.4s ease 1.05s",
              }}
            />
          </svg>
        </div>

        {/* Text content */}
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <h1 className='mb-1 font-serif text-3xl font-bold italic text-[#dc2626]'>
            Payment Failed
          </h1>
          <p className='mb-1 text-sm font-semibold uppercase tracking-widest text-[#555]'>
            Transaction Unsuccessful
          </p>
          <p className='mt-4 text-sm leading-relaxed text-[#888]'>
            We weren&apos;t able to process your payment. Your cart has been
            preserved — please review your details and try again.
          </p>

          {/* Divider */}
          <div className='my-7 flex items-center gap-3'>
            <div className='h-px flex-1 bg-[#222]' />
            <span className='text-xs text-[#444] uppercase tracking-widest'>
              Possible reasons
            </span>
            <div className='h-px flex-1 bg-[#222]' />
          </div>

          {/* Reason cards */}
          <div className='mb-8 space-y-3 text-left'>
            {[
              { icon: "💳", label: "Insufficient funds or card declined" },
              { icon: "🔒", label: "Card details entered incorrectly" },
              { icon: "🌐", label: "Network or connection interruption" },
            ].map((reason, i) => (
              <div
                key={i}
                className='flex items-center gap-3 rounded-lg border border-[#1e1e1e] bg-[#0d0d0d] px-4 py-3'
                style={{
                  opacity: showContent ? 1 : 0,
                  transform: showContent
                    ? "translateX(0)"
                    : "translateX(-10px)",
                  transition: `opacity 0.4s ease ${0.1 + i * 0.1}s, transform 0.4s ease ${0.1 + i * 0.1}s`,
                }}
              >
                <span className='text-lg'>{reason.icon}</span>
                <span className='text-sm text-[#aaa]'>{reason.label}</span>
              </div>
            ))}
          </div>

          {/* Error note */}
          {/* <div className='mb-7 rounded-lg border border-[#dc2626]/20 bg-[#dc2626]/5 px-4 py-3 text-xs text-[#dc2626]/80 text-left leading-relaxed'>
            ⚠️ &nbsp;No charge was made to your account. Contact your bank or
            try a different payment method.
          </div> */}

          {/* CTA Buttons */}
          <div className='flex flex-col gap-3 sm:flex-row'>
            <button
              onClick={handleRetry}
              className='flex-1 rounded-xl bg-[#D4AF37] py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-[#c9a430] hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] active:scale-[0.98]'
            >
              Try Again
            </button>
            <Link
              href='/'
              className='flex-1 rounded-xl border border-[#2a2a2a] bg-transparent py-3.5 text-sm font-bold uppercase tracking-wider text-[#aaa] transition-all hover:border-[#D4AF37]/40 hover:text-[#D4AF37] active:scale-[0.98]'
            >
              Back to Shop
            </Link>
          </div>

          {/* Support link */}
          <p className='mt-5 text-xs text-[#444]'>
            Still having trouble?{" "}
            <Link
              href='/contact'
              className='text-[#D4AF37]/70 underline-offset-2 hover:text-[#D4AF37] hover:underline transition-colors'
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shakeIcon {
          10%, 90% { transform: translateX(-3px); }
          20%, 80% { transform: translateX(5px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
