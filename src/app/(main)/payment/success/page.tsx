"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 1.5}s`,
  duration: `${1.5 + Math.random() * 1.5}s`,
  color: i % 3 === 0 ? "#D4AF37" : i % 3 === 1 ? "#fff" : "#a07c1e",
  size: `${6 + Math.random() * 8}px`,
  drift: `${(Math.random() - 0.5) * 120}px`,
}));

export default function PaymentSuccessPage() {
  const [show, setShow] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 100);
    const t2 = setTimeout(() => setShowContent(true), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className='relative min-h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden px-4'>
      {/* Ambient glow */}
      <div
        className='pointer-events-none absolute inset-0'
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212,175,55,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Confetti particles */}
      {show &&
        PARTICLES.map((p) => (
          <span
            key={p.id}
            className='pointer-events-none absolute top-0 rounded-sm'
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
              opacity: 0,
            }}
          />
        ))}

      {/* Card */}
      <div
        className='relative z-10 w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#111111] p-10 text-center shadow-2xl'
        style={{
          boxShadow:
            "0 0 60px rgba(212,175,55,0.06), 0 8px 40px rgba(0,0,0,0.6)",
          opacity: show ? 1 : 0,
          transform: show
            ? "translateY(0) scale(1)"
            : "translateY(24px) scale(0.97)",
          transition:
            "opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Animated circle + checkmark */}
        <div className='mx-auto mb-8 flex h-24 w-24 items-center justify-center'>
          <svg
            viewBox='0 0 96 96'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='h-full w-full'
          >
            {/* Outer ring */}
            <circle cx='48' cy='48' r='44' stroke='#2a2a2a' strokeWidth='4' />
            {/* Animated progress ring */}
            <circle
              cx='48'
              cy='48'
              r='44'
              stroke='#D4AF37'
              strokeWidth='4'
              strokeLinecap='round'
              strokeDasharray='276.46'
              strokeDashoffset='0'
              transform='rotate(-90 48 48)'
              style={{
                strokeDashoffset: show ? 0 : 276.46,
                transition:
                  "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1) 0.15s",
              }}
            />
            {/* Checkmark */}
            <polyline
              points='28,50 42,64 68,36'
              stroke='#D4AF37'
              strokeWidth='5'
              strokeLinecap='round'
              strokeLinejoin='round'
              fill='none'
              strokeDasharray='60'
              strokeDashoffset='0'
              style={{
                strokeDashoffset: show ? 0 : 60,
                transition: "stroke-dashoffset 0.5s ease 0.9s",
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
          <h1 className='mb-1 font-serif text-3xl font-bold italic text-[#D4AF37]'>
            Payment Successful
          </h1>
          <p className='mb-1 text-sm font-semibold uppercase tracking-widest text-[#555]'>
            Order Confirmed
          </p>
          <p className='mt-4 text-sm leading-relaxed text-[#888]'>
            Thank you for your purchase. Your order has been received and is now
            being processed. You&apos;ll receive a confirmation email shortly.
          </p>

          {/* Divider */}
          <div className='my-7 flex items-center gap-3'>
            <div className='h-px flex-1 bg-[#222]' />
            <span className='text-xs text-[#444] uppercase tracking-widest'>
              What&apos;s next
            </span>
            <div className='h-px flex-1 bg-[#222]' />
          </div>

          {/* Steps */}
          <div className='mb-8 space-y-3 text-left'>
            {[
              { icon: "📧", label: "Confirmation email sent to your inbox" },
              { icon: "📦", label: "Order is being packed and prepared" },
              {
                icon: "🚚",
                label: "Tracking info will be emailed once shipped",
              },
            ].map((step, i) => (
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
                <span className='text-lg'>{step.icon}</span>
                <span className='text-sm text-[#aaa]'>{step.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className='flex flex-col gap-3 sm:flex-row'>
            <Link
              href='/account/orders'
              className='flex-1 rounded-xl bg-[#D4AF37] py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-[#c9a430] hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] active:scale-[0.98]'
            >
              View Orders
            </Link>
            <Link
              href='/'
              className='flex-1 rounded-xl border border-[#2a2a2a] bg-transparent py-3.5 text-sm font-bold uppercase tracking-wider text-[#aaa] transition-all hover:border-[#D4AF37]/40 hover:text-[#D4AF37] active:scale-[0.98]'
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) translateX(var(--drift, 60px)) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
