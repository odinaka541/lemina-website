'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Search, DollarSign, Users, Calendar,
    Upload, FileText, AlertCircle, Plus,
    Loader2, UserCheck, Layout, ChevronDown, PieChart
} from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';

interface CreateDealModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface Company {
    id: string;
    name: string;
    website?: string;
    sector?: string;
    country?: string;
}

interface NetworkContact {
    id: string;
    name: string;
    role: string;
}

interface DealFormData {
    company_id: string | null;
    new_company_name?: string;
    new_company_website?: string;
    new_company_country?: string;
    new_company_sector?: string;
    investment_amount: number | '';
    round_size?: number | '';
    deal_source: 'warm_intro' | 'cold_outreach' | 'conference' | 'network_referral' | 'other' | '';
    initial_notes?: string;
    introduced_by?: string;
    expected_close_date?: string;
    is_syndicate: boolean;
    syndicate_lead?: string;
    probability?: number;
    priority: 'High' | 'Medium' | 'Low';
}

// Mock contacts for demo
const MOCK_CONTACTS: NetworkContact[] = [
    { id: '1', name: 'Chioma Davis', role: 'Partner' },
    { id: '2', name: 'David Oyelowo', role: 'Angel Investor' },
    { id: '3', name: 'Sarah Chen', role: 'VC Associate' }
];

