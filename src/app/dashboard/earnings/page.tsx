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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Earnings</h1>
          <p className="text-white/60 mt-1">
            Track your commissions and payouts
          </p>
        </div>
        <button className="btn-secondary flex items-center gap-2 self-start">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-aa-success/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-aa-success" />
            </div>
          </div>
          <div className="stat-value">{formatCurrency(mockEarningsSummary.totalEarnings)}</div>
          <div className="stat-label">Total Earnings</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <div className="stat-value">{formatCurrency(mockEarningsSummary.pendingEarnings)}</div>
          <div className="stat-label">Pending</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-aa-orange/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-aa-orange" />
            </div>
            <span className="stat-change-positive flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {mockEarningsSummary.monthlyChange}%
            </span>
          </div>
          <div className="stat-value">{formatCurrency(mockEarningsSummary.thisMonth)}</div>
          <div className="stat-label">This Month</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="stat-value">{formatCurrency(mockEarningsSummary.paidEarnings)}</div>
          <div className="stat-label">Total Paid Out</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-aa-dark-500 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('commissions')}
          className={cn(
            'px-6 py-2.5 rounded-md text-sm font-medium transition-all',
            activeTab === 'commissions'
              ? 'bg-aa-orange text-white shadow-aa'
              : 'text-white/60 hover:text-white'
          )}
        >
          Commissions
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={cn(
            'px-6 py-2.5 rounded-md text-sm font-medium transition-all',
            activeTab === 'payouts'
              ? 'bg-aa-orange text-white shadow-aa'
              : 'text-white/60 hover:text-white'
          )}
        >
          Payouts
        </button>
      </div>

      {activeTab === 'commissions' ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="input-field pr-10 appearance-none cursor-pointer"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field pr-10 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PAID">Paid</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>

          {/* Commissions Table */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Product</th>
                  <th>Order Amount</th>
                  <th>Rate</th>
                  <th>Commission</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommissions.map((commission) => {
                  const status = statusConfig[commission.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={commission.id}>
                      <td>
                        <span className="font-mono text-xs text-white/60">
                          {commission.orderId}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-aa-dark-400 flex items-center justify-center">
                            <Package className="w-5 h-5 text-white/20" />
                          </div>
                          <span className="font-medium text-white truncate max-w-[200px]">
                            {commission.productName}
                          </span>
                        </div>
                      </td>
                      <td className="text-white">
                        {formatCurrency(commission.orderAmount)}
                      </td>
                      <td className="text-aa-orange">
                        {(commission.commissionRate * 100).toFixed(0)}%
                      </td>
                      <td className="text-aa-success font-medium">
                        {formatCurrency(commission.commissionAmount)}
                      </td>
                      <td>
                        <span className={cn('badge', status.bg, status.color)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </span>
                      </td>
                      <td className="text-white/60">
                        {formatDate(commission.createdAt, 'MMM d, h:mm a')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCommissions.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No commissions found</p>
            </div>
          )}
        </>
      ) : (
        /* Payouts Tab */
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Payout ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {mockPayouts.map((payout) => (
                  <tr key={payout.id}>
                    <td>
                      <span className="font-mono text-xs text-white/60">
                        PAY-{payout.id.padStart(6, '0')}
                      </span>
                    </td>
                    <td className="text-aa-success font-semibold text-lg">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="text-white">{payout.method}</td>
                    <td>
                      <span className="badge bg-aa-success/10 text-aa-success">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completed
                      </span>
                    </td>
                    <td className="text-white/60">
                      {formatDate(payout.processedAt, 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Next Payout Info */}
          <div className="card border-aa-orange/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-aa-orange" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Next Payout</h3>
                <p className="text-sm text-white/60">
                  Estimated January 1, 2025 • {formatCurrency(mockEarningsSummary.pendingEarnings)} pending
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/60">Minimum payout</p>
                <p className="font-medium text-white">$50.00</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
