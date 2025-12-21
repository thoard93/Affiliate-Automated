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
  Zap,
  Star,
  Users,
} from 'lucide-react';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';

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
    <div className="relative space-y-12 pb-20">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-aa-orange-dim/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] bg-purple-500/[0.03] rounded-full blur-[100px] animate-pulse-glow delay-1000" />
      </div>

      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 relative z-10">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md">
              <span className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase">Creator Intelligence v2.0</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-aa-success animate-ping" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
            Welcome, <span className="text-gradient drop-shadow-2xl">{session?.user?.name?.split(' ')[0] || 'Creator'}</span>.
          </h1>
          <p className="text-white/40 mt-3 font-bold uppercase tracking-widest text-[10px] max-w-lg">
            Your network is scaling. Exclusive boosts are now live in your catalog.
          </p>
        </div>
        <Link
          href="/dashboard/products"
          className="btn-primary flex items-center gap-4 self-start group shadow-2xl shadow-aa-orange/20 animate-fade-in-up delay-100"
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-black uppercase tracking-widest text-xs">Explore Alpha Catalog</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 animate-fade-in-up delay-200">
        {[
          { label: 'Total Earnings', value: formatCurrency(mockStats.totalEarnings), icon: DollarSign, color: 'aa-success', change: `+${mockStats.earningsChange}%` },
          { label: 'Pending Payout', value: formatCurrency(mockStats.pendingEarnings), icon: Clock, color: 'aa-orange', change: 'In Review' },
          { label: 'Showcase Items', value: mockStats.productsInShowcase, icon: Package, color: 'aa-gold', change: 'Live' },
          { label: 'Platform Sales', value: mockStats.totalSales, icon: ShoppingCart, color: 'purple-400', change: `+${mockStats.salesChange}%` },
        ].map((stat, i) => (
          <div key={i} className="card group hover:-translate-y-1 transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-16 h-16 text-white" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500",
                  `bg-${stat.color}/10 border-${stat.color}/20 group-hover:scale-110 group-hover:bg-${stat.color}/20`
                )}>
                  <stat.icon className={cn("w-6 h-6", `text-${stat.color}`)} />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg",
                  stat.color === 'aa-success' ? "bg-aa-success/10 text-aa-success" : "bg-white/[0.03] text-white/40"
                )}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-black text-white group-hover:text-gradient transition-all duration-500 tracking-tighter mb-1">{stat.value}</div>
              <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8 relative z-10">
        {/* Boosted Products Section */}
        <div className="lg:col-span-2 card p-8 md:p-10 animate-fade-in-up delay-300">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-aa-orange/10 border border-aa-orange/20 flex items-center justify-center shadow-2xl shadow-aa-orange/10">
                <TrendingUp className="w-6 h-6 text-aa-orange" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">High-Yield Offers</h2>
                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">Algorithmically selected for your profile</p>
              </div>
            </div>
            <Link
              href="/dashboard/products"
              className="group flex items-center gap-3 px-5 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all"
            >
              <span className="text-[10px] font-black text-white/60 group-hover:text-white uppercase tracking-widest">Full Catalog</span>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {mockRecentProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500 overflow-hidden"
              >
                {/* Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-aa-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="w-24 h-24 rounded-2xl bg-aa-bg-tertiary border border-white/5 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500 relative">
                  <Package className="w-12 h-12 text-white/5" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="flex-1 min-w-0 relative z-10 text-center sm:text-left">
                  <h3 className="text-lg font-black text-white truncate group-hover:text-gradient transition-all leading-tight mb-3">{product.name}</h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-aa-success/10 border border-aa-success/20 shadow-lg shadow-aa-success/5">
                      <Zap className="w-3.5 h-3.5 text-aa-success" />
                      <span className="text-[10px] font-black text-aa-success uppercase tracking-widest">{(product.aaRate * 100).toFixed(0)}% Rate</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-aa-gold/10 border border-aa-gold/20 shadow-lg shadow-aa-gold/5">
                      <Star className="w-3.5 h-3.5 text-aa-gold" />
                      <span className="text-[10px] font-black text-aa-gold uppercase tracking-widest">+{((product.aaRate - product.openCollabRate) * 100).toFixed(0)}% Boost</span>
                    </div>
                    {product.freeSample && (
                      <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Free Sample</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center sm:text-right shrink-0 relative z-10 border-t sm:border-t-0 sm:border-l border-white/5 pt-6 sm:pt-0 sm:pl-8">
                  <div className="text-2xl font-black text-white tracking-tighter mb-1">
                    ${product.price.min.toFixed(0)}
                  </div>
                  <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                    {formatNumber(product.stock)} Units
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card h-fit p-8 md:p-10 animate-fade-in-up delay-400">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-2xl shadow-purple-500/10">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Live Feed</h2>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">Real-time telemetry</p>
            </div>
          </div>

          <div className="space-y-8">
            {mockRecentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 group"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300",
                    activity.type === 'sale'
                      ? 'bg-aa-success/10 border-aa-success/20 group-hover:bg-aa-success/20'
                      : 'bg-aa-orange/10 border-aa-orange/20 group-hover:bg-aa-orange/20'
                  )}
                >
                  {activity.type === 'sale' ? (
                    <DollarSign className="w-5 h-5 text-aa-success" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-aa-orange" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-black text-white uppercase tracking-wider">
                      {activity.type === 'sale' ? 'Conversion' : 'Collection Update'}
                    </p>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.1em]">{activity.time}</span>
                  </div>
                  <p className="text-sm font-bold text-white/50 leading-snug">
                    {activity.type === 'sale' ? (
                      <>
                        Sale recorded for <span className="text-white">{activity.product}</span>
                      </>
                    ) : (
                      <>
                        Linked <span className="text-white">{activity.product}</span> to showcase.
                      </>
                    )}
                  </p>
                  {activity.commission && (
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-lg bg-aa-success/5 border border-aa-success/10">
                      <span className="text-[10px] font-black text-aa-success uppercase tracking-widest">+{formatCurrency(activity.commission)} Commission</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/earnings"
            className="group w-full mt-12 py-4 px-6 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center gap-3 transition-all hover:border-white/20"
          >
            <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest">Access Financials</span>
            <ArrowRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Action Hub */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 animate-fade-in-up delay-500">
        {[
          { title: 'Alpha Lab', desc: 'Add high-commission products', href: '/dashboard/products', icon: Package, color: 'aa-orange' },
          { title: 'Payout Portal', desc: 'Secure earnings management', href: '/dashboard/earnings', icon: DollarSign, color: 'aa-success' },
          { title: 'Sync Node', desc: 'TikTok Shop cloud integration', href: '/dashboard/settings', icon: Sparkles, color: 'purple-400' },
        ].map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className="card group hover:border-white/20 transition-all duration-500 flex items-center gap-6"
          >
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500",
              `bg-${action.color}/5 border-${action.color}/10 group-hover:scale-110 group-hover:bg-${action.color}/10 group-hover:border-${action.color}/30`
            )}>
              <action.icon className={cn("w-8 h-8", `text-${action.color}`)} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-gradient transition-all">{action.title}</h3>
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
