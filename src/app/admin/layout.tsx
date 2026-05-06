"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleRedirect allowedRole='ADMIN'>
      <div className='flex h-screen bg-[#0a0a0a] overflow-hidden text-white'>
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <div className='flex-1 flex flex-col h-screen overflow-hidden relative'>
          <AdminHeader setSidebarOpen={setSidebarOpen} />

          <main className='flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#0a0a0a]'>
            <div className='container mx-auto'>{children}</div>
          </main>
        </div>
      </div>
    </RoleRedirect>
  );
}
