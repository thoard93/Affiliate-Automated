'use client';

import { DollarSign } from 'lucide-react';

export default function CommissionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Commissions</h1>
      <div className="glass-panel rounded-xl p-12 text-center border border-white/5 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-aa-gold/10 flex items-center justify-center mb-6">
          <DollarSign className="w-8 h-8 text-aa-gold" />
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">Commission Tracking</h2>
        <p className="text-white/40 max-w-sm">
          Real-time commission tracking and payout history will be displayed here once your TikTok Shop account is fully connected.
        </p>
      </div>
    </div>
  );
}
