'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

// Mock earnings data
const mockEarningsSummary = {
  totalEarnings: 3847.25,
  pendingEarnings: 528.75,
  paidEarnings: 3318.50,
  thisMonth: 892.30,
  lastMonth: 724.15,
  monthlyChange: 23.2,
};

const mockCommissions = [
  {
    id: '1',
    orderId: 'TT-2024-001234',
    productName: 'Nutcracker Tool, Heavy Duty Pecan Walnut Plier',
    orderAmount: 17.99,
    commissionRate: 0.20,
    commissionAmount: 3.60,
    status: 'CONFIRMED',
    createdAt: '2024-12-08T14:30:00Z',
  },
  {
    id: '2',
    orderId: 'TT-2024-001235',
    productName: 'LED Strip Lights 50ft RGB Color Changing',
    orderAmount: 29.99,
    commissionRate: 0.18,
    commissionAmount: 5.40,
    status: 'PENDING',
    createdAt: '2024-12-08T10:15:00Z',
  },
  {
    id: '3',
    orderId: 'TT-2024-001236',
    productName: 'Portable Blender Personal Size USB Rechargeable',
    orderAmount: 24.99,
    commissionRate: 0.22,
    commissionAmount: 5.50,
    status: 'CONFIRMED',
    createdAt: '2024-12-07T16:45:00Z',
  },
  {
    id: '4',
    orderId: 'TT-2024-001237',
    productName: 'Wireless Earbuds Bluetooth 5.3',
    orderAmount: 34.99,
    commissionRate: 0.15,
    commissionAmount: 5.25,
    status: 'PAID',
    createdAt: '2024-12-06T09:20:00Z',
  },
  {
    id: '5',
    orderId: 'TT-2024-001238',
    productName: 'Yoga Mat Extra Thick Non-Slip',
    orderAmount: 39.99,
    commissionRate: 0.25,
    commissionAmount: 10.00,
    status: 'CANCELLED',
    createdAt: '2024-12-05T11:30:00Z',
  },
];

const mockPayouts = [
  {
    id: '1',
    amount: 1247.50,
    status: 'COMPLETED',
    method: 'PayPal',
    processedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: '2',
    amount: 892.30,
    status: 'COMPLETED',
    method: 'PayPal',
    processedAt: '2024-11-01T00:00:00Z',
  },
  {
    id: '3',
    amount: 1178.70,
    status: 'COMPLETED',
    method: 'Bank Transfer',
    processedAt: '2024-10-01T00:00:00Z',
  },
];

const statusConfig = {
  PENDING: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: CheckCircle2 },
  PAID: { label: 'Paid', color: 'text-aa-success', bg: 'bg-aa-success/10', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle },
};

