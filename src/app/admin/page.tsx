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
  ArrowUpRight,
  Target,
  Shield,
} from 'lucide-react';
import { cn, formatCurrency, formatNumber, formatRelativeTime } from '@/lib/utils';
import { getDashboardStats, getPendingCreators, getRecentActivity } from '@/actions/analytics';
import DashboardCharts from './DashboardCharts';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const pendingCreators = await getPendingCreators();
  const recentActivity = await getRecentActivity();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-aa-orange font-bold text-xs uppercase tracking-[0.2em] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-aa-orange animate-pulse" />
            System Status: Active
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Platform <span className="text-gradient">Overview</span>
          </h1>
          <p className="text-white/40 text-sm md:text-base max-w-lg">
            Monitor creator performance, product velocity, and commission distributions in real-time.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/admin/creators" className="btn-secondary py-3 px-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-aa-gold" />
            <span className="text-white/80">{stats.pendingApprovals} Pending Approvals</span>
          </Link>
          <Link href="/admin/products/import" className="btn-primary py-3 px-6 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Import Catalog
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Creators', value: formatNumber(stats.totalCreators), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', trend: '+12%', trendPos: true },
          { label: 'Active Products', value: formatNumber(stats.activeProducts), icon: Package, color: 'text-aa-orange', bg: 'bg-aa-orange/10', trend: '+5%', trendPos: true },
          { label: 'Paid Commissions', value: formatCurrency(stats.totalCommissionsPaid), icon: Target, color: 'text-green-400', bg: 'bg-green-400/10', trend: '+22%', trendPos: true },
          { label: 'Monthly Sales', value: stats.thisMonthSales, icon: ShoppingCart, color: 'text-purple-400', bg: 'bg-purple-400/10', trend: '-2%', trendPos: false },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 flex flex-col group h-full">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={cn(
                "text-[10px] font-bold px-2 py-1 rounded-full",
                stat.trendPos ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
              )}>
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</div>
              <div className="text-sm font-semibold text-white/40 tracking-wide uppercase">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Analytics & Activity */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-32 h-32 text-aa-orange" />
          </div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Revenue Trends</h2>
              <p className="text-sm text-white/40">Commission growth over last 7 days</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-md bg-white/5 text-xs font-bold text-white/60 hover:text-white transition-colors">D</button>
              <button className="px-3 py-1 rounded-md bg-aa-orange/20 text-xs font-bold text-aa-orange border border-aa-orange/20">W</button>
              <button className="px-3 py-1 rounded-md bg-white/5 text-xs font-bold text-white/60 hover:text-white transition-colors">M</button>
            </div>
          </div>

          <DashboardCharts />
        </div>

        {/* Real-time Activity */}
        <div className="glass-panel p-8 rounded-2xl bg-aa-bg-secondary/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Activity</h2>
            <div className="w-2 h-2 rounded-full bg-aa-orange animate-ping" />
          </div>

          <div className="space-y-6">
            {recentActivity.length === 0 ? (
              <div className="text-center text-white/20 py-10 flex flex-col items-center gap-3">
                <Target className="w-12 h-12 opacity-20" />
                <p className="text-sm">Listening for network activity...</p>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4 group">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mt-1 transition-all group-hover:scale-110",
                    activity.type === 'sale' ? 'bg-green-400/10' : 'bg-purple-400/10'
                  )}>
                    {activity.type === 'sale' ? (
                      <ShoppingCart className="w-5 h-5 text-green-400" />
                    ) : (
                      <UserPlus className="w-5 h-5 text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-white tracking-wide">
                        {activity.type === 'sale' ? 'New Conversion' : 'New Creator Sign-up'}
                      </p>
                      <span className="text-[10px] text-white/30 font-bold uppercase">{formatRelativeTime(activity.time || new Date())}</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {activity.type === 'sale' ? (
                        <><span className="text-white font-medium">{activity.creator}</span> secured a sale.</>
                      ) : (
                        <><span className="text-white font-medium">{activity.creator}</span> joined the waitlist.</>
                      )}
                    </p>
                    {activity.commission && (
                      <div className="flex items-center gap-1 text-[11px] text-green-400 font-bold mt-1">
                        <ArrowUpRight className="w-3 h-3" />
                        +{formatCurrency(activity.commission)} Earned
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="w-full mt-8 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all">
            VIEW FULL AUDIT LOG
          </button>
        </div>
      </div>

      {/* Approval Queue Section */}
      <div className="glass-panel overflow-hidden rounded-2xl border border-white/5">
        <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Creator Approval Queue</h2>
            <p className="text-sm text-white/40 mt-1 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {stats.pendingApprovals} creators awaiting manual vetting
            </p>
          </div>
          <Link
            href="/admin/creators?status=pending"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-sm font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            Review All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-4 text-left text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Partner</th>
                <th className="px-8 py-4 text-left text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Contact / Social</th>
                <th className="px-8 py-4 text-center text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Audience</th>
                <th className="px-8 py-4 text-right text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pendingCreators.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-white/20">
                      <Shield className="w-12 h-12 opacity-10" />
                      <p className="text-sm font-medium">No pending applications found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pendingCreators.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-all duration-300">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aa-orange-dim to-purple-500/10 flex items-center justify-center text-sm font-extrabold text-white border border-white/5">
                          {(user.name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white tracking-tight">{user.name || 'Anonymous Creator'}</p>
                          <p className="text-[10px] text-white/40 font-mono mt-0.5">{user.email || 'no-email@provided.com'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white/80">{user.creator?.discordUsername || 'Discord Unknown'}</span>
                        <span className="text-[10px] text-white/30 truncate mt-1">@TikTok Handle Placeholder</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-block px-3 py-1 rounded-full bg-aa-orange-dim text-aa-orange text-[11px] font-bold border border-aa-orange/20">
                        {formatNumber(user.creator?.followerCount || 0)} <span className="opacity-60 ml-0.5">Fans</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/creators?approve=${user.id}`} title="Approve Partner" className="p-2 rounded-xl bg-green-400/10 text-green-400 hover:bg-green-400 hover:text-black transition-all">
                          <CheckCircle2 className="w-5 h-5" />
                        </Link>
                        <Link href={`/admin/creators?reject=${user.id}`} title="Reject Application" className="p-2 rounded-xl bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-black transition-all">
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
    </div>
  );
}
