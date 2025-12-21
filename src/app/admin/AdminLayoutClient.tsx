'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Users,
    Package,
    DollarSign,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronDown,
    Shield,
    Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Creators', href: '/admin/creators', icon: Users },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Brand Outreach', href: '/admin/brands', icon: Building2 },
    { name: 'Commissions', href: '/admin/commissions', icon: DollarSign },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminLayoutClientProps {
    children: ReactNode;
    initialStats: {
        totalCreators: number;
        activeProducts: number;
    };
}

export default function AdminLayoutClient({ children, initialStats }: AdminLayoutClientProps) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-aa-bg-primary premium-bg">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-all"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-full w-64 bg-aa-bg-secondary/80 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
                        <Link href="/admin" className="flex items-center gap-3">
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
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                                        isActive
                                            ? 'nav-item-active'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
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

                    {/* User Menu */}
                    <div className="p-4 border-t border-white/5">
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5"
                            >
                                <div className="w-10 h-10 rounded-full bg-aa-orange-dim flex items-center justify-center border border-aa-orange/20">
                                    <Shield className="w-5 h-5 text-aa-orange" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-bold text-white truncate">
                                        {session?.user?.name || 'Admin'}
                                    </p>
                                    <p className="text-[10px] text-aa-orange uppercase font-bold tracking-widest opacity-80">{session?.user?.role}</p>
                                </div>
                                <ChevronDown
                                    className={cn(
                                        'w-4 h-4 text-white/40 transition-transform duration-300',
                                        userMenuOpen && 'rotate-180'
                                    )}
                                />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-aa-bg-tertiary rounded-xl border border-white/10 shadow-2xl animate-fade-in-up">
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Creator View
                                    </Link>
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

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Bar */}
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
                            {/* Quick Stats */}
                            <div className="hidden md:flex items-center gap-8">
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Creators</span>
                                        <Users className="w-3.5 h-3.5 text-aa-orange" />
                                    </div>
                                    <span className="text-sm font-bold text-white">{initialStats.totalCreators}</span>
                                </div>
                                <div className="w-px h-6 bg-white/5" />
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Products</span>
                                        <Package className="w-3.5 h-3.5 text-purple-400" />
                                    </div>
                                    <span className="text-sm font-bold text-white">{initialStats.activeProducts}</span>
                                </div>
                            </div>

                            <div className="w-px h-8 bg-white/10 hidden md:block mx-2" />

                            {/* Notifications */}
                            <button className="relative p-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-aa-orange rounded-full border-2 border-aa-bg-primary shadow-[0_0_8px_rgba(255,107,0,0.5)]" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 lg:p-10 animate-fade-in-up">{children}</main>
            </div>
        </div>
    );
}
