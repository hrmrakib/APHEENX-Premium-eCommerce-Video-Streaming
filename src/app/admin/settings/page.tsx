/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUpdateUserProfileMutation } from "@/redux/features/user/userAPI";
import {
  AlertCircle,
  Camera,
  Check,
  CircleUserRound,
  Loader,
  LogOut,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const router = useRouter();
  // const [lowStockAlerts, setLowStockAlerts] = useState(true);
  // const [newUserRegistration, setNewUserRegistration] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const confirmSignOut = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

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

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("full_name", fullName);

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
    <div className='max-w-3xl space-y-8 pb-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-white mb-1'>Settings</h1>
          <p className='text-white/60 text-sm'>
            Manage your platform preferences and configuration
          </p>
        </div>

        <div className='flex items-center justify-end'>
          <button
            onClick={() => setShowLogoutModal(true)}
            className='mt-4 flex w-40 items-center justify-center gap-3 rounded-lg px-3 py-3 text-center text-sm font-medium text-danger bg-danger/5 transition-colors cursor-pointer'
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* General Settings */}
      <div className='bg-surface-light border border-white/5 rounded-xl p-6'>
        <h2 className='text-yellow-500 font-semibold text-lg mb-6'>
          General Settings
        </h2>

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
                <h3 className='text-white font-medium'>Profile Picture</h3>
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

        {/* <div className='space-y-5'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Site Name
            </label>
            <input
              type='text'
              defaultValue='Admin Users'
              className='w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500 transition-colors'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Contact Email
            </label>
            <input
              type='email'
              defaultValue='admin@email.com'
              className='w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500 transition-colors'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Default Currency
            </label>
            <input
              type='text'
              defaultValue='USD'
              className='w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500 transition-colors'
            />
          </div>

          <div className='flex items-center gap-4 pt-4'>
            <button className='bg-gold hover:bg-gold-dark text-black font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm'>
              Save Change
            </button>
            <button className='bg-transparent border border-white/20 hover:bg-white/5 text-white font-medium py-2.5 px-6 rounded-lg transition-colors text-sm'>
              Reset
            </button>
          </div>
        </div> */}
      </div>

      <div className='bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg'>
        <p className='text-blue-200 text-xs leading-relaxed'>
          <strong>Pro Tip:</strong> Using a high-quality square image ensures
          your profile looks sharp across the dashboard.
        </p>
      </div>

      {/* Toggles */}
      {/* <div className='space-y-6 px-1'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-white font-semibold mb-1'>Low Stock Alerts</h3>
            <p className='text-white/50 text-sm'>
              Get notified when products are low in stock
            </p>
          </div>
          <button
            onClick={() => setLowStockAlerts(!lowStockAlerts)}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${lowStockAlerts ? "bg-purple-500" : "bg-white/20"}`}
          >
            <span
              className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${lowStockAlerts ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
        </div>

        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-white font-semibold mb-1'>
              New User Registration
            </h3>
            <p className='text-white/50 text-sm'>
              Receive alerts for new user signups
            </p>
          </div>
          <button
            onClick={() => setNewUserRegistration(!newUserRegistration)}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${newUserRegistration ? "bg-purple-500" : "bg-white/20"}`}
          >
            <span
              className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${newUserRegistration ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
        </div>
      </div> */}

      {/* Security Settings */}
      <div className='bg-surface-light border border-white/5 rounded-xl p-6'>
        <h2 className='text-yellow-500 font-semibold text-lg mb-6'>Security</h2>

        <div className='space-y-5'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Current Password
            </label>
            <input
              type='password'
              placeholder='********'
              className='w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500 transition-colors tracking-widest'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              New Password
            </label>
            <input
              type='password'
              placeholder='********'
              className='w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500 transition-colors tracking-widest'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Confirm New Password
            </label>
            <input
              type='password'
              placeholder='********'
              className='w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500 transition-colors tracking-widest'
            />
          </div>

          <div className='pt-4'>
            <button className='bg-gold hover:bg-gold-dark text-black font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm'>
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      {showLogoutModal && (
        <div className='fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'>
          <div
            className='w-full max-w-sm bg-surface-light border border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex flex-col items-center text-center'>
              <div className='h-12 w-12 rounded-full bg-danger/10 flex items-center justify-center text-danger mb-4'>
                <AlertCircle size={28} />
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Sign Out?</h3>
              <p className='text-white/60 text-sm mb-6'>
                Are you sure you want to log out of your account? You will need
                to sign in again to access your content.
              </p>

              <div className='flex w-full gap-3'>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className='flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors text-sm'
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSignOut}
                  className='flex-1 px-4 py-2.5 rounded-lg bg-danger text-white font-bold hover:bg-danger/90 transition-all active:scale-95 text-sm'
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
