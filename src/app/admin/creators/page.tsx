'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { formatNumber, formatDate, formatCurrency, cn } from '@/lib/utils';

// Mock creators data
const mockCreators = [
  {
    id: '1',
    name: 'Jessica Lee',
    email: 'jessica@example.com',
    discordUsername: 'jessicaL#1234',
    discordId: '123456789012345678',
    tiktokUsername: '@jessicalee',
    tiktokConnected: true,
    status: 'APPROVED',
    followerCount: 125000,
    totalSales: 47,
    totalRevenue: 1892.50,
    totalCommission: 416.35,
    productsInShowcase: 18,
    createdAt: '2024-10-15T10:30:00Z',
    lastActive: '2024-12-08T14:20:00Z',
  },
  {
    id: '2',
    name: 'David Kim',
    email: 'david@example.com',
    discordUsername: 'davidk#5678',
    discordId: '234567890123456789',
    tiktokUsername: '@davidkim',
    tiktokConnected: true,
    status: 'APPROVED',
    followerCount: 89000,
    totalSales: 42,
    totalRevenue: 1654.00,
    totalCommission: 363.88,
    productsInShowcase: 15,
    createdAt: '2024-10-20T14:15:00Z',
    lastActive: '2024-12-08T12:45:00Z',
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    discordUsername: 'sarahj#9012',
    discordId: '345678901234567890',
    tiktokUsername: null,
    tiktokConnected: false,
    status: 'PENDING',
    followerCount: 45000,
    totalSales: 0,
    totalRevenue: 0,
    totalCommission: 0,
    productsInShowcase: 0,
    createdAt: '2024-12-08T10:30:00Z',
    lastActive: '2024-12-08T10:30:00Z',
  },
  {
    id: '4',
    name: 'Mike Chen',
    email: 'mike@example.com',
    discordUsername: 'mikechen#3456',
    discordId: '456789012345678901',
    tiktokUsername: null,
    tiktokConnected: false,
    status: 'PENDING',
    followerCount: 28000,
    totalSales: 0,
    totalRevenue: 0,
    totalCommission: 0,
    productsInShowcase: 0,
    createdAt: '2024-12-08T09:15:00Z',
    lastActive: '2024-12-08T09:15:00Z',
  },
  {
    id: '5',
    name: 'Emily Davis',
    email: 'emily@example.com',
    discordUsername: 'emilyd#7890',
    discordId: '567890123456789012',
    tiktokUsername: '@emilydavis',
    tiktokConnected: true,
    status: 'APPROVED',
    followerCount: 67000,
    totalSales: 28,
    totalRevenue: 1124.00,
    totalCommission: 247.28,
    productsInShowcase: 12,
    createdAt: '2024-11-01T16:45:00Z',
    lastActive: '2024-12-07T18:30:00Z',
  },
  {
    id: '6',
    name: 'John Smith',
    email: 'john@example.com',
    discordUsername: 'johnsmith#2345',
    discordId: '678901234567890123',
    tiktokUsername: '@johnsmith',
    tiktokConnected: true,
    status: 'SUSPENDED',
    followerCount: 34000,
    totalSales: 5,
    totalRevenue: 187.50,
    totalCommission: 41.25,
    productsInShowcase: 3,
    createdAt: '2024-11-10T12:00:00Z',
    lastActive: '2024-11-25T09:15:00Z',
  },
];

const statusConfig = {
  PENDING: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
  APPROVED: { label: 'Approved', color: 'text-aa-success', bg: 'bg-aa-success/10', icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle },
  SUSPENDED: { label: 'Suspended', color: 'text-red-400', bg: 'bg-red-400/10', icon: Ban },
};