export default function EarningsPage() {
  const [activeTab, setActiveTab] = useState<'commissions' | 'payouts'>('commissions');
  const [dateRange, setDateRange] = useState('30d');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCommissions = mockCommissions.filter((c) =>
    statusFilter === 'all' ? true : c.status === statusFilter
  );

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Financial <span className="text-gradient">Overview</span>
          </h1>
          <p className="text-white/40 mt-2 font-medium">
            Track your commission history and upcoming payouts.
          </p>
        </div>
        <button className="btn-secondary flex items-center gap-2.5 px-6 h-12 hover:bg-white/5 transition-all">
          <Download className="w-4 h-4" />
          <span className="font-bold uppercase tracking-widest text-xs">Export Report</span>
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-aa-success/10 flex items-center justify-center border border-aa-success/20 group-hover:scale-110 transition-all duration-500">
              <DollarSign className="w-6 h-6 text-aa-success" />
            </div>
          </div>
          <div className="stat-value text-3xl font-black mb-1">{formatCurrency(mockEarningsSummary.totalEarnings)}</div>
          <div className="stat-label font-bold text-white/30 uppercase tracking-widest text-[10px]">Total Revenue</div>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20 group-hover:scale-110 transition-all duration-500">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest animate-pulse">Pending Review</span>
          </div>
          <div className="stat-value text-3xl font-black mb-1">{formatCurrency(mockEarningsSummary.pendingEarnings)}</div>
          <div className="stat-label font-bold text-white/30 uppercase tracking-widest text-[10px]">Locked Commissions</div>
        </div>

        <div className="stat-card group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-aa-orange/5 blur-3xl rounded-full -mr-16 -mt-16" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center border border-aa-orange/20 group-hover:scale-110 transition-all duration-500">
              <TrendingUp className="w-6 h-6 text-aa-orange" />
            </div>
            <div className="flex flex-col items-end">
              <span className="stat-change-positive font-black">+{mockEarningsSummary.monthlyChange}%</span>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Growth</span>
            </div>
          </div>
          <div className="stat-value text-3xl font-black mb-1 relative z-10">{formatCurrency(mockEarningsSummary.thisMonth)}</div>
          <div className="stat-label font-bold text-white/30 uppercase tracking-widest text-[10px] relative z-10">Earnings This Month</div>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-aa-gold/10 flex items-center justify-center border border-aa-gold/20 group-hover:scale-110 transition-all duration-500">
              <CheckCircle2 className="w-6 h-6 text-aa-gold" />
            </div>
          </div>
          <div className="stat-value text-3xl font-black mb-1">{formatCurrency(mockEarningsSummary.paidEarnings)}</div>
          <div className="stat-label font-bold text-white/30 uppercase tracking-widest text-[10px]">Successfully Withdrawn</div>
        </div>
      </div>

      {/* Tabs / Segmented Control */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-1">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('commissions')}
              className={cn(
                'pb-4 text-sm font-bold uppercase tracking-[0.2em] transition-all relative',
                activeTab === 'commissions'
                  ? 'text-aa-orange'
                  : 'text-white/30 hover:text-white/60'
              )}
            >
              Commissions
              {activeTab === 'commissions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-aa-orange shadow-[0_0_12px_rgba(255,107,0,0.5)]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={cn(
                'pb-4 text-sm font-bold uppercase tracking-[0.2em] transition-all relative',
                activeTab === 'payouts'
                  ? 'text-aa-orange'
                  : 'text-white/30 hover:text-white/60'
              )}
            >
              Payout History
              {activeTab === 'payouts' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-aa-orange shadow-[0_0_12px_rgba(255,107,0,0.5)]" />
              )}
            </button>
          </div>
        </div>

        {activeTab === 'commissions' ? (
          <div className="space-y-6 animate-fade-in-up">
            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative group">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="h-11 pl-4 pr-10 bg-aa-bg-secondary/40 border border-white/10 rounded-xl text-sm font-bold text-white/60 focus:text-white focus:border-aa-orange/40 focus:bg-aa-bg-secondary transition-all appearance-none cursor-pointer outline-none"
                  >
                    <option value="7d text-black">Last 7 days</option>
                    <option value="30d text-black">Last 30 days</option>
                    <option value="90d text-black">Last 90 days</option>
                    <option value="all text-black">All time</option>
                  </select>
                  <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none group-hover:text-aa-orange transition-colors" />
                </div>

                <div className="relative group">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-11 pl-4 pr-10 bg-aa-bg-secondary/40 border border-white/10 rounded-xl text-sm font-bold text-white/60 focus:text-white focus:border-aa-orange/40 focus:bg-aa-bg-secondary transition-all appearance-none cursor-pointer outline-none"
                  >
                    <option value="all text-black">All Status</option>
                    <option value="PENDING text-black">Pending</option>
                    <option value="CONFIRMED text-black">Confirmed</option>
                    <option value="PAID text-black">Paid</option>
                    <option value="CANCELLED text-black">Cancelled</option>
                  </select>
                  <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none group-hover:text-aa-orange transition-colors" />
                </div>
              </div>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                Found {filteredCommissions.length} Transactions
              </p>
            </div>

            {/* Commissions List / Table */}
            <div className="card p-0 overflow-hidden border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Transaction / Product</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Order</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Rate</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Commission</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest text-center">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {filteredCommissions.map((commission) => {
                      const status = statusConfig[commission.status as keyof typeof statusConfig];
                      const StatusIcon = status.icon;
                      return (
                        <tr key={commission.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-aa-orange/20 transition-colors">
                                <Package className="w-5 h-5 text-white/20 group-hover:text-aa-orange transition-colors" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-white truncate max-w-[280px] group-hover:text-aa-orange transition-colors">
                                  {commission.productName}
                                </p>
                                <p className="text-[10px] font-mono text-white/20 mt-0.5">{commission.orderId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right font-black text-white/80">
                            {formatCurrency(commission.orderAmount)}
                          </td>
                          <td className="px-6 py-5 text-right font-black text-aa-orange">
                            {(commission.commissionRate * 100).toFixed(0)}%
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className="text-base font-black text-aa-success">
                              {formatCurrency(commission.commissionAmount)}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex justify-center">
                              <span className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest', status.bg, status.color)}>
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right text-xs font-bold text-white/30">
                            {formatDate(commission.createdAt, 'MMM d, h:mm a')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredCommissions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <DollarSign className="w-12 h-12 text-white/20 mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">No commissions found</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Payouts Tab */
          <div className="space-y-8 animate-fade-in-up">
            {/* Payout Summary Card */}
            <div className="card relative overflow-hidden group border-aa-orange/20 bg-aa-orange/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-aa-orange/10 blur-[100px] rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-125" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 py-2">
                <div className="w-16 h-16 rounded-2xl bg-aa-orange/10 flex items-center justify-center border border-aa-orange/30 shadow-2xl shadow-aa-orange/20">
                  <Calendar className="w-8 h-8 text-aa-orange animate-pulse" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-black text-white mb-1">Next Expected Payment</h3>
                  <p className="text-sm font-bold text-white/40 uppercase tracking-widest">
                    Scheduled for Jan 01, 2025 • Approx. {formatCurrency(mockEarningsSummary.pendingEarnings)}
                  </p>
                </div>
                <div className="text-center md:text-right px-8 py-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Threshold Status</p>
                  <p className="text-2xl font-black text-aa-success">$50.00 Minimum</p>
                </div>
              </div>
            </div>

            {/* Payouts Table */}
            <div className="card p-0 overflow-hidden border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Payout Reference</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Payment Method</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest text-center">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Processed On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {mockPayouts.map((payout) => (
                      <tr key={payout.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-6">
                          <span className="font-mono text-xs font-bold text-white/50 group-hover:text-aa-orange transition-colors">
                            PAY-{payout.id.padStart(6, '0')}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-aa-gold" />
                            <span className="text-sm font-black text-white/80">{payout.method}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className="px-3 py-1.5 bg-aa-success/10 border border-aa-success/20 rounded-lg text-[10px] font-black text-aa-success uppercase tracking-widest">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <span className="text-xl font-black text-white group-hover:text-aa-success transition-colors">
                            {formatCurrency(payout.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right text-xs font-bold text-white/30">
                          {formatDate(payout.processedAt, 'MMM d, yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
  );
}
