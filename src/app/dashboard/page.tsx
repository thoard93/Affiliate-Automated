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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Creator'}! 👋
          </h1>
          <p className="text-white/60 mt-1">
            Here's what's happening with your affiliate business
          </p>
        </div>
        <Link
          href="/dashboard/products"
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Package className="w-4 h-4" />
          Browse Products
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-aa-success/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-aa-success" />
            </div>
            <span className="stat-change-positive">+{mockStats.earningsChange}%</span>
          </div>
          <div className="stat-value">{formatCurrency(mockStats.totalEarnings)}</div>
          <div className="stat-label">Total Earnings</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-aa-orange/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-aa-orange" />
            </div>
          </div>
          <div className="stat-value">{formatCurrency(mockStats.pendingEarnings)}</div>
          <div className="stat-label">Pending Earnings</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-aa-gold/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-aa-gold" />
            </div>
          </div>
          <div className="stat-value">{mockStats.productsInShowcase}</div>
          <div className="stat-label">Products in Showcase</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-purple-400" />
            </div>
            <span className="stat-change-positive">+{mockStats.salesChange}%</span>
          </div>
          <div className="stat-value">{mockStats.totalSales}</div>
          <div className="stat-label">Total Sales</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Hot Products */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-aa-orange" />
              <h2 className="text-lg font-semibold text-white">Hot Products</h2>
            </div>
            <Link
              href="/dashboard/products"
              className="text-sm text-aa-orange hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {mockRecentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-aa-dark-600 hover:bg-aa-dark-400 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 rounded-lg bg-aa-dark-400 flex items-center justify-center overflow-hidden">
                  <Package className="w-8 h-8 text-white/20" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">{product.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm">
                    <span className="text-aa-success">
                      {(product.aaRate * 100).toFixed(0)}% AA Rate
                    </span>
                    <span className="text-white/40">
                      vs {(product.openCollabRate * 100).toFixed(0)}% Open
                    </span>
                    <span className="badge-gold">
                      +{((product.aaRate - product.openCollabRate) * 100).toFixed(0)}% Bonus
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">
                    ${product.price.min.toFixed(2)}
                  </div>
                  <div className="text-xs text-white/40">
                    {formatNumber(product.stock)} in stock
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-aa-orange" />
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
                    activity.type === 'sale'
                      ? 'bg-aa-success/10'
                      : 'bg-aa-orange/10'
                  }`}
                >
                  {activity.type === 'sale' ? (
                    <DollarSign className="w-4 h-4 text-aa-success" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-aa-orange" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    {activity.type === 'sale' ? (
                      <>
                        Sale on <span className="font-medium">{activity.product}</span>
                      </>
                    ) : (
                      <>
                        Added <span className="font-medium">{activity.product}</span> to showcase
                      </>
                    )}
                  </p>
                  {activity.commission && (
                    <p className="text-sm text-aa-success mt-0.5">
                      +{formatCurrency(activity.commission)} commission
                    </p>
                  )}
                  <p className="text-xs text-white/40 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/earnings"
            className="block mt-4 text-center text-sm text-aa-orange hover:underline"
          >
            View all activity →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/dashboard/products"
          className="card-interactive flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center">
            <Package className="w-6 h-6 text-aa-orange" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Browse Products</h3>
            <p className="text-sm text-white/60">213+ boosted products available</p>
          </div>
        </Link>

        <Link
          href="/dashboard/earnings"
          className="card-interactive flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-aa-success/10 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-aa-success" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Track Earnings</h3>
            <p className="text-sm text-white/60">View commissions & payouts</p>
          </div>
        </Link>

        <Link
          href="/dashboard/settings"
          className="card-interactive flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Connect TikTok</h3>
            <p className="text-sm text-white/60">Link your TikTok Shop account</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
