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
  ShoppingCart,
  Send,
  UserPlus,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatRelativeTime } from '@/lib/utils';
import { getDashboardStats, getPendingCreators, getRecentActivity } from '@/actions/analytics';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const pendingCreators = await getPendingCreators();
  const recentActivity = await getRecentActivity();

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
            {stats.pendingApprovals} Pending
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
              {stats.pendingApprovals} pending
            </span>
          </div>
          <div className="stat-value">{formatNumber(stats.totalCreators)}</div>
          <div className="stat-label">Total Creators</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-aa-orange/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-aa-orange" />
            </div>
          </div>
          <div className="stat-value">{formatNumber(stats.activeProducts)}</div>
          <div className="stat-label">Active Products</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-aa-success/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-aa-success" />
            </div>
          </div>
          <div className="stat-value">{formatCurrency(stats.totalCommissionsPaid)}</div>
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
          <div className="stat-value">{stats.thisMonthSales}</div>
          <div className="stat-label">Sales This Month</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <div className="lg:col-span-2 glass-panel border border-white/5 rounded-xl overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-aa-gold" />
              <h2 className="text-lg font-bold text-white">Pending Approvals</h2>
              <span className="badge bg-aa-gold/10 text-aa-gold ml-2">
                {stats.pendingApprovals}
              </span>
            </div>
            <Link
              href="/admin/creators?status=pending"
              className="text-sm text-white/60 hover:text-white flex items-center gap-1 transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="table-container">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Creator</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Discord</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">Followers</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingCreators.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-white/40">No pending approvals</td>
                  </tr>
                ) : (
                  pendingCreators.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                            {(user.name || '?')[0]}
                          </div>
                          <div className="font-medium text-white">{user.name || 'Unknown'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/60 font-mono text-sm">{user.creator?.discordUsername || 'N/A'}</td>
                      <td className="px-6 py-4 text-center text-white/80">{formatNumber(user.creator?.followerCount || 0)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/creators?approve=${user.id}`} className="p-1.5 rounded-lg hover:bg-aa-success/20 text-aa-success transition-colors">
                            <CheckCircle2 className="w-5 h-5" />
                          </Link>
                          <Link href={`/admin/creators?reject=${user.id}`} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
                            <XCircle className="w-5 h-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          </div>

          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center text-white/40 py-4">No recent activity</div>
            ) : (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${activity.type === 'creator_approved'
                      ? 'bg-aa-success/10'
                      : activity.type === 'product_added'
                        ? 'bg-aa-orange/10'
                        : activity.type === 'sale'
                          ? 'bg-purple-500/10'
                          : 'bg-aa-gold/10'
                      }`}
                  >
                    {activity.type === 'sale' && (
                      <ShoppingCart className="w-4 h-4 text-purple-400" />
                    )}
                    {/* Add other icons if we enable those activity types */}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      {activity.type === 'sale' && (
                        <>
                          <span className="font-medium">{activity.creator}</span> made a sale
                        </>
                      )}
                    </p>
                    {activity.commission && (
                      <p className="text-sm text-aa-success mt-0.5">
                        +{formatCurrency(activity.commission)} commission
                      </p>
                    )}
                    <p className="text-xs text-white/40 mt-1">{formatRelativeTime(activity.time || new Date())}</p>
                  </div>
                </div>
              ))
            )}
          </div>
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
