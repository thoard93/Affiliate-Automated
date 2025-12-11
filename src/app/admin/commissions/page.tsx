'use client';

import { DollarSign } from 'lucide-react';

export default function CommissionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Commissions</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Total Payouts</div>
          <div className="text-2xl font-bold text-white">$47,850.25</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Pending</div>
          <div className="text-2xl font-bold text-aa-gold">$8,420.50</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Company Rev</div>
          <div className="text-2xl font-bold text-aa-success">$12,450.00</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Next Payout</div>
          <div className="text-xl font-bold text-white">Dec 15, 2024</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel overflow-hidden border border-white/5 rounded-xl">
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="font-bold text-white">Recent Transactions</h2>
          <button className="btn-secondary text-xs px-3 py-1.5">Download CSV</button>
        </div>
        <div className="table-container">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Creator</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { date: 'Dec 11, 2:30 PM', creator: 'Jessica Lee', type: 'Commission', amount: 45.50, status: 'Pending' },
                { date: 'Dec 11, 1:15 PM', creator: 'David Kim', type: 'Payout', amount: -847.25, status: 'Paid' },
                { date: 'Dec 11, 11:30 AM', creator: 'Alex Thompson', type: 'Commission', amount: 12.80, status: 'Pending' },
                { date: 'Dec 10, 5:45 PM', creator: 'Sarah Johnson', type: 'Bonus', amount: 50.00, status: 'Approved' },
                { date: 'Dec 10, 2:20 PM', creator: 'Mike Chen', type: 'Commission', amount: 8.99, status: 'Pending' },
              ].map((tx, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white/60 text-sm">{tx.date}</td>
                  <td className="px-6 py-4 text-white font-medium">{tx.creator}</td>
                  <td className="px-6 py-4 text-white/80">{tx.type}</td>
                  <td className={`px-6 py-4 text-right font-mono font-medium ${tx.amount < 0 ? 'text-white/60' : 'text-aa-success'}`}>
                    {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${tx.status === 'Paid' ? 'bg-aa-gold/10 text-aa-gold border-aa-gold/20' :
                        tx.status === 'Pending' ? 'bg-white/5 text-white/60 border-white/10' :
                          'bg-aa-success/10 text-aa-success border-aa-success/20'
                      }`}>
                      {tx.status}
                    </span>
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
