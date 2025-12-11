'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Package, DollarSign, Settings, LogOut, Menu, X, Bell, ChevronDown, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-aa-dark">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={cn('fixed top-0 left-0 z-50 h-full w-64 bg-aa-dark-500 border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center gap-3">
              <img src="https://raw.githubusercontent.com/thoard93/Affiliate-Automated/main/1F16E01D-3325-4BF5-8053-40AF1C7191C9_4_5005_c.jpeg" alt="AA" className="h-10 w-auto" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">AFFILIATE</span>
                <span className="text-xs font-bold text-aa-gold">AUTOMATED</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={cn('flex items-center gap-3 px-4 py-3 rounded-lg transition-all', isActive ? 'bg-aa-orange/10 text-aa-orange' : 'text-white/60 hover:text-white hover:bg-white/5')}>
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <div className="p-4 rounded-lg bg-aa-dark-600">
              <div className="flex items-center gap-2 mb-2">
                {session?.user?.creatorId ? (
                  <><CheckCircle2 className="w-4 h-4 text-aa-success" /><span className="text-sm font-medium text-white">TikTok Connected</span></>
                ) : (
                  <><AlertCircle className="w-4 h-4 text-aa-orange" /><span className="text-sm font-medium text-white">Connect TikTok</span></>
                )}
              </div>
              {!session?.user?.creatorId && <Link href="/dashboard/settings" className="text-xs text-aa-orange hover:underline">Connect to access products →</Link>}
            </div>
          </div>

          <div className="p-4 border-t border-white/5">
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-full bg-aa-dark-400 flex items-center justify-center overflow-hidden">
                  {session?.user?.image ? <img src={session.user.image} alt={session.user.name || ''} className="w-full h-full object-cover" /> : <span className="text-lg font-medium text-white">{session?.user?.name?.[0] || '?'}</span>}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white truncate">{session?.user?.name || 'User'}</p>
                  <p className="text-xs text-white/40 truncate">{session?.user?.email || 'No email'}</p>
                </div>
                <ChevronDown className={cn('w-4 h-4 text-white/40 transition-transform', userMenuOpen && 'rotate-180')} />
              </button>
              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-aa-dark-400 rounded-lg border border-white/10 shadow-lg">
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
                    <LogOut className="w-4 h-4" />Sign Out
                  </button>
                  {(session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN') && (
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-aa-gold hover:bg-aa-gold/10 rounded-md transition-colors">
                        <LayoutDashboard className="w-4 h-4" />
                        Admin View
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-aa-dark/80 backdrop-blur-lg border-b border-white/5">
          <div className="flex items-center justify-between h-full px-4 lg:px-8">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-white/60 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-white/60 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-aa-orange rounded-full" />
              </button>
              <a href="https://discord.gg/affiliateautomated" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#5865F2]/10 text-[#5865F2] rounded-lg hover:bg-[#5865F2]/20 transition-colors">
                <span className="text-sm font-medium">Discord</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </header>

        {isPending && (
          <div className="bg-aa-orange/10 border-b border-aa-orange/20 px-4 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-aa-orange" />
              <p className="text-sm text-aa-orange">Your account is pending approval. You will have full access once approved by an admin.</p>
            </div>
          </div>
        )}

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
