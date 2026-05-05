/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, X, FileVideo } from "lucide-react";
import { toast } from "sonner";
import { useAddVideoMutation } from "@/redux/features/admin/videoAPI";

interface IVideoFormData {
  title: string;
  category: string | number;
  description: string;
  price: string;
  status: "draft" | "published";
  is_featured: boolean;
  thumbnail: File | null;
  trailer: File | null;
  main_video: File | null;
}

export default function AddNewVideoPage() {
  const [formData, setFormData] = useState<IVideoFormData>({
    title: "",
    category: "",
    description: "",
    price: "",
    status: "draft",
    is_featured: false,
    thumbnail: null,
    trailer: null,
    main_video: null,
  });
  const [addVideoMutation] = useAddVideoMutation();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof IVideoFormData,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
    }
  };

  const removeFile = (field: keyof IVideoFormData) => {
    setFormData((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.category ||
      !formData.thumbnail ||
      !formData.main_video
    ) {
      return toast.error(
        "Please fill in all required fields and upload necessary files.",
      );
    }
    try {
      const submissionData = new FormData();
      submissionData.append("title", formData.title);
      submissionData.append("category", formData.category.toString());
      submissionData.append("description", formData.description);
      submissionData.append("price", formData.price);
      submissionData.append("status", formData.status);
      submissionData.append("is_featured", String(formData.is_featured));

      if (formData.thumbnail)
        submissionData.append("thumbnail", formData.thumbnail);
      if (formData.trailer) submissionData.append("trailer", formData.trailer);
      if (formData.main_video)
        submissionData.append("main_video", formData.main_video);

      const res = await addVideoMutation(submissionData).unwrap();

      toast.success("Video added successfully!");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Something happed wrong to add video.",
      );
    }

    // Here you would call your useCreateVideoMutation(submissionData)
    console.log("Form Submitted", formData);
  };

  return (
    <div className='max-w-4xl space-y-8 pb-10'>
      <div>
        <Link
          href='/admin/videos'
          className='inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors'
        >
          <ArrowLeft size={16} />
          <span className='text-sm'>Back to video</span>
        </Link>
        <h1 className='text-2xl font-bold text-white mb-1'>Add New Video</h1>
        <p className='text-white/60 text-sm'>
          Upload and configure your video content
        </p>
      </div>

      <div className='space-y-6'>
        <h2 className='text-yellow-500 font-semibold text-lg border-b border-white/5 pb-2'>
          Video Details
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Video Title<span className='text-red-500'>*</span>
            </label>
            <input
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              type='text'
              placeholder='Enter Video Title'
              className='input-field'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Video Category<span className='text-red-500'>*</span>
            </label>
            <select
              name='category'
              value={formData.category}
              onChange={handleInputChange}
              className='input-field appearance-none bg-background'
            >
              <option value=''>Select Category</option>
              <option value='1'>Tutorials</option>
              <option value='2'>Entertainment</option>
              <option value='3'>Drama</option>
            </select>
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-white/90'>
            Video Description<span className='text-red-500'>*</span>
          </label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            placeholder='Enter video description'
            rows={4}
            className='input-field resize-none'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Price (USD)<span className='text-red-500'>*</span>
            </label>
            <input
              name='price'
              value={formData.price}
              onChange={handleInputChange}
              type='number'
              placeholder='0.00'
              className='input-field'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Status<span className='text-red-500'>*</span>
            </label>
            <select
              name='status'
              value={formData.status}
              onChange={handleInputChange}
              className='input-field appearance-none bg-background'
            >
              <option value='draft'>Draft</option>
              <option value='published'>Published</option>
            </select>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <h2 className='text-yellow-500 font-semibold text-lg border-b border-white/5 pb-2'>
          Video Upload
        </h2>

        {/* Trailer Upload */}
        <div className='space-y-4'>
          <label className='text-sm font-medium text-white/90'>
            Trailer Video (Free Preview)
          </label>
          {!formData.trailer ? (
            <label className='border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-500/50 hover:bg-white/5 transition-all'>
              <Upload className='text-white/40 mb-3' size={24} />
              <p className='text-white/80 text-sm mb-1'>
                Click to upload Trailer
              </p>
              <input
                type='file'
                accept='video/*'
                className='hidden'
                onChange={(e) => handleFileChange(e, "trailer")}
              />
            </label>
          ) : (
            <div className='flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10'>
              <div className='flex items-center gap-3'>
                <FileVideo className='text-yellow-500' />
                <span className='text-sm text-white/80 truncate max-w-50'>
                  {formData.trailer.name}
                </span>
              </div>
              <button
                onClick={() => removeFile("trailer")}
                className='text-red-500 hover:bg-red-500/10 p-1 rounded-full'
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Thumbnail Upload */}
        <div className='space-y-4'>
          <label className='text-sm font-medium text-white/90'>
            Video Thumbnail<span className='text-red-500'>*</span>
          </label>
          {!formData.thumbnail ? (
            <label className='border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-500/50 hover:bg-white/5 transition-all'>
              <Upload className='text-white/40 mb-3' size={24} />
              <p className='text-white/80 text-sm mb-1'>
                Click to upload Thumbnail
              </p>
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => handleFileChange(e, "thumbnail")}
              />
            </label>
          ) : (
            <div className='relative w-40 h-24 rounded-xl overflow-hidden border border-white/10 group'>
              <img
                src={URL.createObjectURL(formData.thumbnail)}
                alt='Preview'
                className='w-full h-full object-cover'
              />
              <button
                onClick={() => removeFile("thumbnail")}
                className='absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Main Video Upload */}
        <div className='space-y-4'>
          <label className='text-sm font-medium text-white/90'>
            Main Video (Paid Content)<span className='text-red-500'>*</span>
          </label>
          {!formData.main_video ? (
            <label className='border border-dashed border-yellow-500/50 bg-yellow-950/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-yellow-900/30 transition-all'>
              <Upload className='text-yellow-500/60 mb-3' size={24} />
              <p className='text-white/80 text-sm mb-1'>
                Click to upload Main Video
              </p>
              <input
                type='file'
                accept='video/*'
                className='hidden'
                onChange={(e) => handleFileChange(e, "main_video")}
              />
            </label>
          ) : (
            <div className='flex items-center justify-between p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20'>
              <div className='flex items-center gap-3'>
                <FileVideo className='text-yellow-500' />
                <span className='text-sm text-white/80 truncate max-w-50'>
                  {formData.main_video.name}
                </span>
              </div>
              <button
                onClick={() => removeFile("main_video")}
                className='text-red-500 hover:bg-red-500/10 p-1 rounded-full'
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Featured Switch */}
      <div className='flex items-center gap-3 pt-4'>
        <button
          onClick={() =>
            setFormData((prev) => ({ ...prev, is_featured: !prev.is_featured }))
          }
          className={`w-12 h-6 rounded-full transition-colors relative ${formData.is_featured ? "bg-yellow-500" : "bg-white/20"}`}
        >
          <span
            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_featured ? "translate-x-6" : "translate-x-0"}`}
          />
        </button>
        <span className='text-white font-medium'>Mark as Featured Video</span>
      </div>

      <div className='flex items-center gap-4 pt-6'>
        <button onClick={handleSubmit} className='btn-gold min-w-35'>
          Publish Video
        </button>
        <Link
          href='/admin/videos'
          className='btn-outline-gold border-white/20 text-white hover:bg-white/5 min-w-35'
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
