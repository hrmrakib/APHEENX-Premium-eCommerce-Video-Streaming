/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForgotPasswordMutation } from "@/redux/features/auth/authAPI";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Use isLoading directly from the mutation hook
  const [forgotPasswordMutation, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple Email Validation
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Use .unwrap() to catch the error in the catch block
      const res = await forgotPasswordMutation({ email }).unwrap();

      setIsSuccess(true);
      toast.success(res.message || "Reset link sent successfully!");

      setTimeout(() => {
        router.push("/verify?email=" + email + "&type=forgot-password");
      }, 3000);
    } catch (err: any) {
      // Handle RTK Query error structure
      const errorMessage =
        err?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className='w-full max-w-md'>
      <div className='card-border p-8 bg-surface/50 border border-white/10 rounded-2xl'>
        <h1 className='text-2xl font-bold text-center text-foreground'>
          Forgot Password?
        </h1>
        <p className='mt-2 text-center text-sm text-muted mb-6'>
          Enter your email address and we&apos;ll send you instructions to reset
          your password.
        </p>

        {isSuccess ? (
          <div className='mt-8 text-center animate-in fade-in zoom-in duration-300'>
            <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20'>
              <svg
                className='h-8 w-8 text-green-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-foreground'>
              Check your email
            </h3>
            <p className='mt-2 text-sm text-muted'>
              We have sent a password reset link to <br />
              <span className='font-semibold text-gold'>{email}</span>
            </p>
            <div className='mt-8'>
              <Link
                href='/login'
                className='bg-gold hover:bg-gold-dark text-black w-full py-3 rounded-lg text-sm font-bold inline-block text-center transition-colors'
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-5'>
            {error && (
              <div className='rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-500'>
                {error}
              </div>
            )}

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
                  placeholder='Enter your email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-gold transition-colors'
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='bg-gold hover:bg-gold-dark text-black w-full py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? "Sending..." : "Send Reset Instructions"}
            </button>

            <div className='text-center mt-6'>
              <Link
                href='/login'
                className='text-sm text-gold hover:text-gold-light transition-colors flex items-center justify-center gap-2'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M10 19l-7-7m0 0l7-7m-7 7h18'
                  />
                </svg>
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useForgotPasswordMutation } from "@/redux/features/auth/authAPI";
// import { toast } from "sonner";

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [error, setError] = useState("");

//   const [forgotPasswordMutation, { isLoading }] = useForgotPasswordMutation();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setError("Valid email is required");
//       return;
//     }

//     try {
//       const res = await forgotPasswordMutation({ email });

//       toast.success("");
//     } catch (error: any) {
//       toast.error(error?.data?.message);
//     }
//   };

//   return (
//     <div className='w-full max-w-md'>
//       <div className='card-border p-8 bg-surface/50'>
//         <h1 className='text-2xl font-bold text-center text-foreground'>
//           Forgot Password?
//         </h1>
//         <p className='mt-2 text-center text-sm text-muted'>
//           Enter your email address and we&apos;ll send you instructions to reset
//           your password.
//         </p>

//         {isSuccess ? (
//           <div className='mt-8 text-center'>
//             <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/20'>
//               <svg
//                 className='h-6 w-6 text-success'
//                 fill='none'
//                 viewBox='0 0 24 24'
//                 stroke='currentColor'
//               >
//                 <path
//                   strokeLinecap='round'
//                   strokeLinejoin='round'
//                   strokeWidth='2'
//                   d='M5 13l4 4L19 7'
//                 />
//               </svg>
//             </div>
//             <h3 className='text-lg font-medium text-foreground'>
//               Check your email
//             </h3>
//             <p className='mt-2 text-sm text-muted'>
//               We have sent a password reset link to <br />
//               <span className='font-semibold text-foreground'>{email}</span>
//             </p>
//             <div className='mt-6'>
//               <Link
//                 href='/login'
//                 className='btn-gold w-full py-3 text-sm inline-block text-center'
//               >
//                 Back to Sign In
//               </Link>
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className='mt-8 space-y-5'>
//             {error && (
//               <div className='rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger'>
//                 {error}
//               </div>
//             )}

//             {/* Email */}
//             <div>
//               <label className='block text-sm font-semibold text-foreground mb-2'>
//                 Email Address
//               </label>
//               <div className='relative'>
//                 <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted'>
//                   <svg
//                     className='h-4 w-4'
//                     fill='none'
//                     stroke='currentColor'
//                     viewBox='0 0 24 24'
//                   >
//                     <path
//                       strokeLinecap='round'
//                       strokeLinejoin='round'
//                       strokeWidth='1.5'
//                       d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75'
//                     />
//                   </svg>
//                 </span>
//                 <input
//                   type='email'
//                   placeholder='Enter your email address'
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className='input-field pl-8!'
//                   disabled={isSubmitting}
//                 />
//               </div>
//             </div>

//             <button
//               type='submit'
//               disabled={isSubmitting}
//               className='btn-gold w-full py-3 text-sm disabled:opacity-50'
//             >
//               {isSubmitting ? "Sending..." : "Send Reset Instructions"}
//             </button>

//             <div className='text-center mt-6'>
//               <Link
//                 href='/login'
//                 className='text-sm text-gold hover:text-gold-light transition-colors flex items-center justify-center gap-2'
//               >
//                 <svg
//                   className='w-4 h-4'
//                   fill='none'
//                   stroke='currentColor'
//                   viewBox='0 0 24 24'
//                 >
//                   <path
//                     strokeLinecap='round'
//                     strokeLinejoin='round'
//                     strokeWidth='2'
//                     d='M10 19l-7-7m0 0l7-7m-7 7h18'
//                   />
//                 </svg>
//                 Back to Sign In
//               </Link>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
