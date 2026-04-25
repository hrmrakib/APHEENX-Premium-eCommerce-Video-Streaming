"use client";

import { useState, useEffect } from "react";
import AccountSidebar from "@/components/AccountSidebar";
import { getCurrentUser } from "@/lib/auth";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
    }
  }, []);

  const handleSave = () => {
    // In a real app, this would update the user profile
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className='mx-auto container px-4 py-8 lg:px-8'>
      <h1 className='text-3xl font-bold text-gold italic mb-8'>My Account</h1>
      <div className='flex flex-col gap-8 lg:flex-row'>
        <AccountSidebar />
        <div className='flex-1 min-w-0'>
          <h2 className='text-xl font-bold text-foreground mb-6'>Settings</h2>
          <div className='card-border bg-surface/50 p-6 max-w-lg'>
            <div className='space-y-5'>
              <div>
                <label className='block text-sm font-semibold text-foreground mb-2'>
                  Full Name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className='input-field'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-foreground mb-2'>
                  Email Address
                </label>
                <input
                  value={email}
                  disabled
                  className='input-field opacity-60 cursor-not-allowed'
                />
                <p className='text-xs text-muted mt-1'>
                  Email cannot be changed
                </p>
              </div>
              <button
                onClick={handleSave}
                className={`py-3 px-8 rounded-lg text-sm font-semibold transition-all ${saved ? "bg-success text-white" : "gold-gradient text-black hover:shadow-lg hover:shadow-gold/20"}`}
              >
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
