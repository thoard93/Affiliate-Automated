'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Package, DollarSign, Settings, LogOut, Menu, X, Bell, ChevronDown, ExternalLink, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Earnings', href: '/dashboard/earnings', icon: DollarSign },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-aa-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img src="https://raw.githubusercontent.com/thoard93/Affiliate-Automated/main/1F16E01D-3325-4BF5-8053-40AF1C7191C9_4_5005_c.jpeg" alt="AA" className="h-12 w-auto animate-pulse" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  const isPending = session?.user?.status === 'PENDING';

  return (
    <div className="min-h-screen bg-aa-bg-primary premium-bg">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-all"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-64 bg-aa-bg-secondary/80 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center gap-3">
              <img
                src="https://raw.githubusercontent.com/thoard93/Affiliate-Automated/main/1F16E01D-3325-4BF5-8053-40AF1C7191C9_4_5005_c.jpeg"
                alt="Affiliate Automated"
                className="h-10 w-auto rounded-lg shadow-lg shadow-aa-orange/10"
              />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 mt-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                    isActive ? 'nav-item-active' : 'text-white/50 hover:text-white hover:bg-white/5'
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-aa-orange" : "text-white/40 group-hover:text-white"
                  )} />
                  <span className="font-semibold tracking-wide text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* TikTok Connection Status */}
          <div className="p-4 border-t border-white/5">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-aa-orange/5 blur-2xl rounded-full -mr-8 -mt-8" />
              <div className="flex items-center gap-3 mb-2 relative z-10">
                {session?.user?.creatorId ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-aa-success animate-pulse" />
                    <span className="text-xs font-bold text-white/90">TikTok Connected</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-aa-orange animate-pulse" />
                    <span className="text-xs font-bold text-white/90 text-aa-orange">Connect TikTok</span>
                  </>
                )}
              </div>
              {!session?.user?.creatorId && (
                <Link
                  href="/dashboard/settings"
                  className="text-[10px] font-bold text-white/40 hover:text-aa-orange transition-colors uppercase tracking-widest block"
                >
                  Action Required →
                </Link>
              )}
            </div>
          </div>

          {/* User Profile / Menu */}
          <div className="p-4 border-t border-white/5">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5 group"
              >
                <div className="w-10 h-10 rounded-full bg-aa-bg-tertiary border border-white/10 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt={session.user.name || ''} className="w-full h-full object-cover" />
                  ) : (
                    <Shield className="w-5 h-5 text-aa-orange" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-white truncate">{session?.user?.name || 'Creator'}</p>
                  <p className="text-[10px] text-aa-orange uppercase font-bold tracking-widest opacity-80">Partner</p>
                </div>
                <ChevronDown className={cn('w-4 h-4 text-white/40 transition-transform duration-300', userMenuOpen && 'rotate-180')} />
              </button>

              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-aa-bg-tertiary rounded-xl border border-white/10 shadow-2xl animate-fade-in-up">
                  {(session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN') && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-aa-gold hover:bg-aa-gold/10 rounded-lg transition-colors font-medium border border-transparent hover:border-aa-gold/20 mb-1"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin View
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors text-left font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-20 bg-aa-bg-primary/40 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between h-full px-6 lg:px-10">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-6">
              {/* Notification Bell */}
              <button className="relative p-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-aa-orange rounded-full border-2 border-aa-bg-primary shadow-[0_0_8px_rgba(255,107,0,0.5)]" />
              </button>

              {/* Discord Link */}
              <a
                href="https://discord.gg/affiliateautomated"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2.5 px-5 py-2.5 bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/20 rounded-xl hover:bg-[#5865F2]/20 transition-all duration-300 group"
              >
                <span className="text-xs font-bold uppercase tracking-widest group-hover:tracking-[0.1em] transition-all">Support</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </header>

        {/* Pending Approval Banner */}
        {isPending && (
          <div className="bg-aa-orange/5 border-b border-aa-orange/20 px-6 lg:px-10 py-4 flex items-center gap-4 animate-fade-in-up">
            <div className="w-10 h-10 rounded-xl bg-aa-orange/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-aa-orange animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Application Pending</p>
              <p className="text-xs text-aa-orange/80 font-medium">Your account is currently under review. High-boost products will be available upon approval.</p>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="p-6 lg:p-10 animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  );
}
