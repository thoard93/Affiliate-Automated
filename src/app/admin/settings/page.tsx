'use client';

import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <div className="glass-panel rounded-xl p-12 text-center border border-white/5 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <SettingsIcon className="w-8 h-8 text-white/20" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Settings Panel</h2>
        <p className="text-white/40 max-w-sm">
          Configuration options for TikTok API, Discord bot, and notification preferences will be available here soon.
        </p>
      </div>
    </div>
  );
}
