'use client';

import { useState, useEffect, useRef } from 'react';
import {
    X, Search, DollarSign, Calendar, Upload, FileText,
    AlertCircle, Plus, Loader2, Building2, Globe, Percent,
    Lightbulb, Zap, Info, ArrowRight, CheckCircle2
} from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

interface AddInvestmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const INITIAL_FORM_STATE = {
    company_id: '',
    new_company_name: '',
    new_company_website: '',
    new_company_country: '',
    new_company_sector: '',
    amount: '',
    investment_date: new Date().toISOString().split('T')[0],
    round_type: 'SAFE',
    round_size: '',
    valuation_post_money: '',
    ownership_percentage: '',
    thesis_attracted: '',
    thesis_metrics: '',
    thesis_success: ''
};

export default function AddInvestmentModal({ isOpen, onClose, onSuccess }: AddInvestmentModalProps) {
    const { showToast } = useToast();
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [isNewCompany, setIsNewCompany] = useState(false);
    const [companies, setCompanies] = useState<any[]>([]);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [userId, setUserId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    const supabase = createClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load companies and user on mount
    useEffect(() => {
        if (isOpen) {
            loadCompanies();
            getCurrentUser();
            setFormData(INITIAL_FORM_STATE);
            setUploadedFiles([]);
            setErrors({});
            setTouched({});
            setIsNewCompany(false);
            setCurrentStep(1);
        }
    }, [isOpen]);

    async function getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserId(user.id);
    }

    async function loadCompanies() {
        setLoadingCompanies(true);
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('id, name, sector')
                .order('name');

            if (error) throw error;
            setCompanies(data || []);
        } catch (error: any) {
            console.error('Error fetching companies:', error);
            showToast('Failed to load companies', 'error');
        } finally {
            setLoadingCompanies(false);
        }
    }

    function validateForm(): boolean {
        const newErrors: Record<string, string> = {};

        // Company validation
        if (!formData.company_id && !isNewCompany) {
            newErrors.company = 'Please select a company';
        }

        if (isNewCompany) {
            if (!formData.new_company_name?.trim()) {
                newErrors.new_company_name = 'Company name is required';
            }
            if (!formData.new_company_country) {
                newErrors.new_company_country = 'Country is required';
            }
            if (!formData.new_company_sector) {
                newErrors.new_company_sector = 'Sector is required';
            }
        }

        // Amount validation
        const amount = parseFloat(formData.amount);
        if (!formData.amount || isNaN(amount) || amount <= 0) {
            newErrors.amount = 'Amount > $0';
        }

        // Date validation
        if (!formData.investment_date) {
            newErrors.investment_date = 'Required';
        }

        // Round type validation
        if (!formData.round_type) {
            newErrors.round_type = 'Required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!userId) {
            showToast('You must be logged in to add an investment', 'error');
            return;
        }

        // Validate all fields
        if (!validateForm()) {
            showToast('Please fix the errors before submitting', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            // Step 1: Create company if new
            let companyId = formData.company_id;

            if (isNewCompany && formData.new_company_name) {
                const { data: companyData, error: companyError } = await supabase
                    .from('companies')
                    .insert({
                        name: formData.new_company_name,
                        website: formData.new_company_website,
                        headquarters: formData.new_company_country,
                        sector: formData.new_company_sector,
                        verification_tier: 1,
                        confidence_score: 40,
                        description: `${formData.new_company_sector} company based in ${formData.new_company_country}`
                    })
                    .select()
                    .single();

                if (companyError) throw companyError;
                companyId = companyData.id;
            }

            // Step 2: Create investment
            const investmentPayload = {
                company_id: parseInt(companyId),
                user_id: userId, // Required for RLS
                amount_invested: parseFloat(formData.amount),
                invested_date: formData.investment_date,
                round_type: formData.round_type,
                valuation_at_investment: formData.valuation_post_money ? parseFloat(formData.valuation_post_money) : null,
                ownership_percentage: formData.ownership_percentage ? parseFloat(formData.ownership_percentage) : null,
                current_value: parseFloat(formData.amount), // Default to cost
                status: 'active',
                investment_thesis: `Attracted: ${formData.thesis_attracted}\nMetrics: ${formData.thesis_metrics}\nSuccess: ${formData.thesis_success}`
            };

            const { data: investmentData, error: investmentError } = await supabase
                .from('investments')
                .insert(investmentPayload)
                .select()
                .single();

            if (investmentError) throw investmentError;

            // Step 3: Upload documents if any
            if (uploadedFiles.length > 0) {
                for (const file of uploadedFiles) {
                    const filePath = `portfolio/${investmentData.id}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

                    // Upload to Storage
                    const { error: uploadError } = await supabase.storage
                        .from('portfolio-documents')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    // Get Public URL
                    const { data: publicUrlData } = supabase.storage.from('portfolio-documents').getPublicUrl(filePath);

                    // Create DB Record
                    const { data: docData, error: docError } = await supabase
                        .from('portfolio_documents')
                        .insert({
                            investment_id: investmentData.id,
                            company_id: parseInt(companyId),
                            user_id: userId,
                            title: file.name.replace(/\.[^/.]+$/, ''),
                            file_name: file.name,
                            file_path: filePath,
                            file_type: 'Report',
                            file_size: file.size,
                            url: publicUrlData.publicUrl,
                            analysis_status: 'pending' // AI Trigger
                        })
                        .select()
                        .single();

                    if (docError) throw docError;

                    // Trigger AI
                    fetch('/api/ai/analyze-portfolio', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ documentId: docData.id })
                    }).catch(err => console.error("AI trigger failed", err));
                }
            }

            // Success feedback
            showToast('Investment added successfully!', 'success');

            // Reset form
            setFormData(INITIAL_FORM_STATE);
            setUploadedFiles([]);
            setIsNewCompany(false);

            // Close modal and refresh
            onClose();
            onSuccess?.();

        } catch (error: any) {
            console.error('Error creating investment:', error);
            showToast(error.message || 'Failed to create investment', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    function FieldError({ field }: { field: string }) {
        if (!touched[field] || !errors[field]) return null;
        return (
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors[field]}
            </p>
        );
    }

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
                                Add New Investment
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">Capture deal details & documents</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Progress Steps (Optional visual flair) */}
                    <div className="flex w-full h-1 bg-slate-100">
                        <div className={`h-full bg-indigo-500 transition-all duration-300 ${currentStep === 1 ? 'w-1/3' : currentStep === 2 ? 'w-2/3' : 'w-full'}`} />
                    </div>

                    {/* Scrollable Form Body */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-10">

                        {/* SECTION 1: CORE DATA */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold border border-indigo-100 shadow-sm">
                                    1
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                                    Investment Details
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {/* Company Selector */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company</label>
                                    {!isNewCompany ? (
                                        <div className="relative group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <select
                                                value={formData.company_id}
                                                onChange={(e) => {
                                                    if (e.target.value === 'create_new') {
                                                        setIsNewCompany(true);
                                                        setFormData(prev => ({ ...prev, company_id: '' }));
                                                    } else {
                                                        setFormData(prev => ({ ...prev, company_id: e.target.value }));
                                                    }
                                                }}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer hover:bg-slate-100/50"
                                            >
                                                <option value="">Select a portfolio company...</option>
                                                {companies.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                                <option value="create_new" className="font-bold text-indigo-600">+ Add New Company</option>
                                            </select>
                                            <FieldError field="company" />
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                                                    <Plus size={12} strokeWidth={3} /> New Company Profile
                                                </span>
                                                <button onClick={() => setIsNewCompany(false)} className="text-xs font-medium text-slate-500 hover:text-slate-800 underline">Cancel</button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    placeholder="Company Name"
                                                    value={formData.new_company_name}
                                                    onChange={e => setFormData({ ...formData, new_company_name: e.target.value })}
                                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                                                />
                                                <input
                                                    placeholder="Website (e.g. stripe.com)"
                                                    value={formData.new_company_website}
                                                    onChange={e => setFormData({ ...formData, new_company_website: e.target.value })}
                                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                                                />
                                                <select
                                                    value={formData.new_company_country}
                                                    onChange={e => setFormData({ ...formData, new_company_country: e.target.value })}
                                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                                                >
                                                    <option value="">Select Country...</option>
                                                    <option value="NG">Nigeria</option>
                                                    <option value="KE">Kenya</option>
                                                    <option value="ZA">South Africa</option>
                                                    <option value="US">United States</option>
                                                    <option value="UK">United Kingdom</option>
                                                </select>
                                                <select
                                                    value={formData.new_company_sector}
                                                    onChange={e => setFormData({ ...formData, new_company_sector: e.target.value })}
                                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                                                >
                                                    <option value="">Select Sector...</option>
                                                    <option value="Fintech">Fintech</option>
                                                    <option value="Healthtech">Healthtech</option>
                                                    <option value="SaaS">SaaS</option>
                                                    <option value="Ecommerce">Ecommerce</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Financials Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Invested ($)</label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors font-mono">$</span>
                                            <input
                                                type="number"
                                                placeholder="50,000"
                                                value={formData.amount}
                                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date</label>
                                        <input
                                            type="date"
                                            value={formData.investment_date}
                                            onChange={e => setFormData({ ...formData, investment_date: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Instrument</label>
                                        <select
                                            value={formData.round_type}
                                            onChange={e => setFormData({ ...formData, round_type: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                        >
                                            <option value="SAFE">SAFE</option>
                                            <option value="Equity">Equity</option>
                                            <option value="Convertible">Convertible Note</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Valuation (Post-Money)</label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors font-mono">$</span>
                                            <input
                                                type="number"
                                                placeholder="10,000,000"
                                                value={formData.valuation_post_money}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const amount = parseFloat(formData.amount);
                                                    const valuation = parseFloat(val);
                                                    let ownership = '';
                                                    if (amount && valuation) {
                                                        ownership = ((amount / valuation) * 100).toFixed(4);
                                                    }
                                                    setFormData({ ...formData, valuation_post_money: val, ownership_percentage: ownership });
                                                }}
                                                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ownership %</label>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                placeholder="0.5"
                                                value={formData.ownership_percentage}
                                                readOnly
                                                className="w-full pl-4 pr-10 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none cursor-not-allowed font-mono"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        {/* SECTION 2: THESIS & DOCS */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold border border-emerald-100 shadow-sm">
                                    2
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                                    Thesis & Files
                                </h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Investment Thesis (Why now?)</label>
                                <textarea
                                    rows={3}
                                    placeholder="e.g. Strong founder market fit, 20% MoM growth, massive TAM..."
                                    value={formData.thesis_attracted}
                                    onChange={e => setFormData({ ...formData, thesis_attracted: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
                                />
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="group border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-indigo-400 hover:bg-slate-50 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files) setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
                                    }}
                                />
                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                                        <Upload className="text-indigo-500" size={20} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">
                                        Upload Investment Documents
                                    </p>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Drag & drop checks, agreements, reports (PDF)
                                    </p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/0 group-hover:from-indigo-50/20 group-hover:to-purple-50/20 transition-all duration-500" />
                            </div>

                            {uploadedFiles.length > 0 && (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                                    {uploadedFiles.map((f, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                    <FileText size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{f.name}</span>
                                            </div>
                                            <button
                                                onClick={() => setUploadedFiles(uploadedFiles.filter((_, idx) => i !== idx))}
                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50/80 backdrop-blur-sm flex justify-between items-center">
                        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500">
                            <Info size={14} className="text-indigo-500" />
                            <span>AI will analyze uploaded files for quick insights.</span>
                        </div>
                        <div className="flex gap-3 ml-auto">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-8 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                                {isSubmitting ? 'Processing...' : 'Confirm Investment'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
