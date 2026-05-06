/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import AccountSidebar from "@/components/AccountSidebar";
import { Camera, User, Check, CircleUserRound, Loader } from "lucide-react";
import Image from "next/image";
import { useUpdateUserProfileMutation } from "@/redux/features/user/userAPI";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

export default function SettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  // Sync state with user data on load
  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setProfileImage(user.profile_image || null);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store the actual file for the API
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string); // For UI preview
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", fullName);

      if (selectedFile) {
        payload.append("profile_image", selectedFile);
      }

      const response = await updateUserProfile(payload).unwrap();

      toast.success("Profile updated successfully!");
      console.log("Response:", response);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
      console.error("Update Error:", error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFullName(user.name || "");
      setProfileImage(user.profile_image || null);
      setSelectedFile(null);
    }
  };

  return (
    <RoleRedirect allowedRole='USER'>
      <div className='mx-auto container px-4 py-8 lg:px-8'>
        <h1 className='text-3xl font-bold text-gold italic mb-8'>My Account</h1>
        <div className='flex flex-col gap-8 lg:flex-row'>
          <AccountSidebar />
          <div className='flex-1 min-w-0'>
            <div className='max-w-3xl space-y-8 pb-10'>
              <div>
                <h1 className='text-2xl font-bold text-white mb-1'>
                  Account Settings
                </h1>
                <p className='text-white/60 text-sm'>
                  Update your public profile information
                </p>
              </div>

              <div className='bg-surface-light border border-white/5 rounded-xl p-8'>
                <div className='space-y-8'>
                  {/* 1. Upload Profile Photo */}
                  <div className='flex flex-col items-center sm:flex-row gap-6 pb-6 border-b border-white/5'>
                    <div
                      className='relative group cursor-pointer'
                      onClick={triggerFileInput}
                    >
                      <div className='w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-500/30 bg-white/5 flex items-center justify-center relative'>
                        {profileImage ? (
                          <Image
                            src={profileImage}
                            alt='Profile'
                            fill
                            unoptimized
                            className='object-cover'
                          />
                        ) : (
                          <CircleUserRound
                            className='text-white/20'
                            size={48}
                            strokeWidth={1.5}
                          />
                        )}
                        <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                          <Camera className='text-white' size={24} />
                        </div>
                      </div>
                      <button
                        type='button'
                        className='absolute -bottom-1 -right-1 bg-yellow-500 p-2 rounded-full text-black shadow-lg hover:scale-110 transition-transform'
                      >
                        <Camera size={14} />
                      </button>
                    </div>

                    <div className='text-center sm:text-left space-y-1'>
                      <h3 className='text-white font-medium'>
                        Profile Picture
                      </h3>
                      <p className='text-white/50 text-xs'>
                        JPG, GIF or PNG. Max size of 2MB
                      </p>
                      <input
                        type='file'
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept='image/*'
                        className='hidden'
                      />
                      <button
                        onClick={triggerFileInput}
                        className='text-yellow-500 text-xs font-semibold hover:underline mt-2'
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>

                  {/* 2. Name Change */}
                  <div className='space-y-5'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-white/90'>
                        Full Name
                      </label>
                      <div className='relative'>
                        <span className='absolute left-4 top-1/2 -translate-y-1/2 text-white/40'>
                          <User size={16} />
                        </span>
                        <input
                          type='text'
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={isLoading}
                          placeholder='Enter your name'
                          className='w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-yellow-500/50 focus:bg-white/[0.07] transition-all disabled:opacity-50'
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex items-center gap-4 pt-6'>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className='flex items-center gap-2 bg-gold hover:bg-gold-dark text-black font-bold py-2.5 px-8 rounded-lg transition-all active:scale-95 text-sm disabled:opacity-70 disabled:cursor-not-allowed'
                      >
                        {isLoading ? (
                          <Loader size={18} className='animate-spin' />
                        ) : (
                          <Check size={18} />
                        )}
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className='bg-transparent border border-white/10 hover:bg-white/5 text-white/60 hover:text-white font-medium py-2.5 px-6 rounded-lg transition-colors text-sm disabled:opacity-50'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg'>
                <p className='text-blue-200 text-xs leading-relaxed'>
                  <strong>Pro Tip:</strong> Using a high-quality square image
                  ensures your profile looks sharp across the dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleRedirect>
  );
}
