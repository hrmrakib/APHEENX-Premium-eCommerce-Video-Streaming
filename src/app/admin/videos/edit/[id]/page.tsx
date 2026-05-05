"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

export default function AddNewVideoPage() {
  const [isFeatured, setIsFeatured] = useState(false);

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <div>
        <Link href="/admin/videos" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm">Back to video</span>
        </Link>
        <h1 className="text-2xl font-bold text-white mb-1">Add New Video</h1>
        <p className="text-white/60 text-sm">Upload and configure your video content</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-yellow-500 font-semibold text-lg border-b border-white/5 pb-2">Video Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Video Title<span className="text-red-500">*</span></label>
            <input type="text" placeholder="Enter Video Title" className="input-field" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Video Category<span className="text-red-500">*</span></label>
            <select className="input-field appearance-none bg-[#0a0a0a]">
              <option value="">Select Category</option>
              <option value="tutorials">Tutorials</option>
              <option value="entertainment">Entertainment</option>
              <option value="drama">Drama</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Product Description<span className="text-red-500">*</span></label>
          <textarea 
            placeholder="Enter video description" 
            rows={4}
            className="input-field resize-none" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Price (USD)<span className="text-red-500">*</span></label>
            <input type="number" placeholder="0.00" className="input-field" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Status<span className="text-red-500">*</span></label>
            <select className="input-field appearance-none bg-[#0a0a0a]">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-yellow-500 font-semibold text-lg border-b border-white/5 pb-2">Video Upload</h2>
        
        <div className="space-y-4">
          <label className="text-sm font-medium text-white/90">Trailer Video (Free Preview)<span className="text-red-500">*</span></label>
          <div className="border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-500/50 hover:bg-white/5 transition-all">
            <Upload className="text-white/40 mb-3" size={24} />
            <p className="text-white/80 text-sm mb-1">Click to upload or drag and drop</p>
            <p className="text-white/40 text-xs">MP4, MOV, AVI (max. 100MB)</p>
          </div>
          <p className="text-white/40 text-xs">This video will be available as a free preview to all users</p>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-white/90">Video Thumbnail<span className="text-red-500">*</span></label>
          <div className="border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-500/50 hover:bg-white/5 transition-all">
            <Upload className="text-white/40 mb-3" size={24} />
            <p className="text-white/80 text-sm mb-1">Click to upload or drag and drop</p>
            <p className="text-white/40 text-xs">PNG, JPG, WEBP (max. 5MB each)</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-white/90">Main Video (Paid Content)<span className="text-red-500">*</span></label>
          <div className="border border-dashed border-yellow-500/50 bg-yellow-950/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-yellow-900/30 transition-all">
            <Upload className="text-yellow-500/60 mb-3" size={24} />
            <p className="text-white/80 text-sm mb-1">Click to upload or drag and drop</p>
            <p className="text-white/40 text-xs">MP4, MOV, AVI (max. 100MB)</p>
          </div>
          <p className="text-white/40 text-xs">This video will be locked and available only after purchase</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button 
          onClick={() => setIsFeatured(!isFeatured)}
          className={`w-12 h-6 rounded-full transition-colors relative ${isFeatured ? 'bg-yellow-500' : 'bg-white/20'}`}
        >
          <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
        <span className="text-white font-medium">Mark as Featured Video</span>
      </div>

      <div className="flex items-center gap-4 pt-6">
        <button className="btn-gold min-w-[140px]">Publish Video</button>
        <Link href="/admin/videos" className="btn-outline-gold border-white/20 text-white hover:bg-white/5 min-w-[140px]">Cancel</Link>
      </div>
    </div>
  );
}