export default function AdminCreatorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const filteredCreators = mockCreators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.discordUsername.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || creator.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = mockCreators.filter((c) => c.status === 'PENDING').length;
  const approvedCount = mockCreators.filter((c) => c.status === 'APPROVED').length;

  const handleSelectAll = () => {
    if (selectedCreators.length === filteredCreators.length) {
      setSelectedCreators([]);
    } else {
      setSelectedCreators(filteredCreators.map((c) => c.id));
    }
  };

  const handleApprove = async (creatorId: string) => {
    // API call to approve
    console.log('Approving:', creatorId);
    setActionMenuOpen(null);
  };

  const handleReject = async (creatorId: string) => {
    // API call to reject
    console.log('Rejecting:', creatorId);
    setActionMenuOpen(null);
  };

  const handleBulkApprove = async () => {
    // API call to bulk approve
    console.log('Bulk approving:', selectedCreators);
    setSelectedCreators([]);
    const handleBulkApprove = async () => {
      // API call to bulk approve
      console.log('Bulk approving:', selectedCreators);
      setSelectedCreators([]);
    };

    const handleExport = () => {
      const headers = ['ID', 'Name', 'Email', 'Discord', 'TikTok', 'Status', 'Revenue', 'Commission'];
      const csvContent = [
        headers.join(','),
        ...filteredCreators.map(c => [
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Creators</h1>
            <p className="text-white/60 mt-1">
              Manage creator accounts and approvals
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button onClick={handleInvite} className="btn-primary flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Invite Creator
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card cursor-pointer hover:border-white/20" onClick={() => setStatusFilter('all')}>
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold text-white">{mockCreators.length}</span>
            </div>
            <p className="text-sm text-white/60">Total Creators</p>
          </div>
          <div className="stat-card cursor-pointer hover:border-yellow-400/30" onClick={() => setStatusFilter('PENDING')}>
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{pendingCount}</span>
            </div>
            <p className="text-sm text-white/60">Pending Approval</p>
          </div>
          <div className="stat-card cursor-pointer hover:border-aa-success/30" onClick={() => setStatusFilter('APPROVED')}>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-aa-success" />
              <span className="text-2xl font-bold text-white">{approvedCount}</span>
            </div>
            <p className="text-sm text-white/60">Active Creators</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <LinkIcon className="w-5 h-5 text-aa-orange" />
              <span className="text-2xl font-bold text-white">
                {mockCreators.filter((c) => c.tiktokConnected).length}
              </span>
            </div>
            <p className="text-sm text-white/60">TikTok Connected</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or Discord..."
              className="input-field pl-12"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pr-10 appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCreators.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <span className="text-sm text-white">
              {selectedCreators.length} creator(s) selected
            </span>
            <div className="flex-1" />
            <button
              onClick={handleBulkApprove}
              className="btn-primary py-2 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve Selected
            </button>
            <button
              onClick={() => setSelectedCreators([])}
              className="btn-ghost"
            >
              Clear
            </button>
          </div>
        )}

        {/* Creators Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedCreators.length === filteredCreators.length && filteredCreators.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-white/20 bg-aa-dark-500 text-purple-500 focus:ring-purple-500"
                  />
                </th>
                <th>Creator</th>
                <th>Status</th>
                <th>TikTok</th>
                <th>Followers</th>
                <th>Sales</th>
                <th>Commission</th>
                <th>Joined</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCreators.map((creator) => {
                const status = statusConfig[creator.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                return (
                  <tr key={creator.id}>
                    <td>
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
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-aa-dark-400 flex items-center justify-center">
                          <span className="font-medium text-white">{creator.name[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{creator.name}</p>
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <MessageCircle className="w-3 h-3" />
                            {creator.discordUsername}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={cn('badge', status.bg, status.color)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </span>
                    </td>
                    <td>
                      {creator.tiktokConnected ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-aa-success" />
                          <span className="text-white text-sm">{creator.tiktokUsername}</span>
                        </div>
                      ) : (
                        <span className="text-white/40 text-sm">Not connected</span>
                      )}
                    </td>
                    <td className="text-white">{formatNumber(creator.followerCount)}</td>
                    <td className="text-white">{creator.totalSales}</td>
                    <td className="text-aa-success font-medium">
                      {formatCurrency(creator.totalCommission)}
                    </td>
                    <td className="text-white/60 text-sm">
                      {formatDate(creator.createdAt, 'MMM d, yyyy')}
                    </td>
                    <td>
                      <div className="relative">
                        <button
                          onClick={() => setActionMenuOpen(actionMenuOpen === creator.id ? null : creator.id)}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-white/40" />
                        </button>

                        {actionMenuOpen === creator.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-aa-dark-400 rounded-lg border border-white/10 shadow-lg z-10">
                            <div className="p-1">
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-md">
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-md">
                                <Mail className="w-4 h-4" />
                                Send Email
                              </button>
                              {creator.status === 'PENDING' && (
                                <>
                                  <hr className="my-1 border-white/5" />
                                  <button
                                    onClick={() => handleApprove(creator.id)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-aa-success hover:bg-aa-success/10 rounded-md"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(creator.id)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-md"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Reject
                                  </button>
                                </>
                              )}
                              {creator.status === 'APPROVED' && (
                                <>
                                  <hr className="my-1 border-white/5" />
                                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-md">
                                    <Ban className="w-4 h-4" />
                                    Suspend
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

        {filteredCreators.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No creators found</p>
          </div>
        )}
      </div>
    );
  }
