'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingCart,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

// Mock data - will be replaced with real API calls
const mockStats = {
  totalEarnings: 1247.50,
  pendingEarnings: 328.75,
  productsInShowcase: 12,
  totalSales: 47,
  earningsChange: 23.5,
  salesChange: 15.2,
};

const mockRecentProducts = [
  {
    id: '1',
    name: 'Nutcracker Tool, Heavy Duty Pecan Walnut Plier',
    image: '/placeholder-product.jpg',
    aaRate: 0.20,
    openCollabRate: 0.12,
    price: { min: 12.99, max: 17.99 },
    stock: 2751,
    freeSample: true,
  },
  {
    id: '2',
    name: 'LED Strip Lights 50ft RGB Color Changing',
    image: '/placeholder-product.jpg',
    aaRate: 0.18,
    openCollabRate: 0.10,
    price: { min: 24.99, max: 29.99 },
    stock: 5420,
    freeSample: true,
  },
  {
    id: '3',
    name: 'Portable Blender Personal Size USB Rechargeable',
    image: '/placeholder-product.jpg',
    aaRate: 0.22,
    openCollabRate: 0.15,
    price: { min: 19.99, max: 24.99 },
    stock: 3218,
    freeSample: false,
  },
];

const mockRecentActivity = [
  {
    id: '1',
    type: 'sale',
    product: 'Nutcracker Tool',
    amount: 12.99,
    commission: 2.60,
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'added',
    product: 'LED Strip Lights',
    time: '5 hours ago',
  },
  {
    id: '3',
    type: 'sale',
    product: 'Portable Blender',
    amount: 24.99,
    commission: 5.50,
    time: '1 day ago',
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-gradient">{session?.user?.name?.split(' ')[0] || 'Creator'}</span>! 👋
          </h1>
          <p className="text-white/40 mt-2 font-medium">
            Here's your performance snapshot for today.
          </p>
        </div>
        <Link
          href="/dashboard/products"
          className="btn-primary flex items-center gap-2.5 self-start group"
        >
          <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
          <span>Explore Products</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-aa-success/10 flex items-center justify-center border border-aa-success/20 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 text-aa-success" />
            </div>
            <div className="flex flex-col items-end">
              <span className="stat-change-positive">+{mockStats.earningsChange}%</span>
              <span className="text-[10px] text-white/30 uppercase tracking-widest mt-1">vs last week</span>
            </div>
          </div>
          <div className="stat-value text-3xl">{formatCurrency(mockStats.totalEarnings)}</div>
          <div className="stat-label font-bold text-white/40 uppercase tracking-widest text-[10px]">Total Earnings</div>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center border border-aa-orange/20 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-aa-orange" />
            </div>
            <span className="text-[10px] text-white/30 uppercase tracking-widest">In Review</span>
          </div>
          <div className="stat-value text-3xl">{formatCurrency(mockStats.pendingEarnings)}</div>
          <div className="stat-label font-bold text-white/40 uppercase tracking-widest text-[10px]">Pending Payouts</div>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-aa-gold/10 flex items-center justify-center border border-aa-gold/20 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6 text-aa-gold" />
            </div>
            <span className="badge-gold">Active</span>
          </div>
          <div className="stat-value text-3xl">{mockStats.productsInShowcase}</div>
          <div className="stat-label font-bold text-white/40 uppercase tracking-widest text-[10px]">Showcase Items</div>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex flex-col items-end">
              <span className="stat-change-positive">+{mockStats.salesChange}%</span>
              <span className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Trending</span>
            </div>
          </div>
          <div className="stat-value text-3xl">{mockStats.totalSales}</div>
          <div className="stat-label font-bold text-white/40 uppercase tracking-widest text-[10px]">Total Sales</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Hot Products Section */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-aa-orange-dim">
                <Sparkles className="w-5 h-5 text-aa-orange" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Boosted Products</h2>
                <p className="text-xs text-white/40 font-medium mt-0.5">Recommended for your audience</p>
              </div>
            </div>
            <Link
              href="/dashboard/products"
              className="text-xs font-bold text-aa-orange hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {mockRecentProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex items-center gap-5 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-aa-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-20 h-20 rounded-xl bg-aa-bg-tertiary border border-white/5 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  <Package className="w-10 h-10 text-white/10" />
                </div>

                <div className="flex-1 min-w-0 relative z-10">
                  <h3 className="font-bold text-white truncate group-hover:text-aa-orange transition-colors">{product.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-aa-success/10 border border-aa-success/20">
                      <TrendingUp className="w-3 h-3 text-aa-success" />
                      <span className="text-[11px] font-bold text-aa-success">{(product.aaRate * 100).toFixed(0)}% Rate</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-aa-gold/10 border border-aa-gold/20">
                      <Sparkles className="w-3 h-3 text-aa-gold" />
                      <span className="text-[11px] font-bold text-aa-gold">+{((product.aaRate - product.openCollabRate) * 100).toFixed(0)}% Bonus</span>
                    </div>
                    {product.freeSample && (
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Free Sample</span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 relative z-10">
                  <div className="text-lg font-bold text-white">
                    ${product.price.min.toFixed(2)}
                  </div>
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                    {formatNumber(product.stock)} Left
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card h-fit">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live Feed</h2>
              <p className="text-xs text-white/40 font-medium mt-0.5">Real-time updates</p>
            </div>
          </div>

          <div className="space-y-6">
            {mockRecentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${activity.type === 'sale'
                    ? 'bg-aa-success/10 border-aa-success/20'
                    : 'bg-aa-orange/10 border-aa-orange/20'
                    }`}
                >
                  {activity.type === 'sale' ? (
                    <DollarSign className="w-5 h-5 text-aa-success" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-aa-orange" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90">
                    {activity.type === 'sale' ? (
                      <>
                        Sale: <span className="font-bold text-white">{activity.product}</span>
                      </>
                    ) : (
                      <>
                        Listed <span className="font-bold text-white">{activity.product}</span>
                      </>
                    )}
                  </p>
                  {activity.commission && (
                    <div className="inline-flex items-center gap-1.5 mt-1">
                      <span className="text-xs font-bold text-aa-success">+{formatCurrency(activity.commission)} Earned</span>
                    </div>
                  )}
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/earnings"
            className="btn-secondary w-full mt-8 py-3 text-xs flex items-center justify-center gap-2 group"
          >
            <span>Full History</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Action Hub */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/dashboard/products"
          className="card-interactive group"
        >
          <div className="w-14 h-14 rounded-2xl bg-aa-orange/10 flex items-center justify-center border border-aa-orange/20 group-hover:scale-110 transition-transform">
            <Package className="w-7 h-7 text-aa-orange" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-aa-orange transition-colors">Boost Showcase</h3>
            <p className="text-sm text-white/40 font-medium">Add high-commission products</p>
          </div>
        </Link>

        <Link
          href="/dashboard/earnings"
          className="card-interactive group"
        >
          <div className="w-14 h-14 rounded-2xl bg-aa-success/10 flex items-center justify-center border border-aa-success/20 group-hover:scale-110 transition-transform">
            <DollarSign className="w-7 h-7 text-aa-success" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-aa-success transition-colors">Payout Center</h3>
            <p className="text-sm text-white/40 font-medium">Manage your earnings & withdrawals</p>
          </div>
        </Link>

        <Link
          href="/dashboard/settings"
          className="card-interactive group"
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
            <Sparkles className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Connect TikTok</h3>
            <p className="text-sm text-white/40 font-medium">Sync with TikTok Shop Creator</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
