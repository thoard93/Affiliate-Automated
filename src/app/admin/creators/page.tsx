'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  Mail,
  MessageCircle,
  Link as LinkIcon,
  ExternalLink,
  ChevronDown,
  Download,
  UserPlus,
  Ban,
  Eye,
  Loader2,
} from 'lucide-react';
import { formatNumber, formatDate, formatCurrency, cn } from '@/lib/utils';
import { getCreators, updateCreatorStatus } from '@/actions/creators';

const statusConfig = {
  PENDING: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
  APPROVED: { label: 'Approved', color: 'text-aa-success', bg: 'bg-aa-success/10', icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle },
  SUSPENDED: { label: 'Suspended', color: 'text-red-400', bg: 'bg-red-400/10', icon: Ban },
};

export default function AdminCreatorsPage() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    const result = await getCreators(searchQuery, statusFilter);
    if (result.success) {
      setCreators(result.creators || []);
    } else {
      toast.error('Failed to load creators');
    }
    setLoading(false);
  };

  const pendingCount = creators.filter((c) => c.status === 'PENDING').length;
  const approvedCount = creators.filter((c) => c.status === 'APPROVED').length;

  const handleSelectAll = () => {
    if (selectedCreators.length === creators.length) {
      setSelectedCreators([]);
    } else {
      setSelectedCreators(creators.map((c) => c.id));
    }
  };

  const handleStatusUpdate = async (userId: string, status: any) => {
    const result = await updateCreatorStatus(userId, status);
    if (result.success) {
      toast.success(`User ${status.toLowerCase()}`);
      setActionMenuOpen(null);
      fetchData(); // Refresh list
    } else {
      toast.error('Failed to update status');
    }
  };

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Email', 'Discord', 'TikTok', 'Status', 'Revenue', 'Commission'];
    const csvContent = [
      headers.join(','),
      ...creators.map(c => [
        c.id,
        `"${c.name}"`,
        c.email,
        c.discordUsername,
        c.tiktokUsername || '',
        c.status,
        c.totalRevenue,
        c.totalCommission
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creators-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export started!');
  };

  const handleInvite = () => {
    navigator.clipboard.writeText('https://discord.gg/affiliateautomated');
    toast.success('Invite link copied to clipboard!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Creator <span className="text-gradient">Partners</span>
          </h1>
          <p className="text-white/40 mt-1">
            Manage your affiliate network and vet new applications.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="btn-secondary py-3 px-6 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button onClick={handleInvite} className="btn-primary py-3 px-6 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Invite Partner
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 cursor-pointer hover:border-white/20 group" onClick={() => setStatusFilter('all')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{creators.length}</div>
          <div className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Total Network</div>
        </div>

        <div className="glass-card p-6 cursor-pointer hover:border-yellow-400/30 group" onClick={() => setStatusFilter('PENDING')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center transition-transform group-hover:scale-110">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{pendingCount}</div>
          <div className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Awaiting Review</div>
        </div>

        <div className="glass-card p-6 cursor-pointer hover:border-aa-success/30 group" onClick={() => setStatusFilter('APPROVED')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-aa-success/10 flex items-center justify-center transition-transform group-hover:scale-110">
              <CheckCircle2 className="w-5 h-5 text-aa-success" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{approvedCount}</div>
          <div className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Active Partners</div>
        </div>

        <div className="glass-card p-6 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-aa-orange/10 flex items-center justify-center transition-transform group-hover:scale-110">
              <LinkIcon className="w-5 h-5 text-aa-orange" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {creators.filter((c) => c.tiktokConnected).length}
          </div>
          <div className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Store Connected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search network by name, email, or discord handle..."
            className="input-field pl-12 h-12 bg-aa-bg-secondary/50 border-white/5 focus:border-aa-orange/50 transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field pr-12 appearance-none cursor-pointer min-w-[180px] h-12 bg-aa-bg-secondary/50 border-white/5 focus:border-aa-orange/50 transition-all"
          >
            <option value="all">All Partners</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Active Network</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-aa-orange animate-spin" />
        </div>
      )}

      {/* Creators Table */}
      {!loading && (
        <div className="glass-panel overflow-hidden border border-white/5 rounded-2xl bg-aa-bg-secondary/30 backdrop-blur-md">
          <div className="table-container">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="w-12 px-6 py-5">
                    <input
                      type="checkbox"
                      checked={selectedCreators.length === creators.length && creators.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-aa-orange focus:ring-aa-orange transition-all cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-white/40 uppercase tracking-widest">Creator Profile</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-white/40 uppercase tracking-widest">Verification</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-white/40 uppercase tracking-widest">Digital Store</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-white/40 uppercase tracking-widest">Reach</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-white/40 uppercase tracking-widest">Onboarded</th>
                  <th className="px-6 py-5 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {creators.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-white/40">No creators found</td></tr>
                ) : creators.map((creator) => {
                  const status = statusConfig[creator.status as keyof typeof statusConfig] || statusConfig.PENDING;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={creator.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCreators.includes(creator.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCreators([...selectedCreators, creator.id]);
                            } else {
                              setSelectedCreators(selectedCreators.filter((id) => id !== creator.id));
                            }
                          }}
                          className="w-4 h-4 rounded border-white/20 bg-aa-dark-500 text-purple-500 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-aa-dark-400 flex items-center justify-center">
                            <span className="font-medium text-white">{creator.name?.[0] || '?'}</span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{creator.name || 'Unknown'}</p>
                            <div className="flex items-center gap-2 text-xs text-white/40">
                              <MessageCircle className="w-3 h-3" />
                              {creator.discordUsername}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn('badge', status.bg, status.color)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {creator.tiktokConnected ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-aa-success" />
                            <span className="text-white text-sm">{creator.tiktokUsername}</span>
                          </div>
                        ) : (
                          <span className="text-white/40 text-sm">Not connected</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-white">{formatNumber(creator.followerCount)}</td>
                      <td className="px-6 py-4 text-white/60 text-sm">
                        {formatDate(creator.createdAt, 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            onClick={() => setActionMenuOpen(actionMenuOpen === creator.id ? null : creator.id)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-white/40" />
                          </button>

                          {actionMenuOpen === creator.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-aa-dark-400 rounded-lg border border-white/10 shadow-lg z-10 glass-panel">
                              <div className="p-1">
                                {creator.status === 'PENDING' && (
                                  <>
                                    <button
                                      onClick={() => handleStatusUpdate(creator.id, 'APPROVED')}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-aa-success hover:bg-aa-success/10 rounded-md"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleStatusUpdate(creator.id, 'REJECTED')}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-md"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Reject
                                    </button>
                                  </>
                                )}
                                {creator.status === 'APPROVED' && (
                                  <>
                                    <button
                                      onClick={() => handleStatusUpdate(creator.id, 'SUSPENDED')}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-md"
                                    >
                                      <Ban className="w-4 h-4" />
                                      Suspend
                                    </button>
                                  </>
                                )}
                                {creator.status === 'SUSPENDED' && (
                                  <>
                                    <button
                                      onClick={() => handleStatusUpdate(creator.id, 'APPROVED')}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-aa-success hover:bg-aa-success/10 rounded-md"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                      Re-Activate
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
