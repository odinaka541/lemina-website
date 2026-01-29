'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, DollarSign, Percent, Layout, ChevronDown } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';

interface CreateDealModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateDealModal({ isOpen, onClose, onSuccess }: CreateDealModalProps) {
    const { showToast } = useToast();
    const [companies, setCompanies] = useState<any[]>([]);
    const [loadingCompanies, setLoadingCompanies] = useState(false);

    // Form State
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [amount, setAmount] = useState('');
    const [probability, setProbability] = useState('50');
    const [stage, setStage] = useState('inbox');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCompanies();
        }
    }, [isOpen]);

    const fetchCompanies = async () => {
        setLoadingCompanies(true);
        try {
            const res = await fetch('/api/companies?limit=50');
            const json = await res.json();
            if (json.data) {
                setCompanies(json.data);
            }
        } catch (error) {
            console.error('Failed to load companies');
        } finally {
            setLoadingCompanies(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompanyId) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/pipeline/deals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyId: selectedCompanyId,
                    stage,
                    amount: parseFloat(amount) || 0,
                    probability: parseInt(probability) || 0
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to create deal');
            }

            showToast('Deal created successfully', 'success');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error creating deal:', error);
            showToast(error.message || 'Failed to create deal', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#030712]/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md bg-[var(--color-bg-secondary)]/90 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10"
                >
                    {/* Header with gradient touch */}
                    <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Add New Deal</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--input-bg)] rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Company Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Target Company</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] h-4 w-4" />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-secondary)]">
                                    <ChevronDown size={14} />
                                </div>
                                <select
                                    className="w-full appearance-none bg-[var(--input-bg)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none transition-all placeholder:text-[var(--color-text-secondary)]"
                                    value={selectedCompanyId}
                                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select a company...</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Amount & Stage Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Deal Value</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] h-4 w-4" />
                                    <input
                                        type="number"
                                        className="w-full bg-[var(--input-bg)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none transition-all placeholder:text-gray-600"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Initial Stage</label>
                                <div className="relative">
                                    <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] h-4 w-4" />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-secondary)]">
                                        <ChevronDown size={14} />
                                    </div>
                                    <select
                                        className="w-full appearance-none bg-[var(--input-bg)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none transition-all"
                                        value={stage}
                                        onChange={(e) => setStage(e.target.value)}
                                    >
                                        <option value="inbox">Inbox</option>
                                        <option value="diligence">Due Diligence</option>
                                        <option value="negotiation">Negotiation</option>
                                        <option value="committed">Committed</option>
                                        <option value="passed">Passed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Probability Slider */}
                        <div className="space-y-4 p-4 rounded-xl bg-[var(--input-bg)]/50 border border-[var(--color-border)]">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-[var(--color-text-secondary)] flex items-center gap-2">
                                    <Percent size={14} /> Probability
                                </label>
                                <span className={`text-sm font-bold ${parseInt(probability) > 70 ? 'text-emerald-500' : 'text-[var(--color-accent-primary)]'}`}>
                                    {probability}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="10"
                                className="w-full h-2 bg-[var(--color-bg-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent-primary)]"
                                value={probability}
                                onChange={(e) => setProbability(e.target.value)}
                            />
                            <div className="flex justify-between text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider font-medium">
                                <span>Low</span>
                                <span>Medium</span>
                                <span>High</span>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="pt-2 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !selectedCompanyId}
                                className="px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Deal'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
