import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/redux/features/Providers";
import AppInitializer from "@/components/AppInitializer/AppInitializer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "APHEENX — Premium eCommerce & Video Streaming",
  description:
    "Discover premium fashion, accessories, and exclusive video content on APHEENX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${inter.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col bg-background text-foreground'>
        <Providers>
          <AppInitializer>
            <Toaster />

            {children}
          </AppInitializer>
        </Providers>
      </body>
    </html>
  );
}
