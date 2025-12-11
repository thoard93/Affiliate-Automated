'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Globe,
  TrendingUp,
  ChevronDown,
  MoreHorizontal,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  ExternalLink,
  Edit,
  Trash2,
  X,
  Loader2,
  Copy,
} from 'lucide-react';
import { cn, formatPercent, formatDate, formatRelativeTime } from '@/lib/utils';
import toast from 'react-hot-toast';

// Brand status configuration
const STATUS_CONFIG = {
  LEAD: { label: 'Lead', color: 'bg-gray-500', icon: AlertCircle },
  CONTACTED: { label: 'Contacted', color: 'bg-blue-500', icon: Mail },
  RESPONDED: { label: 'Responded', color: 'bg-purple-500', icon: MessageSquare },
  NEGOTIATING: { label: 'Negotiating', color: 'bg-yellow-500', icon: TrendingUp },
  AGREED: { label: 'Agreed', color: 'bg-green-500', icon: CheckCircle2 },
  PARTNERED: { label: 'Partnered', color: 'bg-aa-success', icon: CheckCircle2 },
  DECLINED: { label: 'Declined', color: 'bg-red-500', icon: XCircle },
  UNRESPONSIVE: { label: 'Unresponsive', color: 'bg-gray-400', icon: Clock },
};

const PRIORITY_CONFIG = {
  LOW: { label: 'Low', color: 'text-gray-400' },
  MEDIUM: { label: 'Medium', color: 'text-yellow-400' },
  HIGH: { label: 'High', color: 'text-orange-400' },
  URGENT: { label: 'Urgent', color: 'text-red-400' },
};

