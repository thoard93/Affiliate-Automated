'use client';

import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <div className="grid gap-6">
        {/* TikTok API Configuration */}
        <div className="glass-panel p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#E6425E]/10 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-[#E6425E]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">TikTok Shop API</h2>
              <p className="text-white/40 text-sm">Manage your connection to TikTok Shop Partner Center</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">App Key</label>
                <input type="text" value="72839401928374" disabled className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white font-mono opacity-60 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">App Secret</label>
                <input type="password" value="************************" disabled className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white font-mono opacity-60 cursor-not-allowed" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-semibold text-sm">API Connected & Syncing</span>
              </div>
              <button className="text-xs text-white/60 hover:text-white underline">Refresh Token</button>
            </div>
          </div>
        </div>

        {/* Global Configuration */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4">Commission Defaults</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-white/80">Default Boost Rate</label>
                <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-white text-sm">
                  <option>5%</option>
                  <option>6%</option>
                  <option>8%</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-white/80">Creator Fee</label>
                <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-white text-sm">
                  <option>0% (Free)</option>
                  <option>10%</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80">New Creator Applications</span>
                <div className="w-10 h-6 bg-aa-orange rounded-full flex items-center p-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" /></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">High Value Sales Alert</span>
                <div className="w-10 h-6 bg-white/10 rounded-full flex items-center p-1 cursor-pointer"><div className="w-4 h-4 bg-white/40 rounded-full shadow-sm" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
