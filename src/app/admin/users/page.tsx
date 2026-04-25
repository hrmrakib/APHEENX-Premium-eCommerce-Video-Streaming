"use client";

const users = [
  {
    id: 1,
    name: "Akash Saha",
    email: "asksaha9@gmail.com",
    status: "Active",
    date: "14/04/2026",
  },
  {
    id: 2,
    name: "Akash Saha",
    email: "asksaha9@gmail.com",
    status: "Active",
    date: "14/04/2026",
  },
  {
    id: 3,
    name: "Akash Saha",
    email: "asksaha9@gmail.com",
    status: "Active",
    date: "14/04/2026",
  },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Users</h1>
        <p className="text-white/60 text-sm">Manage platform users and permissions</p>
      </div>

      <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-[#111] text-white/60 text-xs border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs border ${
                      user.status === 'Active' 
                        ? 'border-green-500/50 text-green-500 bg-green-500/10' 
                        : 'border-white/20 text-white/70 bg-white/5'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