export default function CreateDealModal({ isOpen, onClose, onSuccess }: CreateDealModalProps) {
    const { showToast } = useToast();

    // Data State
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isNewCompany, setIsNewCompany] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    // Form State
    const [formData, setFormData] = useState<DealFormData>(() => {
        const date = new Date();
        date.setDate(date.getDate() + 90);
        const defaultCloseDate = date.toISOString().split('T')[0];

        return {
            company_id: null,
            investment_amount: '',
            deal_source: '',
            is_syndicate: false,
            round_size: '',
            priority: 'Medium',
            expected_close_date: defaultCloseDate
        };
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Load companies
    useEffect(() => {
        if (isOpen) {
            fetchCompanies();
        }
    }, [isOpen]);

    const fetchCompanies = async () => {
        try {
            const res = await fetch('/api/companies?limit=100');
            const json = await res.json();
            if (json.data) {
                setCompanies(json.data);
            }
        } catch (error) {
            console.error('Failed to load companies');
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.company_id && !formData.new_company_name) {
            newErrors.company = 'Please select or add a company';
        }

        if (isNewCompany) {
            if (!formData.new_company_name) newErrors.new_company_name = 'Company name is required';
            if (!formData.new_company_country) newErrors.new_company_country = 'Country is required';
            if (!formData.new_company_sector) newErrors.new_company_sector = 'Sector is required';
        }

        if (!formData.investment_amount || Number(formData.investment_amount) <= 0) {
            newErrors.investment_amount = 'Investment amount must be greater than $0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            // Mark all potentially invalid fields as touched to show errors
            setTouched({
                company: true,
                new_company_name: true,
                new_company_country: true,
                new_company_sector: true,
                investment_amount: true,
                deal_source: true
            });
            return;
        }

        setIsSubmitting(true);

        try {
            let companyId = formData.company_id;

            // 1. Create Company if New
            if (isNewCompany && formData.new_company_name) {
                const companyRes = await fetch('/api/companies', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.new_company_name,
                        website: formData.new_company_website,
                        location: formData.new_company_country, // Mapping country to location
                        description: `Sector: ${formData.new_company_sector}`, // Simple mapping
                        matchScore: 40 // Default for new manual entry
                    })
                });

                if (!companyRes.ok) throw new Error('Failed to create company');
                const companyData = await companyRes.json();
                companyId = companyData.data.id; // Adjust based on API response structure
            }

            // 2. Create Deal
            const dealRes = await fetch('/api/pipeline/deals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyId: companyId, // Note: API expects companyId (camelCase) based on previous code
                    stage: 'inbox',
                    amount: Number(formData.investment_amount),
                    // probability removed from UI, defaulting API side
                    round_size: formData.round_size ? Number(formData.round_size) : Number(formData.investment_amount),
                    notes: formData.initial_notes, // Direct mapping to new notes column
                    deal_source: formData.deal_source,
                    expected_close_date: formData.expected_close_date,
                    is_syndicate: formData.is_syndicate,
                    syndicate_lead: formData.syndicate_lead,
                    introduced_by: formData.introduced_by,
                    priority: formData.priority
                })
            });

            if (!dealRes.ok) throw new Error('Failed to create deal');
            const dealData = await dealRes.json();

            // 3. Activity Log
            await fetch('/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'deal_added',
                    company_id: companyId,
                    description: `Added deal for ${isNewCompany ? formData.new_company_name : companies.find(c => c.id === companyId)?.name} to pipeline`
                })
            });

            // 4. File Uploads
            if (uploadedFiles.length > 0) {
                for (const file of uploadedFiles) {
                    const uploadData = new FormData();
                    uploadData.append('file', file);
                    // Assuming dealData returns { deal: { id: ... } } or { data: { id: ... } } or just { id: ... }
                    // Based on step 2 err check, let's look at dealData structure safely.
                    // The standard API response in this project seems to be { data: ... }
                    const dealId = dealData.data?.id || dealData.deal?.id || dealData.id;

                    if (dealId) {
                        uploadData.append('deal_id', dealId); // Some endpoints expect deal_id, others entity_id. Sticking to user spec 'deal_id'

                        await fetch('/api/documents/upload', {
                            method: 'POST',
                            body: uploadData
                        });
                    }
                }
            }

            showToast('Deal added to pipeline', 'success');
            onSuccess();
            onClose();

        } catch (error: any) {
            console.error('Error creating deal:', error);
            showToast('Failed to create deal', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const getDaysDifference = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const diffTime = Math.abs(date.getTime() - today.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#030712]/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
                onClick={onClose}
            >
                <div className="flex items-center justify-center w-full h-full p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-[600px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden relative max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0">
                            <h2 className="text-xl font-bold text-slate-900">Add New Deal</h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5 bg-white overflow-y-auto custom-scrollbar">

                            {/* TASK 1.1: Company Selector */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">Target Company <span className="text-red-500">*</span></label>

                                {!isNewCompany ? (
                                    <div className="flex items-stretch shadow-sm group">
                                        <div className="w-11 flex items-center justify-center bg-slate-50 border border-slate-200 border-r-0 rounded-l-lg text-slate-400 group-hover:border-emerald-500/30 group-hover:text-emerald-500 transition-colors">
                                            <Search size={20} />
                                        </div>
                                        <div className="relative flex-1">
                                            <select
                                                className="w-full h-11 appearance-none bg-slate-50 border border-slate-200 rounded-r-lg rounded-l-none pl-3 pr-8 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 cursor-pointer hover:bg-white"
                                                value={formData.company_id || ''}
                                                onChange={(e) => {
                                                    if (e.target.value === 'create_new') {
                                                        setIsNewCompany(true);
                                                        setFormData(prev => ({ ...prev, company_id: null }));
                                                    } else {
                                                        setFormData(prev => ({ ...prev, company_id: e.target.value }));
                                                        if (touched.company) setTouched(prev => ({ ...prev, company: false }));
                                                    }
                                                }}
                                            >
                                                <option value="">Search companies...</option>
                                                {companies.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                                <option value="create_new" className="font-semibold text-emerald-600 bg-emerald-50">+ Add New Company</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <ChevronDown size={14} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-5 bg-slate-50 rounded-lg space-y-4 border border-slate-200">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-1">
                                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <Plus size={16} className="text-emerald-500" /> New Company
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setIsNewCompany(false)}
                                                className="text-xs uppercase font-bold text-slate-400 hover:text-slate-700 hover:underline"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                        <div>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
                                                placeholder="Company Name *"
                                                value={formData.new_company_name || ''}
                                                onChange={e => setFormData({ ...formData, new_company_name: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <select
                                                className="w-full px-2 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
                                                value={formData.new_company_country || ''}
                                                onChange={e => setFormData({ ...formData, new_company_country: e.target.value })}
                                            >
                                                <option value="">Country *</option>
                                                <option value="Nigeria">Nigeria</option>
                                                <option value="Kenya">Kenya</option>
                                                <option value="South Africa">South Africa</option>
                                                <option value="Egypt">Egypt</option>
                                                <option value="Ghana">Ghana</option>
                                            </select>
                                            <select
                                                className="w-full px-2 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
                                                value={formData.new_company_sector || ''}
                                                onChange={e => setFormData({ ...formData, new_company_sector: e.target.value })}
                                            >
                                                <option value="">Sector *</option>
                                                <option value="Fintech">Fintech</option>
                                                <option value="Healthtech">Healthtech</option>
                                                <option value="Logistics">Logistics</option>
                                                <option value="AgriTech">AgriTech</option>
                                                <option value="Cleantech">Cleantech</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <input
                                            type="url"
                                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
                                            placeholder="Website URL (Optional)"
                                            value={formData.new_company_website || ''}
                                            onChange={e => setFormData({ ...formData, new_company_website: e.target.value })}
                                        />
                                    </div>
                                )}
                                {(touched.company && !formData.company_id && !isNewCompany) && (
                                    <p className="text-xs text-red-500">Please select a company</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Your Investment <span className="text-red-500">*</span></label>
                                    <div className="flex items-stretch shadow-sm group">
                                        <div className="w-11 flex items-center justify-center bg-slate-50 border border-slate-200 border-r-0 rounded-l-lg text-slate-400 group-hover:border-emerald-500/30 group-hover:text-emerald-500 transition-colors">
                                            <DollarSign size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            step="100"
                                            className="flex-1 w-full h-11 bg-slate-50 border border-slate-200 rounded-r-lg rounded-l-none pl-3 pr-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 hover:bg-white"
                                            placeholder="50,000"
                                            value={formData.investment_amount}
                                            onChange={(e) => setFormData(prev => ({ ...prev, investment_amount: parseFloat(e.target.value) || '' }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Round Size <span className="text-slate-400 font-normal text-xs ml-1">(Total Raise)</span></label>
                                    <div className="flex items-stretch shadow-sm group">
                                        <div className="w-11 flex items-center justify-center bg-slate-50 border border-slate-200 border-r-0 rounded-l-lg text-slate-400 group-hover:border-emerald-500/30 group-hover:text-emerald-500 transition-colors">
                                            <PieChart size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            step="100"
                                            className="flex-1 w-full h-11 bg-slate-50 border border-slate-200 rounded-r-lg rounded-l-none pl-3 pr-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 hover:bg-white"
                                            placeholder="2,000,000"
                                            value={formData.round_size || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, round_size: parseFloat(e.target.value) || '' }))}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* NEW: Priority Selector */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">Priority</label>
                                <div className="flex gap-2">
                                    {['High', 'Medium', 'Low'].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, priority: p as any }))}
                                            className={`flex-1 h-10 text-sm font-medium rounded-lg border transition-all flex items-center justify-center gap-2
                                                ${formData.priority === p
                                                    ? (p === 'High' ? 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-500' :
                                                        p === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-700 ring-1 ring-amber-500' :
                                                            'bg-slate-50 border-slate-200 text-slate-700 ring-1 ring-slate-500')
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                                }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${p === 'High' ? 'bg-red-500' : p === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                                                }`} />
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Initial Notes */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">Initial Notes</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 resize-none hover:bg-white"
                                    placeholder="Why this deal? First impressions?"
                                    value={formData.initial_notes || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, initial_notes: e.target.value }))}
                                />
                            </div>

                            {/* TASK 3: Expected Close & Syndicate */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">Expected Close</label>
                                    <div className="flex items-stretch shadow-sm group">
                                        <div className="w-11 flex items-center justify-center bg-slate-50 border border-slate-200 border-r-0 rounded-l-lg text-slate-400 group-hover:border-emerald-500/30 group-hover:text-emerald-500 transition-colors">
                                            <Calendar size={18} />
                                        </div>
                                        <input
                                            type="date"
                                            className="flex-1 w-full h-11 bg-slate-50 border border-slate-200 rounded-r-lg rounded-l-none pl-3 pr-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all hover:bg-white"
                                            value={formData.expected_close_date || ''}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setFormData(prev => ({ ...prev, expected_close_date: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                {/* Syndicate Toggle */}
                                <div className="flex items-end h-full">
                                    <div className="w-full h-11 pl-2 bg-white flex items-center">
                                        <label className="flex items-center gap-3 cursor-pointer select-none group">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                                                checked={formData.is_syndicate}
                                                onChange={(e) => setFormData(prev => ({ ...prev, is_syndicate: e.target.checked }))}
                                            />
                                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Syndicate Deal?</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {formData.is_syndicate && (
                                <div className="animate-in fade-in slide-in-from-top-1 -mt-3">
                                    <input
                                        type="text"
                                        placeholder="Name of Syndicate Lead..."
                                        className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-emerald-500 outline-none transition-all h-11"
                                        value={formData.syndicate_lead || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, syndicate_lead: e.target.value }))}
                                    />
                                </div>
                            )}

                            {/* Compact Documents - Horizontal Layout */}
                            <div className="border border-dashed border-slate-300 rounded-lg px-5 py-3 flex items-center justify-between hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-colors cursor-pointer group" onClick={() => document.getElementById('file-upload')?.click()}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-100 p-2 rounded-md text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-colors">
                                        <Upload size={16} />
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">Add Documents</span>
                                        <span className="text-slate-400 ml-1">(Optional)</span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">PDF, DOCX</span>
                                <input id="file-upload" type="file" multiple className="hidden" onChange={(e) => {
                                    if (e.target.files) setUploadedFiles(Array.from(e.target.files));
                                }} />
                            </div>
                            {/* File List */}
                            {uploadedFiles.length > 0 && (
                                <div className="space-y-1">
                                    {uploadedFiles.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded text-xs border border-slate-100">
                                            <span className="truncate max-w-[200px] text-slate-600">{file.name}</span>
                                            <button type="button" onClick={() => setUploadedFiles(fs => fs.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </form>

                        {/* Footer */}
                        <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 shrink-0">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-sm shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform active:scale-95 transition-all"
                            >
                                {isSubmitting ? (
                                    <> <Loader2 size={16} className="animate-spin" /> Creating... </>
                                ) : (
                                    <> <Plus size={16} /> Create Deal </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
