'use client';

import { useState } from 'react';
import { X, ChevronRight, Check, AlertCircle, Zap, Briefcase, Users, Search, Target, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateAlertModalProps {
    onClose: () => void;
    onSave: (alert: any) => Promise<void>;
    initialData?: { type?: string, name?: string };
}

export default function CreateAlertModal({ onClose, onSave, initialData }: CreateAlertModalProps) {
    const [step, setStep] = useState(initialData?.name ? 2 : 1); // Skip to step 2 if name provided
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        type: initialData?.type || 'deal_flow',
        conditions: {
            sector: [],
            stage: [],
            geo: [],
        },
        name: initialData?.name || '',
        channels: ['email'],
        frequency: 'instant'
    });

    const alertTypes = [
        { id: 'deal_flow', name: 'Deal Flow', icon: Zap, desc: 'New deals matching your criteria' },
        { id: 'portfolio', name: 'Portfolio', icon: Briefcase, desc: 'Updates from your portfolio companies' },
        { id: 'network', name: 'Network Activity', icon: Users, desc: 'See what your network is investing in' },
        { id: 'company', name: 'Company Monitoring', icon: Search, desc: 'Track specific companies' },
    ];

    const renderStep1 = () => (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">What do you want to track?</h3>
                <p className="text-sm text-slate-500 mt-1">Select a category for your intelligence signal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alertTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setFormData({ ...formData, type: type.id })}
                        className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${formData.type === type.id
                            ? 'bg-slate-900 border-slate-900 shadow-lg shadow-indigo-500/20'
                            : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md hover:bg-slate-50'
                            }`}
                    >
                        <div className={`p-3 rounded-xl w-fit mb-4 transition-colors ${formData.type === type.id ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                            <type.icon size={22} strokeWidth={formData.type === type.id ? 2.5 : 2} />
                        </div>
                        <div className={`font-bold text-lg mb-1 ${formData.type === type.id ? 'text-white' : 'text-slate-900'}`}>{type.name}</div>
                        <div className={`text-xs ${formData.type === type.id ? 'text-slate-300' : 'text-slate-500'}`}>{type.desc}</div>
                        {formData.type === type.id && (
                            <div className="absolute top-4 right-4 text-emerald-400">
                                <Check size={20} strokeWidth={3} />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Refine Your Signal</h3>
                <p className="text-sm text-slate-500 mt-1">Set the specific conditions that trigger this alert.</p>
            </div>

            {/* Conditional fields based on Type */}
            {formData.type === 'deal_flow' && (
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Target Sectors</label>
                        <div className="relative group">
                            <Target size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer">
                                <option>Any Sector</option>
                                <option>Fintech</option>
                                <option>Healthtech</option>
                                <option>Supply Chain</option>
                                <option>Clean Tech</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Investment Stage</label>
                        <div className="flex flex-wrap gap-3">
                            {['Pre-Seed', 'Seed', 'Series A', 'Series B+'].map(s => (
                                <button key={s} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {formData.type === 'company' && (
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Company Name</label>
                    <div className="relative group">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                            placeholder="e.g. Paystack, Stripe..."
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>
            )}

            {(formData.type === 'portfolio' || formData.type === 'network') && (
                <div className="p-5 bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-2xl text-sm flex gap-4 items-start">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold mb-1">Automatic Monitoring</h4>
                        <p className="opacity-90 leading-relaxed">We'll automatically notify you about any major updates, funding rounds, news mentions, or leadership changes related to your connected {formData.type === 'portfolio' ? 'portfolio companies' : 'network'}.</p>
                    </div>
                </div>
            )}
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Delivery Preferences</h3>
                <p className="text-sm text-slate-500 mt-1">How and when would you like to be notified?</p>
            </div>

            <div className="space-y-4">
                <label className={`flex items-center gap-4 p-5 border rounded-2xl cursor-pointer transition-all ${formData.channels.includes('email') ? 'bg-indigo-50/50 border-indigo-500 ring-1 ring-indigo-500/20' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${formData.channels.includes('email') ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                        {formData.channels.includes('email') && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                    <input type="checkbox" className="hidden" checked={formData.channels.includes('email')} onChange={() => { }} />
                    <div>
                        <span className="font-bold text-slate-900 block">Email Digest</span>
                        <span className="text-xs text-slate-500">Receive a consolidated summary directly to your inbox.</span>
                    </div>
                </label>

                <label className={`flex items-center gap-4 p-5 border rounded-2xl cursor-pointer transition-all ${formData.channels.includes('in_app') ? 'bg-indigo-50/50 border-indigo-500 ring-1 ring-indigo-500/20' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${formData.channels.includes('in_app') ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                        {formData.channels.includes('in_app') && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                    <input type="checkbox" className="hidden" checked={formData.channels.includes('in_app')} onChange={() => { }} />
                    <div>
                        <span className="font-bold text-slate-900 block">In-App Notifications</span>
                        <span className="text-xs text-slate-500">Real-time alerts in your dashboard notification center.</span>
                    </div>
                </label>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Notification Frequency</label>
                <div className="grid grid-cols-3 gap-4">
                    {['instant', 'daily', 'weekly'].map(freq => (
                        <button
                            key={freq}
                            onClick={() => setFormData({ ...formData, frequency: freq })}
                            className={`py-3 rounded-xl text-sm font-bold border capitalize transition-all ${formData.frequency === freq
                                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            {freq}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            >
                <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl shadow-black/20 overflow-hidden flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-slate-900 text-lg font-sans tracking-tight">Configure New Signal</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                                <span className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                                <span className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-8 overflow-y-auto flex-1">
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="text-slate-500 font-bold text-sm hover:text-slate-900 transition-colors px-4 py-2 hover:bg-slate-100 rounded-lg"
                            >
                                Back
                            </button>
                        ) : (
                            <div />
                        )}

                        <button
                            onClick={async () => {
                                if (step < 3) {
                                    setStep(step + 1);
                                } else {
                                    setSaving(true);
                                    // Construct a friendly condition string for display
                                    const conditionText = formData.type === 'deal_flow' ? 'Deals matching sectors/stage' :
                                        formData.type === 'company' ? `Tracking ${formData.name || 'Company'}` :
                                            `${formData.type} updates`;

                                    await onSave({
                                        ...formData,
                                        name: formData.name || `${formData.type.replace('_', ' ')} Alert`,
                                        condition: conditionText
                                    });
                                    setSaving(false);
                                    onClose();
                                }
                            }}
                            disabled={saving}
                            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:bg-slate-800 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center gap-2"
                        >
                            {step === 3 ? (saving ? 'Creating Signal...' : 'Confirm & Activate') : 'Continue'}
                            {!saving && <ChevronRight size={16} strokeWidth={3} />}
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
