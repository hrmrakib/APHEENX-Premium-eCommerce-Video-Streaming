"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [newUserRegistration, setNewUserRegistration] = useState(false);

  return (
    <div className="max-w-3xl space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-white/60 text-sm">Manage your platform preferences and configuration</p>
      </div>

      {/* General Settings */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
        <h2 className="text-yellow-500 font-semibold text-lg mb-6">General Settings</h2>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Site Name</label>
            <input 
              type="text" 
              defaultValue="Admin Users" 
              className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500 transition-colors" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Contact Email</label>
            <input 
              type="email" 
              defaultValue="admin@email.com" 
              className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500 transition-colors" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Default Currency</label>
            <input 
              type="text" 
              defaultValue="USD" 
              className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500 transition-colors" 
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button className="bg-[#D4A843] hover:bg-[#B8922F] text-black font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm">
              Save Change
            </button>
            <button className="bg-transparent border border-white/20 hover:bg-white/5 text-white font-medium py-2.5 px-6 rounded-lg transition-colors text-sm">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-6 px-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Low Stock Alerts</h3>
            <p className="text-white/50 text-sm">Get notified when products are low in stock</p>
          </div>
          <button 
            onClick={() => setLowStockAlerts(!lowStockAlerts)}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${lowStockAlerts ? 'bg-purple-500' : 'bg-white/20'}`}
          >
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${lowStockAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">New User Registration</h3>
            <p className="text-white/50 text-sm">Receive alerts for new user signups</p>
          </div>
          <button 
            onClick={() => setNewUserRegistration(!newUserRegistration)}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${newUserRegistration ? 'bg-purple-500' : 'bg-white/20'}`}
          >
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${newUserRegistration ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
        <h2 className="text-yellow-500 font-semibold text-lg mb-6">Security</h2>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Current Password</label>
            <input 
              type="password" 
              placeholder="XXXXXXXX" 
              className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500 transition-colors tracking-widest" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">New Password</label>
            <input 
              type="password" 
              placeholder="XXXXXXXX" 
              className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500 transition-colors tracking-widest" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Confirm New Password</label>
            <input 
              type="password" 
              placeholder="XXXXXXXX" 
              className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-500 transition-colors tracking-widest" 
            />
          </div>

          <div className="pt-4">
            <button className="bg-[#D4A843] hover:bg-[#B8922F] text-black font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
