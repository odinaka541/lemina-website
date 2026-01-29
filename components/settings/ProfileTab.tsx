'use client';

import { useState } from 'react';
import { Save, Loader2, Check } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';

export default function ProfileTab({ initialData, onSave }: { initialData: any, onSave: (data: any) => Promise<void> }) {
    const [formData, setFormData] = useState(initialData);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    // Checkboxes for Investment Focus
    const SECTORS = ['Fintech', 'Healthtech', 'AgriTech', 'Logistics', 'Ecommerce', 'Clean Energy', 'Edtech'];
    const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B+'];
    const GEOGRAPHIES = ['Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Ghana', 'Rwanda'];

    const handleCheckboxChange = (field: string, value: string) => {
        const current = formData[field] || [];
        const updated = current.includes(value)
            ? current.filter((item: string) => item !== value)
            : [...current, value];
        setFormData({ ...formData, [field]: updated });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(formData);
            showToast('Profile saved successfully', 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to save profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50" />

            <h2 className="text-xl font-bold text-slate-900 mb-6">Public Profile</h2>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                        <input
                            type="text"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Title</label>
                        <input
                            type="text"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                            value={formData.job_title}
                            onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                            placeholder="e.g. Managing Partner"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Name</label>
                    <input
                        type="text"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        placeholder="e.g. Lemina Capital"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Bio</label>
                    <textarea
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all min-h-[100px] resize-none placeholder:text-slate-400"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                    />
                </div>

                <hr className="border-slate-100 my-8" />

                <h2 className="text-xl font-bold text-slate-900 mb-6">Investment Focus</h2>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Sectors</label>
                        <div className="flex flex-wrap gap-2">
                            {SECTORS.map(sector => (
                                <button
                                    key={sector}
                                    type="button"
                                    onClick={() => handleCheckboxChange('investment_sectors', sector)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${(formData.investment_sectors || []).includes(sector)
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {sector}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Stages</label>
                        <div className="flex flex-wrap gap-2">
                            {STAGES.map(stage => (
                                <button
                                    key={stage}
                                    type="button"
                                    onClick={() => handleCheckboxChange('investment_stages', stage)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${(formData.investment_stages || []).includes(stage)
                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {stage}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Geographies</label>
                        <div className="flex flex-wrap gap-2">
                            {GEOGRAPHIES.map(geo => (
                                <button
                                    key={geo}
                                    type="button"
                                    onClick={() => handleCheckboxChange('investment_geo', geo)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${(formData.investment_geo || []).includes(geo)
                                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {geo}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Min Check Size ($)</label>
                            <input
                                type="number"
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                                value={formData.min_check_size}
                                onChange={(e) => setFormData({ ...formData, min_check_size: e.target.value })}
                                placeholder="10000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Max Check Size ($)</label>
                            <input
                                type="number"
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                                value={formData.max_check_size}
                                onChange={(e) => setFormData({ ...formData, max_check_size: e.target.value })}
                                placeholder="500000"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Investmest Thesis</label>
                        <textarea
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all min-h-[120px] resize-none placeholder:text-slate-400"
                            value={formData.investment_thesis}
                            onChange={(e) => setFormData({ ...formData, investment_thesis: e.target.value })}
                            placeholder="Describe your investment strategy..."
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-xl font-medium shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </form>
    );
}
