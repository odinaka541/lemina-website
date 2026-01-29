'use client';

import { useState } from 'react';
import { X, ChevronRight, Check, AlertCircle, Zap, Briefcase, Users, Search } from 'lucide-react';

interface CreateAlertModalProps {
    onClose: () => void;
    onSave: (alert: any) => Promise<void>;
}

export default function CreateAlertModal({ onClose, onSave }: CreateAlertModalProps) {
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        type: 'deal_flow',
        conditions: {
            sector: [],
            stage: [],
            geo: [],
        },
        name: '',
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
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">What do you want to track?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alertTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setFormData({ ...formData, type: type.id })}
                        className={`p-4 rounded-xl border text-left transition-all ${formData.type === type.id
                            ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                            : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                            }`}
                    >
                        <div className={`p-2 rounded-lg w-fit mb-3 ${formData.type === type.id ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            <type.icon size={20} />
                        </div>
                        <div className={`font-bold ${formData.type === type.id ? 'text-emerald-900' : 'text-slate-900'}`}>{type.name}</div>
                        <div className="text-sm text-slate-500 mt-1">{type.desc}</div>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Set Constraints</h3>

            {/* Conditional fields based on Type */}
            {formData.type === 'deal_flow' && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Sectors</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                            <option>Any Sector</option>
                            <option>Fintech</option>
                            <option>Healthtech</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Stage</label>
                        <div className="flex flex-wrap gap-2">
                            {['Pre-Seed', 'Seed', 'Series A'].map(s => (
                                <button key={s} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 hover:border-emerald-500 hover:text-emerald-600">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {formData.type === 'company' && (
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Name</label>
                    <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="e.g. Paystack" />
                </div>
            )}

            {(formData.type === 'portfolio' || formData.type === 'network') && (
                <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm flex gap-3 items-start">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p>We'll notify you about any major updates, funding rounds, or news related to your connected {formData.type === 'portfolio' ? 'portfolio companies' : 'network'}.</p>
                </div>
            )}
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Delivery Preferences</h3>

            <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" checked={formData.channels.includes('email')} onChange={() => { }} />
                    <span className="font-medium text-slate-900">Email Notifications</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" checked={formData.channels.includes('in_app')} onChange={() => { }} />
                    <span className="font-medium text-slate-900">In-App Notifications</span>
                </label>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Frequency</label>
                <div className="grid grid-cols-3 gap-3">
                    {['instant', 'daily', 'weekly'].map(freq => (
                        <button
                            key={freq}
                            onClick={() => setFormData({ ...formData, frequency: freq })}
                            className={`py-2 rounded-lg text-sm font-medium border capitalize ${formData.frequency === freq
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900 text-lg">Create New Alert</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-slate-100">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                {/* Body */}
                <div className="p-6 min-h-[300px]">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="text-slate-500 font-medium hover:text-slate-900 transition-colors"
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
                        className="px-6 py-2 bg-slate-900 text-white rounded-xl font-medium shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        {step === 3 ? (saving ? 'Creating...' : 'Create Alert') : 'Continue'}
                        {step < 3 && <ChevronRight size={16} />}
                        {step === 3 && !saving && <Check size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
