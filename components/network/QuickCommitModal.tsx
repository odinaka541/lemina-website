'use client';

import { useState } from 'react';
import { X, ShieldCheck, ArrowRight, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/providers/ToastProvider';

interface Deal {
    id: string;
    company_name: string;
    min_ticket: number;
    max_ticket: number;
    amount_committed: number;
    total_allocation: number;
}

interface QuickCommitModalProps {
    isOpen: boolean;
    onClose: () => void;
    deal: Deal | null;
}

export default function QuickCommitModal({ isOpen, onClose, deal }: QuickCommitModalProps) {
    const [amount, setAmount] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    if (!deal) return null;

    const remaining = deal.total_allocation - deal.amount_committed;
    const maxCommit = Math.min(deal.max_ticket, remaining);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const value = parseFloat(amount.replace(/,/g, ''));

        if (!value || value < deal.min_ticket) {
            showToast(`Minimum ticket is $${deal.min_ticket.toLocaleString()}`, 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/network/deals/${deal.id}/commit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: value })
            });

            if (!res.ok) throw new Error('Commit failed');

            showToast(`Successfully committed $${value.toLocaleString()} to ${deal.company_name}`, 'success');
            onClose();
        } catch (error) {
            showToast('Failed to process commitment. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
            setAmount('');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Commit to {deal.company_name}</h3>
                                <p className="text-sm text-slate-500 mt-1">Allocation closing soon.</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Commitment Amount</label>
                                <div className="flex gap-3">
                                    <div className="w-14 h-14 bg-slate-50 border-2 border-slate-100 rounded-xl flex items-center justify-center text-xl font-bold text-slate-400 shrink-0">
                                        $
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder={`${deal.min_ticket}`}
                                            min="0"
                                            step="100"
                                            className="w-full h-14 px-4 text-lg font-bold border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-300"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs font-medium text-slate-500 px-1">
                                    <span>Min: ${deal.min_ticket.toLocaleString()}</span>
                                    <span>Max: ${maxCommit.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl flex justify-between items-center border border-slate-100">
                                <span className="text-slate-600 font-bold">Total Commitment</span>
                                <span className="font-bold text-2xl text-emerald-600 tracking-tight">
                                    ${amount ? parseFloat(amount).toLocaleString() : '0.00'}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !amount}
                                className="w-full py-4 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader size={18} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={18} />
                                        Confirm Commitment
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
