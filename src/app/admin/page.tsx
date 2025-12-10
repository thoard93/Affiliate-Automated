'use client';

import Link from 'next/link';
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserPlus,
  ShoppingCart,
  Send,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatRelativeTime } from '@/lib/utils';

// Mock admin data
const mockAdminStats = {
  totalCreators: 218,
  pendingApprovals: 12,
  activeCreators: 186,
  totalProducts: 213,
  totalCommissionsPaid: 47850.25,
  pendingCommissions: 8420.50,
  thisMonthSales: 156,
  thisMonthRevenue: 12480.00,
};

const mockPendingCreators = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    discordUsername: 'sarahj#1234',
    appliedAt: '2024-12-08T10:30:00Z',
    followers: 45000,
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    discordUsername: 'mikechen#5678',
    appliedAt: '2024-12-08T09:15:00Z',
    followers: 28000,
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@example.com',
    discordUsername: 'emilyd#9012',
    appliedAt: '2024-12-07T16:45:00Z',
    followers: 67000,
  },
];

const mockRecentActivity = [
  {
    id: '1',
    type: 'creator_approved',
    creator: 'Alex Thompson',
    time: '30 minutes ago',
  },
  {
    id: '2',
    type: 'product_added',
    product: 'Wireless Charger Stand',
    time: '1 hour ago',
  },
  {
    id: '3',
    type: 'sale',
    creator: 'Jessica Lee',
    amount: 24.99,
    commission: 5.50,
    time: '2 hours ago',
  },
  {
    id: '4',
    type: 'payout_sent',
    creator: 'David Kim',
    amount: 847.25,
    time: '3 hours ago',
  },
];

