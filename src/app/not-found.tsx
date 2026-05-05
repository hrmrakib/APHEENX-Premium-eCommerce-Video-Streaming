"use client";

import { useRouter } from "next/navigation";

/* eslint-disable @next/next/no-img-element */
export default function NotFound() {
  const router = useRouter();
  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-center px-4 text-center'>
      {/* Message */}
      <h1 className='text-4xl font-bold text-foreground sm:text-5xl'>
        We can&apos;t find that page
      </h1>
      <p className='mt-4 text-lg text-muted max-w-md'>
        The link might be broken or the product has been moved. Try searching
        our store instead!
      </p>

      {/* Quick Links */}
      <div className='mt-10 flex flex-wrap justify-center gap-4'>
        <button className='btn-gold px-8 py-3' onClick={() => router.push("/")}>
          Back to Home
        </button>
        <button
          className='rounded-lg border border-border px-8 py-3 hover:bg-surface transition-colors'
          onClick={() => router.push("/shop")}
        >
          View All Products
        </button>
      </div>

      {/* Trust Signal */}
      <p className='mt-12 text-sm text-muted'>
        Need help?{" "}
        <span className='text-gold cursor-pointer underline'>
          Contact Support
        </span>
      </p>
    </div>
  );
}
