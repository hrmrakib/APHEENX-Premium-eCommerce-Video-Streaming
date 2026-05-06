"use client";

import { useState } from "react";
import GlobalPagination from "@/components/pagination/GlobalPagination";
import { useGetAllUsersQuery } from "@/redux/features/admin/userAPI";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

interface IUser {
  id: number;
  name: string;
  email: string;
  role: string;
  is_email_verified: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: userData,
    isLoading,
    isFetching,
  } = useGetAllUsersQuery({
    page: currentPage,
    page_size: 10,
  });

  const users: IUser[] = userData?.data || [];

  const totalPages = userData?.meta?.total_pages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <div className='text-white p-6'>Loading...</div>;

  return (
    <RoleRedirect allowedRole='ADMIN'>
      <div className='space-y-6'>
        <div className='flex justify-between items-end'>
          <div>
            <h1 className='text-2xl font-bold text-white mb-1'>Users</h1>
            <p className='text-white/60 text-sm'>
              Manage platform users and permissions
            </p>
          </div>
          {/* Visual cue for background fetching */}
          {isFetching && (
            <span className='text-xs text-gold animate-pulse'>Updating...</span>
          )}
        </div>

        <div className='bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden mt-6'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm text-white/80'>
              <thead className='bg-[#111] text-white/60 text-xs border-b border-white/10'>
                <tr>
                  <th className='px-6 py-4 font-medium'>Name</th>
                  <th className='px-6 py-4 font-medium'>Email</th>
                  <th className='px-6 py-4 font-medium'>Role</th>
                  <th className='px-6 py-4 font-medium'>Status</th>
                  <th className='px-6 py-4 font-medium'>Joined Date</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y divide-white/5 ${isFetching ? "opacity-50" : "opacity-100 transition-opacity"}`}
              >
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className='hover:bg-white/5 transition-colors'
                    >
                      <td className='px-6 py-4 font-medium text-white'>
                        {user.name}
                      </td>
                      <td className='px-6 py-4'>{user.email}</td>
                      <td className='px-6 py-4 capitalize'>{user.role}</td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-3 py-1 rounded-full text-xs border ${
                            user.is_email_verified
                              ? "border-green-500/50 text-green-500 bg-green-500/10"
                              : "border-yellow-500/50 text-yellow-500 bg-yellow-500/10"
                          }`}
                        >
                          {user.is_email_verified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-6 py-10 text-center text-white/40'
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Integrate Pagination Component */}
        <GlobalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </RoleRedirect>
  );
}
