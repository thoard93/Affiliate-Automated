'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import {
  Settings,
  Link as LinkIcon,
  Bell,
  Shield,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  User,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const [isConnecting, setIsConnecting] = useState(false);
  const [notifications, setNotifications] = useState({
    newProducts: true,
    sales: true,
    payouts: true,
    promotions: false,
  });

  // Handle OAuth callback messages
  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'tiktok_connected') {
      toast.success('TikTok Shop connected successfully!');
      update(); // Refresh session
    }

    if (error) {
      const errorMessages: Record<string, string> = {
        oauth_denied: 'TikTok authorization was denied',
        missing_params: 'Missing authorization parameters',
        invalid_state: 'Invalid authorization state',
        expired_state: 'Authorization expired. Please try again.',
        no_shops: 'No TikTok Shop found for this account',
        callback_failed: 'Failed to complete authorization',
        no_user: 'User session not found',
      };
      toast.error(errorMessages[error] || 'Connection failed');
    }
  }, [searchParams, update]);

  const handleConnectTikTok = async () => {
    setIsConnecting(true);
    try {
      // Request auth URL from API
      const response = await fetch('/api/auth/tiktok/authorize', {
        method: 'POST',
      });
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        toast.error('Failed to generate authorization URL');
        setIsConnecting(false);
      }
    } catch (error) {
      toast.error('Failed to initiate connection');
      setIsConnecting(false);
    }
  };

  const handleDisconnectTikTok = async () => {
    if (!confirm('Are you sure you want to disconnect your TikTok Shop account?')) {
      return;
    }

    try {
      const response = await fetch('/api/auth/tiktok/disconnect', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('TikTok Shop disconnected');
        update();
      } else {
        toast.error('Failed to disconnect');
      }
    } catch (error) {
      toast.error('Failed to disconnect');
    }
  };

  const isTikTokConnected = session?.user?.creatorId; // Will be enhanced with actual TikTok status

  return (
    <div className="space-y-10 animate-fade-in max-w-5xl">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Account <span className="text-gradient">Settings</span>
        </h1>
        <p className="text-white/40 font-medium">
          Manage your account security, integrations, and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Core Info */}
        <div className="lg:col-span-7 space-y-8">
          {/* Profile Section */}
          <div className="card group overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center border border-aa-orange/20">
                <User className="w-6 h-6 text-aa-orange" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Creator Profile</h2>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Personal Information</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="relative group/avatar">
                <div className="w-24 h-24 rounded-2xl bg-aa-bg-secondary border-2 border-white/5 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover/avatar:border-aa-orange/40 group-hover/avatar:shadow-2xl group-hover/avatar:shadow-aa-orange/10">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || ''}
                      className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white/10" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-aa-orange text-white flex items-center justify-center shadow-lg border-2 border-aa-bg-primary">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 w-full space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Display Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={session?.user?.name || ''}
                        disabled
                        className="w-full h-12 pl-4 pr-12 bg-white/[0.02] border border-white/5 rounded-xl text-sm font-bold text-white/60 cursor-not-allowed"
                      />
                      <MessageCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5865F2]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Status</label>
                    <div className={cn(
                      'h-12 flex items-center px-4 rounded-xl border font-black text-[10px] uppercase tracking-[0.2em]',
                      session?.user?.status === 'APPROVED'
                        ? 'bg-aa-success/5 border-aa-success/20 text-aa-success'
                        : 'bg-yellow-400/5 border-yellow-400/20 text-yellow-400'
                    )}>
                      {session?.user?.status === 'APPROVED' ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                      {session?.user?.status || 'Active'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Email Address</label>
                  <div className="flex items-center gap-3 px-4 h-12 bg-white/[0.02] border border-white/5 rounded-xl">
                    <Mail className="w-4 h-4 text-white/20" />
                    <span className="text-sm font-bold text-white/60">{session?.user?.email || 'No email associated'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TikTok Shop Connection */}
          <div className="card group relative overflow-hidden">
            {isTikTokConnected && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-aa-success/5 blur-3xl rounded-full -mr-16 -mt-16" />
            )}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center border border-aa-orange/20">
                  <LinkIcon className="w-6 h-6 text-aa-orange" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Integrations</h2>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Platform Connections</p>
                </div>
              </div>
            </div>

            <div className={cn(
              'p-8 rounded-2xl border transition-all duration-500 mb-4',
              isTikTokConnected
                ? 'bg-aa-success/5 border-aa-success/20'
                : 'bg-white/[0.02] border-white/5'
            )}>
              {isTikTokConnected ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-2xl bg-aa-success/10 flex items-center justify-center border border-aa-success/20 shadow-xl shadow-aa-success/5">
                      <CheckCircle2 className="w-8 h-8 text-aa-success" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">TikTok Shop Linked</h3>
                      <p className="text-sm font-bold text-white/40">Syncing products & commissions in real-time</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnectTikTok}
                    className="h-11 px-6 rounded-xl border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500/10 transition-all"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-2xl bg-aa-orange/10 flex items-center justify-center border border-aa-orange/20">
                      <AlertCircle className="w-8 h-8 text-aa-orange animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Sync Required</h3>
                      <p className="text-sm font-bold text-white/40">Connect to track earnings automatically</p>
                    </div>
                  </div>
                  <button
                    onClick={handleConnectTikTok}
                    disabled={isConnecting}
                    className="btn-primary flex items-center gap-3 px-8 h-12 shadow-xl shadow-aa-orange/20"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-black uppercase tracking-widest text-[10px]">Authorizing...</span>
                      </>
                    ) : (
                      <>
                        <span className="font-black uppercase tracking-widest text-[10px]">Connect TikTok Shop</span>
                        <ExternalLink className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4 px-2">
              <Shield className="w-3.5 h-3.5 text-white/20" />
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                Permissions: Data View, Collab Invites, Product Catalog
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Preferences */}
        <div className="lg:col-span-5 space-y-8">
          {/* Notification Preferences */}
          <div className="card">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center border border-aa-orange/20">
                <Bell className="w-6 h-6 text-aa-orange" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Preferences</h2>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Communication & Alerts</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: 'newProducts',
                  title: 'New Drops',
                  description: 'Alerts for high-commission products',
                },
                {
                  key: 'sales',
                  title: 'Sales Alerts',
                  description: 'Real-time conversion notifications',
                },
                {
                  key: 'payouts',
                  title: 'Payments',
                  description: 'Status updates on your withdrawals',
                },
                {
                  key: 'promotions',
                  title: 'Strategy',
                  description: 'Weekly tips to boost your ROI',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-colors"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">{item.title}</h4>
                    <p className="text-xs font-bold text-white/20 truncate">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-aa-bg-tertiary border border-white/5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/20 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:bg-white peer-checked:bg-aa-orange peer-checked:border-aa-orange shadow-inner"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Access */}
          <div className="card border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Security</h2>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Control & Privacy</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl opacity-50 relative group">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">Multi-Factor Auth</h4>
                    <p className="text-xs font-bold text-white/20">Biometric or App security</p>
                  </div>
                  <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-white/40 uppercase tracking-widest group-hover:bg-aa-orange/10 group-hover:text-aa-orange transition-colors">Enterprise Only</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Active Device</h4>
                  <p className="text-xs font-bold text-white/20 truncate">Managed by NextAuth Session</p>
                </div>
                <button className="text-[10px] font-black text-aa-orange uppercase tracking-widest border-b border-aa-orange/0 hover:border-aa-orange transition-all">
                  Revoke
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-red-500/10 bg-red-500/[0.02]">
            <div className="flex items-center justify-between items-start gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-black text-red-500 uppercase tracking-widest mb-1">Danger Zone</h2>
                <p className="text-xs font-bold text-white/20">Permanently remove all your creator data and history.</p>
              </div>
              <button className="h-10 px-4 rounded-xl border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
