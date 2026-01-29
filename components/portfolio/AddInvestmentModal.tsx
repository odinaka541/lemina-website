'use client';

import { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Building2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import { createClient } from '@/lib/supabase/client';

interface AddInvestmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddInvestmentModal({ isOpen, onClose, onSuccess }: AddInvestmentModalProps) {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [companies, setCompanies] = useState<any[]>([]);
    const [loadingCompanies, setLoadingCompanies] = useState(true);

    // Form State
    const [companyId, setCompanyId] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [shareClass, setShareClass] = useState('SAFE');

    const supabase = createClient();

    useEffect(() => {
        if (isOpen) {
            fetchCompanies();
        }
    }, [isOpen]);

    const fetchCompanies = async () => {
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('id, name')
                .order('name');

            if (error) throw error;
            setCompanies(data || []);
            if (data && data.length > 0) {
                setCompanyId(data[0].id.toString());
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoadingCompanies(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!companyId || !amount || !date) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create record
            const { error } = await supabase
                .from('investments')
                .insert({
                    company_id: parseInt(companyId),
                    amount_invested: parseFloat(amount),
                    investment_date: date,
                    share_class: shareClass,
                    current_value: parseFloat(amount) // Default to cost basis
                });

            if (error) throw error;

            showToast('Investment added successfully!', 'success');
            onSuccess();
            handleClose();

        } catch (error: any) {
            console.error('Error adding investment:', error);
            showToast(error.message || 'Failed to add investment', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setAmount('');
        setDate('');
        setShareClass('SAFE');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <DollarSign size={18} className="text-emerald-600" />
                        Add Portfolio Investment
                    </h2>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Company Select */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Company</label>
                        <div className="relative">
                            <select
                                value={companyId}
                                onChange={(e) => setCompanyId(e.target.value)}
                                disabled={loadingCompanies}
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none font-medium"
                            >
                                {loadingCompanies ? (
                                    <option>Loading companies...</option>
                                ) : companies.length === 0 ? (
                                    <option>No companies found</option>
                                ) : (
                                    companies.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))
                                )}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <Building2 size={16} />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Don't see the company? <a href="/dashboard/companies" className="text-emerald-600 hover:underline">Add it first</a>.
                        </p>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Investment Amount (USD)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                            <input
                                type="number"
                                required
                                min="0"
                                step="1000"
                                placeholder="e.g. 50000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                            />
                        </div>
                    </div>

                    {/* Date & Class */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Share Class</label>
                            <select
                                value={shareClass}
                                onChange={(e) => setShareClass(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                            >
                                <option value="SAFE">SAFE</option>
                                <option value="Convertible Note">Convertible Note</option>
                                <option value="Common Stock">Common Stock</option>
                                <option value="Preferred Stock">Preferred Stock</option>
                                <option value="Series A">Series A</option>
                                <option value="Series B">Series B</option>
                            </select>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <CheckCircle2 size={16} /> Save Investment
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
