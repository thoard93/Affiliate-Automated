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
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/60 mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-aa-orange" />
          <h2 className="text-lg font-semibold text-white">Profile</h2>
        </div>

        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-aa-dark-400 flex items-center justify-center overflow-hidden">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-white/20" />
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Display Name</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={session?.user?.name || ''}
                  disabled
                  className="input-field bg-aa-dark-600"
                />
                <span className="badge bg-[#5865F2]/10 text-[#5865F2]">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Discord
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-1">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white/40" />
                <span className="text-white">{session?.user?.email || 'No email'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-1">Account Status</label>
              <span
                className={cn(
                  'badge',
                  session?.user?.status === 'APPROVED'
                    ? 'bg-aa-success/10 text-aa-success'
                    : session?.user?.status === 'PENDING'
                    ? 'bg-yellow-400/10 text-yellow-400'
                    : 'bg-red-400/10 text-red-400'
                )}
              >
                {session?.user?.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                {session?.user?.status === 'PENDING' && <AlertCircle className="w-3 h-3 mr-1" />}
                {session?.user?.status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TikTok Shop Connection */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <LinkIcon className="w-5 h-5 text-aa-orange" />
          <h2 className="text-lg font-semibold text-white">TikTok Shop Connection</h2>
        </div>

        <div className="p-6 rounded-xl bg-aa-dark-600 border border-white/5">
          {isTikTokConnected ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-aa-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-aa-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Connected</h3>
                  <p className="text-sm text-white/60">
                    Your TikTok Shop account is connected
                  </p>
                </div>
              </div>
              <button
                onClick={handleDisconnectTikTok}
                className="btn-secondary text-red-400 hover:text-red-300 hover:border-red-400/30"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-aa-orange/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-aa-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Not Connected</h3>
                  <p className="text-sm text-white/60">
                    Connect your TikTok Shop to access products and track earnings
                  </p>
                </div>
              </div>
              <button
                onClick={handleConnectTikTok}
                disabled={isConnecting}
                className="btn-primary flex items-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect TikTok Shop
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-white/40">
          We'll request permission to view your TikTok Shop data and send collaboration invites.
          You can disconnect at any time.
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-aa-orange" />
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              key: 'newProducts',
              title: 'New Products',
              description: 'Get notified when new high-commission products are available',
            },
            {
              key: 'sales',
              title: 'Sales Alerts',
              description: 'Receive notifications when you make a sale',
            },
            {
              key: 'payouts',
              title: 'Payout Updates',
              description: 'Get notified about payout processing and completion',
            },
            {
              key: 'promotions',
              title: 'Promotions & Tips',
              description: 'Receive tips on maximizing your commissions',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
            >
              <div>
                <h4 className="font-medium text-white">{item.title}</h4>
                <p className="text-sm text-white/60">{item.description}</p>
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
                <div className="w-11 h-6 bg-aa-dark-400 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-aa-orange/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aa-orange"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-aa-orange" />
          <h2 className="text-lg font-semibold text-white">Security</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-white">Two-Factor Authentication</h4>
              <p className="text-sm text-white/60">
                Add an extra layer of security to your account
              </p>
            </div>
            <span className="badge bg-white/5 text-white/40">Coming Soon</span>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-white/5">
            <div>
              <h4 className="font-medium text-white">Active Sessions</h4>
              <p className="text-sm text-white/60">
                Manage devices where you're logged in
              </p>
            </div>
            <button className="btn-ghost text-sm">View Sessions</button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-500/20">
        <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Delete Account</h4>
            <p className="text-sm text-white/60">
              Permanently delete your account and all associated data
            </p>
          </div>
          <button className="btn-secondary text-red-400 hover:text-red-300 hover:border-red-400/30">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
