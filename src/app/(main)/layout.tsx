import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleRedirect allowedRole='USER'>
      <div className='flex min-h-screen flex-col'>
        <Navbar />
        <main className='flex-1'>{children}</main>
        <Footer />
      </div>
    </RoleRedirect>
  );
}