const mockTopCreators = [
  { id: '1', name: 'Jessica Lee', sales: 47, revenue: 1892.50, commission: 416.35 },
  { id: '2', name: 'David Kim', sales: 42, revenue: 1654.00, commission: 363.88 },
  { id: '3', name: 'Alex Thompson', sales: 38, revenue: 1428.75, commission: 314.33 },
  { id: '4', name: 'Maria Garcia', sales: 35, revenue: 1312.00, commission: 288.64 },
  { id: '5', name: 'Chris Wilson', sales: 31, revenue: 1156.25, commission: 254.38 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/60 mt-1">
            Overview of Affiliate Automated platform
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/creators" className="btn-secondary flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            {mockAdminStats.pendingApprovals} Pending
          </Link>
          <Link href="/admin/products/import" className="btn-primary flex items-center gap-2">
            <Package className="w-4 h-4" />
            Import Products
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <span className="badge bg-yellow-400/10 text-yellow-400">
              {mockAdminStats.pendingApprovals} pending
            </span>
          </div>
          <div className="stat-value">{formatNumber(mockAdminStats.totalCreators)}</div>
          <div className="stat-label">Total Creators</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-aa-orange/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-aa-orange" />
            </div>
          </div>
          <div className="stat-value">{mockAdminStats.totalProducts}</div>
          <div className="stat-label">Active Products</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-aa-success/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-aa-success" />
            </div>
          </div>
          <div className="stat-value">{formatCurrency(mockAdminStats.totalCommissionsPaid)}</div>
          <div className="stat-label">Total Commissions Paid</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-aa-gold/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-aa-gold" />
            </div>
            <span className="stat-change-positive flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              18%
            </span>
          </div>
          <div className="stat-value">{mockAdminStats.thisMonthSales}</div>
          <div className="stat-label">Sales This Month</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold text-white">Pending Approvals</h2>
              <span className="badge bg-yellow-400/10 text-yellow-400">
                {mockPendingCreators.length}
              </span>
            </div>
            <Link
              href="/admin/creators?status=pending"
              className="text-sm text-purple-400 hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {mockPendingCreators.map((creator) => (
              <div
                key={creator.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-aa-dark-600"
              >
                <div className="w-12 h-12 rounded-full bg-aa-dark-400 flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {creator.name[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white">{creator.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <span>{creator.discordUsername}</span>
                    <span>•</span>
                    <span>{formatNumber(creator.followers)} followers</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-aa-success/10 text-aa-success hover:bg-aa-success/20 transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          </div>

          <div className="space-y-4">
            {mockRecentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'creator_approved'
                      ? 'bg-aa-success/10'
                      : activity.type === 'product_added'
                      ? 'bg-aa-orange/10'
                      : activity.type === 'sale'
                      ? 'bg-purple-500/10'
                      : 'bg-aa-gold/10'
                  }`}
                >
                  {activity.type === 'creator_approved' && (
                    <CheckCircle2 className="w-4 h-4 text-aa-success" />
                  )}
                  {activity.type === 'product_added' && (
                    <Package className="w-4 h-4 text-aa-orange" />
                  )}
                  {activity.type === 'sale' && (
                    <ShoppingCart className="w-4 h-4 text-purple-400" />
                  )}
                  {activity.type === 'payout_sent' && (
                    <Send className="w-4 h-4 text-aa-gold" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    {activity.type === 'creator_approved' && (
                      <>
                        <span className="font-medium">{activity.creator}</span> approved
                      </>
                    )}
                    {activity.type === 'product_added' && (
                      <>
                        Added <span className="font-medium">{activity.product}</span>
                      </>
                    )}
                    {activity.type === 'sale' && (
                      <>
                        <span className="font-medium">{activity.creator}</span> made a sale
                      </>
                    )}
                    {activity.type === 'payout_sent' && (
                      <>
                        Payout sent to <span className="font-medium">{activity.creator}</span>
                      </>
                    )}
                  </p>
                  {activity.commission && (
                    <p className="text-sm text-aa-success mt-0.5">
                      +{formatCurrency(activity.commission)} commission
                    </p>
                  )}
                  {activity.amount && activity.type === 'payout_sent' && (
                    <p className="text-sm text-aa-gold mt-0.5">
                      {formatCurrency(activity.amount)}
                    </p>
                  )}
                  <p className="text-xs text-white/40 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Creators */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-aa-gold" />
            <h2 className="text-lg font-semibold text-white">Top Creators This Month</h2>
          </div>
          <Link
            href="/admin/creators"
            className="text-sm text-purple-400 hover:underline flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Creator</th>
                <th>Sales</th>
                <th>Revenue</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {mockTopCreators.map((creator, index) => (
                <tr key={creator.id}>
                  <td>
                    <span
                      className={`w-8 h-8 rounded-full inline-flex items-center justify-center font-bold ${
                        index === 0
                          ? 'bg-aa-gold/20 text-aa-gold'
                          : index === 1
                          ? 'bg-gray-300/20 text-gray-300'
                          : index === 2
                          ? 'bg-orange-400/20 text-orange-400'
                          : 'bg-white/5 text-white/60'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-aa-dark-400 flex items-center justify-center">
                        <span className="font-medium text-white">{creator.name[0]}</span>
                      </div>
                      <span className="font-medium text-white">{creator.name}</span>
                    </div>
                  </td>
                  <td className="text-white">{creator.sales}</td>
                  <td className="text-white">{formatCurrency(creator.revenue)}</td>
                  <td className="text-aa-success font-medium">
                    {formatCurrency(creator.commission)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/creators" className="card-interactive flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Manage Creators</h3>
            <p className="text-sm text-white/60">View & approve</p>
          </div>
        </Link>

        <Link href="/admin/products" className="card-interactive flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center">
            <Package className="w-6 h-6 text-aa-orange" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Product Catalog</h3>
            <p className="text-sm text-white/60">Manage products</p>
          </div>
        </Link>

        <Link href="/admin/commissions" className="card-interactive flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-aa-success/10 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-aa-success" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Commissions</h3>
            <p className="text-sm text-white/60">Track & pay out</p>
          </div>
        </Link>

        <Link href="/admin/settings" className="card-interactive flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-aa-gold/10 flex items-center justify-center">
            <Send className="w-6 h-6 text-aa-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Discord Bot</h3>
            <p className="text-sm text-white/60">Configure alerts</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