interface Brand {
  id: string;
  name: string;
  tiktokSellerId?: string;
  tiktokShopName?: string;
  category?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  tiktokHandle?: string;
  followerCount: number;
  productCount: number;
  avgRating?: number;
  currentOpenRate?: number;
  targetRate?: number;
  agreedRate?: number;
  status: keyof typeof STATUS_CONFIG;
  priority: keyof typeof PRIORITY_CONFIG;
  notes?: string;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    outreachEmails: number;
    products: number;
  };
  outreachEmails: any[];
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  variables: string[];
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    tiktokShopName: '',
    category: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    tiktokHandle: '',
    currentOpenRate: '',
    targetRate: '',
    priority: 'MEDIUM',
    notes: '',
  });

  // Email form state
  const [emailData, setEmailData] = useState({
    templateId: '',
    subject: '',
    body: '',
  });

  useEffect(() => {
    fetchBrands();
    fetchTemplates();
  }, [statusFilter, priorityFilter, searchQuery]);

  const fetchBrands = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (priorityFilter !== 'all') params.set('priority', priorityFilter);
      if (searchQuery) params.set('search', searchQuery);

      const response = await fetch(`/api/admin/brands?${params}`);
      const data = await response.json();

      if (data.success) {
        setBrands(data.data.brands);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/email-templates');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleCreateBrand = async () => {
    try {
      const response = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          currentOpenRate: formData.currentOpenRate ? parseFloat(formData.currentOpenRate) / 100 : null,
          targetRate: formData.targetRate ? parseFloat(formData.targetRate) / 100 : null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Brand added successfully');
        setShowAddModal(false);
        resetForm();
        fetchBrands();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to create brand');
    }
  };

  const handleUpdateBrand = async (id: string, updates: Partial<Brand>) => {
    try {
      const response = await fetch('/api/admin/brands', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Brand updated');
        fetchBrands();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to update brand');
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    try {
      const response = await fetch(`/api/admin/brands?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Brand deleted');
        fetchBrands();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to delete brand');
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEmailData({
        templateId,
        subject: template.subject,
        body: template.body,
      });
    }
  };

  const handleSendEmail = async (sendNow: boolean) => {
    if (!selectedBrand) return;

    try {
      const response = await fetch('/api/admin/brands/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: selectedBrand.id,
          ...emailData,
          sendNow,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(sendNow ? 'Email sent!' : 'Draft saved');
        setShowEmailModal(false);
        setSelectedBrand(null);
        setEmailData({ templateId: '', subject: '', body: '' });
        fetchBrands();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const handleStartProposal = (brand: Brand) => {
    const textToCopy = brand.tiktokShopName || brand.shopCode || brand.name;
    navigator.clipboard.writeText(textToCopy);
    toast.success('Shop name copied to clipboard!');

    // Open TikTok Partner Center in new tab
    window.open('https://partner.us.tiktokshop.com/seller/contract/create', '_blank');

    // Prompt to update status
    if (confirm('Did you send the proposal? Click OK to mark as Contacted.')) {
      handleUpdateBrand(brand.id, { status: 'CONTACTED', lastContactedAt: new Date().toISOString() });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      tiktokShopName: '',
      category: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      tiktokHandle: '',
      currentOpenRate: '',
      targetRate: '',
      priority: 'MEDIUM',
      notes: '',
    });
  };

  const openEmailModal = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowEmailModal(true);
  };

  // Pipeline stats
  const pipelineStages = [
    { status: 'LEAD', count: stats.LEAD || 0 },
    { status: 'CONTACTED', count: stats.CONTACTED || 0 },
    { status: 'RESPONDED', count: stats.RESPONDED || 0 },
    { status: 'NEGOTIATING', count: stats.NEGOTIATING || 0 },
    { status: 'AGREED', count: stats.AGREED || 0 },
    { status: 'PARTNERED', count: stats.PARTNERED || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Brand Outreach</h1>
          <p className="text-white/60">Manage partnerships and negotiations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {pipelineStages.map(({ status, count }) => {
          const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'card text-center transition-all',
                statusFilter === status && 'ring-2 ring-aa-orange'
              )}
            >
              <div className={cn('w-3 h-3 rounded-full mx-auto mb-2', config.color)} />
              <div className="text-2xl font-bold text-white">{count}</div>
              <div className="text-xs text-white/60">{config.label}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brands..."
            className="input-field pl-12"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field pr-10 appearance-none cursor-pointer min-w-[150px]"
          >
            <option value="all">All Status</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-field pr-10 appearance-none cursor-pointer min-w-[150px]"
          >
            <option value="all">All Priority</option>
            {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
        </div>
      </div>

      {/* Brands List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-aa-orange animate-spin" />
        </div>
      ) : brands.length === 0 ? (
        <div className="card text-center py-12">
          <Building2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No brands found</h3>
          <p className="text-white/60 mb-4">Add your first brand to start outreach</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Brand
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {brands.map((brand) => {
            const statusConfig = STATUS_CONFIG[brand.status];
            const priorityConfig = PRIORITY_CONFIG[brand.priority];
            const StatusIcon = statusConfig.icon;

            return (
              <div key={brand.id} className="card hover:border-aa-orange/30 transition-all">
                <div className="flex items-start gap-4">
                  {/* Brand Icon */}
                  <div className="w-12 h-12 rounded-xl bg-aa-dark-400 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-white/40" />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{brand.name}</h3>
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
                            statusConfig.color,
                            'text-white'
                          )}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                          <span className={cn('text-xs font-medium', priorityConfig.color)}>
                            {priorityConfig.label}
                          </span>
                        </div>
                        {brand.tiktokShopName && (
                          <p className="text-sm text-white/60">{brand.tiktokShopName}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEmailModal(brand)}
                          className="p-2 text-white/60 hover:text-aa-orange transition-colors"
                          title="Send Email"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBrand(brand.id)}
                          className="p-2 text-white/60 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Contact & Details */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                      {brand.contactEmail && (
                        <a
                          href={`mailto:${brand.contactEmail}`}
                          className="flex items-center gap-1 text-white/60 hover:text-aa-orange"
                        >
                          <Mail className="w-4 h-4" />
                          {brand.contactEmail}
                        </a>
                      )}
                      {brand.contactPhone && (
                        <a
                          href={`tel:${brand.contactPhone}`}
                          className="flex items-center gap-1 text-white/60 hover:text-aa-orange"
                        >
                          <Phone className="w-4 h-4" />
                          {brand.contactPhone}
                        </a>
                      )}
                      {brand.website && (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-white/60 hover:text-aa-orange"
                        >
                          <Globe className="w-4 h-4" />
                          Website
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {brand.category && (
                        <span className="text-white/40">{brand.category}</span>
                      )}
                    </div>

                    {/* Commission Rates */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                      {brand.currentOpenRate && (
                        <span className="text-white/60">
                          Current: <span className="text-white">{formatPercent(brand.currentOpenRate)}</span>
                        </span>
                      )}
                      {brand.targetRate && (
                        <span className="text-white/60">
                          Target: <span className="text-aa-orange">{formatPercent(brand.targetRate)}</span>
                        </span>
                      )}
                      {brand.agreedRate && (
                        <span className="text-white/60">
                          Agreed: <span className="text-aa-success">{formatPercent(brand.agreedRate)}</span>
                        </span>
                      )}
                      {brand._count.outreachEmails > 0 && (
                        <span className="text-white/40">
                          {brand._count.outreachEmails} email{brand._count.outreachEmails !== 1 ? 's' : ''} sent
                        </span>
                      )}
                      {brand.lastContactedAt && (
                        <span className="text-white/40">
                          Last contact: {formatRelativeTime(brand.lastContactedAt)}
                        </span>
                      )}
                    </div>

                    {/* Quick Status Update */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {brand.status === 'LEAD' && (
                        <>
                          <button
                            onClick={() => openEmailModal(brand)}
                            className="text-xs px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-500/20"
                          >
                            Send First Email
                          </button>
                          <button
                            onClick={() => handleStartProposal(brand)}
                            className="text-xs px-3 py-1 bg-aa-orange/10 text-aa-orange rounded-full hover:bg-aa-orange/20 flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            Start Proposal
                          </button>
                        </>
                      )}
                      {brand.status === 'CONTACTED' && (
                        <>
                          <button
                            onClick={() => handleUpdateBrand(brand.id, { status: 'RESPONDED' })}
                            className="text-xs px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full hover:bg-purple-500/20"
                          >
                            Mark Responded
                          </button>
                          <button
                            onClick={() => handleUpdateBrand(brand.id, { status: 'UNRESPONSIVE' })}
                            className="text-xs px-3 py-1 bg-gray-500/10 text-gray-400 rounded-full hover:bg-gray-500/20"
                          >
                            No Response
                          </button>
                        </>
                      )}
                      {brand.status === 'RESPONDED' && (
                        <button
                          onClick={() => handleUpdateBrand(brand.id, { status: 'NEGOTIATING' })}
                          className="text-xs px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full hover:bg-yellow-500/20"
                        >
                          Start Negotiation
                        </button>
                      )}
                      {brand.status === 'NEGOTIATING' && (
                        <>
                          <button
                            onClick={() => handleUpdateBrand(brand.id, { status: 'AGREED' })}
                            className="text-xs px-3 py-1 bg-green-500/10 text-green-400 rounded-full hover:bg-green-500/20"
                          >
                            They Agreed!
                          </button>
                          <button
                            onClick={() => handleUpdateBrand(brand.id, { status: 'DECLINED' })}
                            className="text-xs px-3 py-1 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20"
                          >
                            Declined
                          </button>
                        </>
                      )}
                      {brand.status === 'AGREED' && (
                        <button
                          onClick={() => handleUpdateBrand(brand.id, { status: 'PARTNERED' })}
                          className="text-xs px-3 py-1 bg-aa-success/10 text-aa-success rounded-full hover:bg-aa-success/20"
                        >
                          Mark as Partnered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )
      }

      {/* Add Brand Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-aa-dark-500 rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Add Brand</h2>
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="p-2 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="Brand name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">TikTok Shop Name</label>
                  <input
                    type="text"
                    value={formData.tiktokShopName}
                    onChange={(e) => setFormData({ ...formData, tiktokShopName: e.target.value })}
                    className="input-field"
                    placeholder="Shop name on TikTok"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="input-field"
                    placeholder="Contact person"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="input-field"
                    placeholder="email@brand.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="input-field"
                    placeholder="https://brand.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Beauty"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Current Rate (%)</label>
                  <input
                    type="number"
                    value={formData.currentOpenRate}
                    onChange={(e) => setFormData({ ...formData, currentOpenRate: e.target.value })}
                    className="input-field"
                    placeholder="10"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Target Rate (%)</label>
                  <input
                    type="number"
                    value={formData.targetRate}
                    onChange={(e) => setFormData({ ...formData, targetRate: e.target.value })}
                    className="input-field"
                    placeholder="20"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="input-field"
                >
                  {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field min-h-[100px]"
                  placeholder="Any notes about this brand..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-white/10">
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBrand}
                disabled={!formData.name}
                className="btn-primary"
              >
                Add Brand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-aa-dark-500 rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-semibold text-white">Send Email</h2>
                <p className="text-sm text-white/60">To: {selectedBrand.name}</p>
              </div>
              <button
                onClick={() => { setShowEmailModal(false); setSelectedBrand(null); }}
                className="p-2 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Template</label>
                <select
                  value={emailData.templateId}
                  onChange={(e) => handleSelectTemplate(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a template...</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Subject</label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  className="input-field"
                  placeholder="Email subject"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Body</label>
                <textarea
                  value={emailData.body}
                  onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                  className="input-field min-h-[300px] font-mono text-sm"
                  placeholder="Email body..."
                />
              </div>

              <div className="p-3 bg-aa-dark-600 rounded-lg">
                <p className="text-xs text-white/40 mb-2">Available variables:</p>
                <div className="flex flex-wrap gap-2">
                  {['brand_name', 'contact_name', 'shop_name', 'category', 'current_rate', 'proposed_rate'].map((v) => (
                    <code key={v} className="text-xs px-2 py-1 bg-aa-dark-400 rounded text-aa-orange">
                      {`{{${v}}}`}
                    </code>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-white/10">
              <button
                onClick={() => { setShowEmailModal(false); setSelectedBrand(null); }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendEmail(false)}
                disabled={!emailData.subject || !emailData.body}
                className="btn-secondary"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSendEmail(true)}
                disabled={!emailData.subject || !emailData.body || !selectedBrand.contactEmail}
                className="btn-primary flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
