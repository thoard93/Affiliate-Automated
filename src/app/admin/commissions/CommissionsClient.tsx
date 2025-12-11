'use client';

import { useState } from 'react';
import { DollarSign, Plus, X } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { createManualCommission } from '@/actions/commissions';
import toast from 'react-hot-toast';

type Transaction = {
    id: string;
    creatorName: string;
    creatorImage?: string | null;
    eventType: string;
    amount: number;
    status: string;
    date: Date;
};

type Stats = {
    totalPaid: number;
    pending: number;
    companyRevenue: number;
};

type Creator = {
    id: string;
    name: string;
};

export default function CommissionsClient({
    initialStats,
    initialTransactions,
    creators
}: {
    initialStats: Stats;
    initialTransactions: Transaction[];
    creators: Creator[];
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [amount, setAmount] = useState('');
    const [selectedCreator, setSelectedCreator] = useState(creators[0]?.id || '');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await createManualCommission({
                creatorId: selectedCreator,
                amount: parseFloat(amount),
                status: 'PAID', // Default to PAID for manual entry for now, or add selector
                description
            });

            if (result.success) {
                toast.success('Commission added successfully');
                setIsModalOpen(false);
                setAmount('');
                setDescription('');
                // In a real app we might re-fetch or rely on Next.js revalidatePath
            } else {
                toast.error('Failed to add commission');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Commissions</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Manual Commission
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-xl border border-white/5">
                    <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Total Payouts</div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(initialStats.totalPaid)}</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/5">
                    <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Pending</div>
                    <div className="text-2xl font-bold text-aa-gold">{formatCurrency(initialStats.pending)}</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/5">
                    <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Company Rev</div>
                    <div className="text-2xl font-bold text-aa-success">{formatCurrency(initialStats.companyRevenue)}</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/5">
                    <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Next Payout</div>
                    <div className="text-xl font-bold text-white">Dec 15, 2024</div>
                </div>
            </div>

            {/* Main Table */}
            <div className="glass-panel overflow-hidden border border-white/5 rounded-xl">
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <h2 className="font-bold text-white">Recent Transactions</h2>
                    <button className="btn-secondary text-xs px-3 py-1.5">Download CSV</button>
                </div>
                <div className="table-container">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Creator</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {initialTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-white/40">No transactions found</td>
                                </tr>
                            ) : (
                                initialTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-white/60 text-sm">{formatDate(tx.date)}</td>
                                        <td className="px-6 py-4 text-white font-medium">{tx.creatorName}</td>
                                        <td className="px-6 py-4 text-white/80">{tx.eventType}</td>
                                        <td className={`px-6 py-4 text-right font-mono font-medium ${tx.amount < 0 ? 'text-white/60' : 'text-aa-success'}`}>
                                            {formatCurrency(tx.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${tx.status === 'PAID' ? 'bg-aa-gold/10 text-aa-gold border-aa-gold/20' :
                                                    tx.status === 'PENDING' ? 'bg-white/5 text-white/60 border-white/10' :
                                                        'bg-aa-success/10 text-aa-success border-aa-success/20'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Simple Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-bold text-white mb-4">Add Manual Commission</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">Creator</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-aa-gold/50"
                                    value={selectedCreator}
                                    onChange={(e) => setSelectedCreator(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select a creator</option>
                                    {creators.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">Amount ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-aa-gold/50"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">Description (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-aa-gold/50"
                                    placeholder="e.g. Offline Deal"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-secondary px-4 py-2 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-primary px-4 py-2 text-sm"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Commission'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
