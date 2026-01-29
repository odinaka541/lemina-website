'use client';

import { useState } from 'react';
import { Save, Loader2, Bell, Mail, Clock, Calendar, Check, CircleOff } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import Link from 'next/link';

export default function NotificationsTab({ initialData, onSave }: { initialData: any, onSave: (data: any) => Promise<void> }) {
    const [formData, setFormData] = useState(initialData);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(formData);
            showToast('Notification preferences saved', 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to save preferences', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Notification Preferences</h2>
                <Link href="/dashboard/alerts" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1">
                    Manage Custom Alerts <Bell size={14} />
                </Link>
            </div>

            <div className="space-y-8">
                {/* Email Frequency */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                        <Mail size={18} className="text-slate-500" /> Type & Frequency
                    </h3>

                    <div className="space-y-4">
                        {['instant', 'daily', 'weekly'].map((type) => (
                            <label key={type} className={`flex items-start gap-4 p-3 rounded-lg transition-colors cursor-pointer border ${formData.email_frequency === type ? 'bg-white border-emerald-200 shadow-sm' : 'border-transparent hover:bg-slate-200/50'}`}>
                                <input
                                    type="radio"
                                    name="email_frequency"
                                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                                    checked={formData.email_frequency === type}
                                    onChange={() => setFormData({ ...formData, email_frequency: type })}
                                />
                                <div>
                                    <div className="font-bold text-slate-900 capitalize">{type === 'instant' ? 'Instant Notifications' : type === 'daily' ? 'Daily Digest' : 'Weekly Summary'}</div>
                                    <div className="text-sm text-slate-500">
                                        {type === 'instant' ? 'Receive emails immediately when important events happen.' :
                                            type === 'daily' ? 'One summary email every morning with all updates from the last 24 hours.' :
                                                'A comprehensive digest sent once a week.'}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Digest Settings - Only show if not instant */}
                {formData.email_frequency !== 'instant' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                    <Clock size={14} /> Digest Delivery Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    value={formData.digest_time || '09:00'}
                                    onChange={(e) => setFormData({ ...formData, digest_time: e.target.value })}
                                />
                            </div>

                            {formData.email_frequency === 'weekly' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                        <Calendar size={14} /> Delivery Day
                                    </label>
                                    <select
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                        value={formData.digest_day || 'Monday'}
                                        onChange={(e) => setFormData({ ...formData, digest_day: e.target.value })}
                                    >
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Do Not Disturb */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                        <CircleOff size={18} className="text-slate-500" /> Do Not Disturb
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Start Time</label>
                            <input
                                type="time"
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                                value={formData.dnd_start_time || ''}
                                onChange={(e) => setFormData({ ...formData, dnd_start_time: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">End Time</label>
                            <input
                                type="time"
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                                value={formData.dnd_end_time || ''}
                                onChange={(e) => setFormData({ ...formData, dnd_end_time: e.target.value })}
                            />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">Notifications will be paused during these hours and delivered afterwards.</p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-xl font-medium shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </div>
        </form>
    );
}
