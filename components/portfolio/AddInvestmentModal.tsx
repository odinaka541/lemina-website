'use client';

import { useState, useEffect, useRef } from 'react';
import {
    X, Search, DollarSign, Calendar, Upload, FileText,
    AlertCircle, Plus, Loader2, Building2, Globe, Percent,
    Lightbulb, Zap, Info
} from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import { createClient } from '@/lib/supabase/client';

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
            newErrors.amount = 'Investment amount must be greater than $0';
        }

        // Date validation
        if (!formData.investment_date) {
            newErrors.investment_date = 'Investment date is required';
        } else {
            const date = new Date(formData.investment_date);
            const today = new Date();
            if (date > today) {
                newErrors.investment_date = 'Investment date cannot be in the future';
            }
        }

        // Round type validation
        if (!formData.round_type) {
            newErrors.round_type = 'Round type is required';
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
                showToast(`Created company: ${formData.new_company_name}`, 'success');
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
                showToast(`Uploading ${uploadedFiles.length} document(s)...`, 'info');

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

                showToast('Documents uploaded & analysis started', 'success');
            } else {
                showToast('Investment added successfully!', 'success');
            }

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

    // Components helpers
    function FieldError({ field }: { field: string }) {
        if (!touched[field] || !errors[field]) return null;

        return (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors[field]}
            </p>
        );
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Add New Investment
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-8 flex-1 overflow-y-auto">

                    {/* SECTION 1: INVESTMENT DETAILS */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">1</span>
                            Investment Details
                        </h3>

                        {/* Company Selection */}
                        {!isNewCompany ? (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Company *
                                </label>

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

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
                                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none bg-white"
                                    >
                                        <option value="">Select a company...</option>
                                        {companies.map(company => (
                                            <option key={company.id} value={company.id}>
                                                {company.name} {company.sector ? `• ${company.sector}` : ''}
                                            </option>
                                        ))}
                                        <option value="create_new" className="font-semibold text-emerald-600 bg-emerald-50">
                                            + Add New Company
                                        </option>
                                    </select>
                                </div>
                                <FieldError field="company" />
                            </div>
                        ) : (
                            // New company form (expanded)
                            <div className="space-y-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 animate-in fade-in zoom-in-95">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-emerald-600" />
                                        <span className="text-sm font-medium text-gray-900">
                                            Adding New Company
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsNewCompany(false);
                                            setFormData(prev => ({
                                                ...prev,
                                                new_company_name: '',
                                                new_company_website: '',
                                                new_company_country: '',
                                                new_company_sector: ''
                                            }));
                                        }}
                                        className="text-xs text-gray-600 hover:text-gray-800 underline"
                                    >
                                        Select existing instead
                                    </button>
                                </div>

                                {/* Company Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.new_company_name}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            new_company_name: e.target.value
                                        })}
                                        onBlur={() => setTouched({ ...touched, new_company_name: true })}
                                        placeholder="e.g., Cape Verde Fintech"
                                        className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        required
                                    />
                                    <FieldError field="new_company_name" />
                                </div>

                                {/* Website */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Website (optional)
                                    </label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={formData.new_company_website}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                new_company_website: e.target.value
                                            })}
                                            placeholder="https://..."
                                            className="w-full pl-10 pr-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Country & Sector */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Country *
                                        </label>
                                        <select
                                            value={formData.new_company_country}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                new_company_country: e.target.value
                                            })}
                                            className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                            required
                                        >
                                            <option value="">Select...</option>
                                            <option value="NG">🇳🇬 Nigeria</option>
                                            <option value="KE">🇰🇪 Kenya</option>
                                            <option value="ZA">🇿🇦 South Africa</option>
                                            <option value="CV">🇨🇻 Cape Verde</option>
                                            <option value="MZ">🇲🇿 Mozambique</option>
                                            <option value="AO">🇦🇴 Angola</option>
                                            <option value="GH">🇬🇭 Ghana</option>
                                            <option value="EG">🇪🇬 Egypt</option>
                                        </select>
                                        <FieldError field="new_company_country" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sector *
                                        </label>
                                        <select
                                            value={formData.new_company_sector}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                new_company_sector: e.target.value
                                            })}
                                            className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                            required
                                        >
                                            <option value="">Select...</option>
                                            <option value="Fintech">Fintech</option>
                                            <option value="Healthtech">Healthtech</option>
                                            <option value="Logistics">Logistics</option>
                                            <option value="Edtech">Edtech</option>
                                            <option value="Agritech">Agritech</option>
                                            <option value="Ecommerce">E-commerce</option>
                                            <option value="Cleantech">Cleantech</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <FieldError field="new_company_sector" />
                                    </div>
                                </div>

                                <p className="text-xs text-gray-600 flex items-start gap-1.5">
                                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                    <span>We'll create a basic profile. You can add more details later.</span>
                                </p>
                            </div>
                        )}

                        {/* Amount & Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount Invested *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            amount: e.target.value
                                        })}
                                        onBlur={() => setTouched({ ...touched, amount: true })}
                                        placeholder="50000"
                                        min="0"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <FieldError field="amount" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Investment Date *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <input
                                        type="date"
                                        value={formData.investment_date || new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            investment_date: e.target.value
                                        })}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <FieldError field="investment_date" />
                            </div>
                        </div>

                        {/* Financials: Round, Valuation, Ownership */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Round Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Round Type *
                                </label>
                                <select
                                    value={formData.round_type}
                                    onChange={(e) => setFormData({ ...formData, round_type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                >
                                    <option value="SAFE">SAFE</option>
                                    <option value="Convertible Note">Convertible Note</option>
                                    <option value="Seed">Seed (Equity)</option>
                                    <option value="Series A">Series A</option>
                                    <option value="Series B+">Series B+</option>
                                    <option value="Secondary">Secondary</option>
                                    <option value="Token">Token/SAFT</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Valuation (Post-Money) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valuation (Post)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <input
                                        type="number"
                                        value={formData.valuation_post_money}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const newVal = value ? parseFloat(value) : '';
                                            const newState = { ...formData, valuation_post_money: value };

                                            // Auto-calculate ownership
                                            if (formData.amount && newVal) {
                                                const amountVal = parseFloat(formData.amount);
                                                const valuationVal = newVal as number;
                                                const ownership = (amountVal / valuationVal) * 100;
                                                newState.ownership_percentage = ownership.toFixed(3);
                                            }

                                            setFormData(newState);
                                        }}
                                        placeholder="5000000"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        min="0"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Post-money valuation</p>
                            </div>

                            {/* Ownership % */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ownership %
                                </label>
                                <div className="relative">
                                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <input
                                        type="number"
                                        value={formData.ownership_percentage}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            ownership_percentage: e.target.value
                                        })}
                                        placeholder="0.5"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        step="0.001"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Your stake (auto-calc)</p>
                            </div>
                        </div>

                        {/* Helper for calculation */}
                        {formData.amount && formData.valuation_post_money && (
                            <div className="p-2 bg-blue-50 rounded text-xs text-blue-700 flex items-center gap-2">
                                <Lightbulb size={12} className="shrink-0" />
                                With ${(parseFloat(formData.amount) / 1000).toFixed(0)}k investment at ${(parseFloat(formData.valuation_post_money) / 1000000).toFixed(1)}M valuation, you own ~{((parseFloat(formData.amount) / parseFloat(formData.valuation_post_money)) * 100).toFixed(2)}%
                            </div>
                        )}
                    </div>

                    {/* SECTION 2: CONTEXT & THESIS */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">2</span>
                            Context & Thesis
                        </h3>

                        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-700">
                                AI uses your thesis to assess if the company is meeting YOUR expectations.
                                The more context you provide, the better AI can analyze future updates.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                What attracted you to this company?
                            </label>
                            <textarea
                                value={formData.thesis_attracted}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    thesis_attracted: e.target.value
                                })}
                                placeholder="Strong founding team, solving payments for SMEs..."
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none focus:outline-none"
                                maxLength={500}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                What metrics mattered at investment?
                            </label>
                            <textarea
                                value={formData.thesis_metrics}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    thesis_metrics: e.target.value
                                })}
                                placeholder="$500k ARR, 20% MoM growth..."
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none focus:outline-none"
                                maxLength={500}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                What needs to happen for 10x success?
                            </label>
                            <textarea
                                value={formData.thesis_success}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    thesis_success: e.target.value
                                })}
                                placeholder="Expand to Kenya, hit $5M ARR..."
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none focus:outline-none"
                                maxLength={500}
                            />
                        </div>
                    </div>

                    {/* SECTION 3: INITIAL DOCUMENTS */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">3</span>
                            Initial Documents
                        </h3>

                        <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <Zap className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-emerald-900 mb-1">
                                    Recommended: Upload baseline documents
                                </p>
                                <p className="text-xs text-emerald-700">
                                    Upload documents from time of investment (SAFE, pitch deck). AI compares future updates against this baseline.
                                </p>
                            </div>
                        </div>

                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group bg-slate-50 relative"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.add('border-emerald-500', 'bg-emerald-50');
                            }}
                            onDragLeave={(e) => {
                                e.currentTarget.classList.remove('border-emerald-500', 'bg-emerald-50');
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('border-emerald-500', 'bg-emerald-50');
                                const files = Array.from(e.dataTransfer.files);
                                const validFiles = files.filter(f =>
                                    ['application/pdf'].includes(f.type) &&
                                    f.size <= 10 * 1024 * 1024
                                );
                                if (validFiles.length < files.length) {
                                    showToast('Only PDF files under 10MB are supported for now', 'error');
                                }
                                setUploadedFiles(prev => [...prev, ...validFiles]);
                            }}
                        >
                            <Upload className="h-10 w-10 text-gray-400 group-hover:text-emerald-500 mx-auto mb-3 transition-colors" />
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="text-emerald-600 font-semibold group-hover:text-emerald-700">
                                    Click to upload
                                </span>
                                {' '}or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mb-2">
                                PDF up to 10MB each
                            </p>
                            <p className="text-xs text-gray-400">
                                ⚡ AI will analyze in ~10-15 seconds
                            </p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".pdf"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    const validFiles = files.filter(f =>
                                        ['application/pdf'].includes(f.type) &&
                                        f.size <= 10 * 1024 * 1024
                                    );
                                    if (validFiles.length < files.length) {
                                        showToast('Only PDF files under 10MB are supported for now', 'error');
                                    }
                                    setUploadedFiles(prev => [...prev, ...validFiles]);
                                }}
                                className="hidden"
                            />
                        </div>

                        {/* Show uploaded files */}
                        {uploadedFiles.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-700">
                                    {uploadedFiles.length} document{uploadedFiles.length !== 1 ? 's' : ''} ready to download
                                </p>
                                {uploadedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-gray-700 font-medium truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                            aria-label={`Remove ${file.name}`}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </form>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 sticky bottom-0 z-10">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 hidden md:flex">
                        <Info className="h-3.5 w-3.5" />
                        {uploadedFiles.length > 0
                            ? `${uploadedFiles.length} document(s) will be analyzed`
                            : 'You can add documents later'
                        }
                    </p>

                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    Create Investment
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

