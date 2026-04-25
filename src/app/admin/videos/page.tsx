"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";

const videos = [
  {
    id: 1,
    name: "Getting Started with React Hooks",
    category: "Tutorials",
    price: 299.9,
    income: 1450,
    featured: true,
    status: "Published",
  },
  {
    id: 2,
    name: "Modern Web Design Principles",
    category: "Entertainment",
    price: 159.9,
    income: 4589,
    featured: false,
    status: "Published",
  },
  {
    id: 3,
    name: "Creative Content Creation",
    category: "Tutorials",
    price: 89.9,
    income: 2658,
    featured: true,
    status: "Draft",
  },
];

export default function AdminVideosPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Videos</h1>
          <p className="text-white/60 text-sm">Manage your video content library</p>
        </div>
        <Link 
          href="/admin/videos/add"
          className="btn-gold flex items-center gap-2"
        >
          <Plus size={18} />
          Add Video
        </Link>
      </div>

      <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-[#111] text-white/60 text-xs border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Thumbnail</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Income</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {videos.map((video) => (
                <tr key={video.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-12 bg-yellow-400 rounded flex items-center justify-center">
                      {/* Placeholder for video thumbnail */}
                      <span className="text-xs text-black font-bold">IMG</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{video.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs border border-white/20 text-white/70">
                      {video.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">${video.price.toFixed(1)}</td>
                  <td className="px-6 py-4 text-green-500 font-medium">
                    $ {video.income.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {video.featured ? (
                      <span className="px-3 py-1 rounded-full text-xs border border-purple-500/50 text-purple-400 bg-purple-500/10">
                        Featured
                      </span>
                    ) : null}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs border ${
                      video.status === 'Published' 
                        ? 'border-green-500/50 text-green-400 bg-green-500/10' 
                        : 'border-white/20 text-white/70 bg-white/5'
                    }`}>
                      {video.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="text-white/60 hover:text-white transition-colors">
                        <Pencil size={18} />
                      </button>
                      <button className="text-red-500/80 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
