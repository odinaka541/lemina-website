'use client';

import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Edit2, Zap, Search, Filter, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import CreateAlertModal from '@/components/alerts/CreateAlertModal';
import { useToast } from '@/components/providers/ToastProvider';

export default function AlertsPage() {
    const { showToast } = useToast();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const res = await fetch('/api/alerts');
            const json = await res.json();
            if (json.data) {
                setAlerts(json.data.map((a: any) => ({
                    id: a.id,
                    type: a.type,
                    name: a.name,
                    condition: a.condition_text || 'Active',
                    channels: a.channels || [],
                    is_active: a.is_active,
                    last_triggered: a.last_triggered_at ? new Date(a.last_triggered_at).toLocaleString() : 'Never'
                })));
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
            showToast('Failed to load alerts', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        // Optimistic update
        const originalAlerts = alerts;
        setAlerts(alerts.filter(a => a.id !== id));

        try {
            const res = await fetch(`/api/alerts/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete alert');
            showToast('Alert deleted', 'success');
        } catch (error) {
            console.error('Error deleting alert:', error);
            showToast('Failed to delete alert', 'error');
            setAlerts(originalAlerts); // Revert
        }
    };

    const toggleAlert = async (id: string) => {
        const alert = alerts.find(a => a.id === id);
        if (!alert) return;

        // Optimistic update
        const newState = !alert.is_active;
        const originalAlerts = alerts;
        setAlerts(alerts.map(a => a.id === id ? { ...a, is_active: newState } : a));

        try {
            const res = await fetch(`/api/alerts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: newState })
            });
            if (!res.ok) throw new Error('Failed to toggle alert status');
            showToast(`Alert ${newState ? 'activated' : 'deactivated'}`, 'success');
        } catch (error) {
            console.error('Error toggling alert:', error);
            showToast('Failed to toggle alert status', 'error');
            setAlerts(originalAlerts); // Revert
        }
    };

    const handleCreateAlert = async (newAlert: any) => {
        try {
            const res = await fetch('/api/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAlert)
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Failed to create alert');
            }

            await fetchAlerts(); // Refresh list
            showToast('Alert created successfully', 'success');
            setIsCreateModalOpen(false);
        } catch (error: any) {
            console.error('Error creating alert:', error);
            showToast(error.message || 'Failed to create alert', 'error');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Custom Alerts</h1>
                        <p className="text-slate-500">Monitor the market and track specific opportunities in real-time.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all"
                    >
                        <Plus size={20} /> Create New Alert
                    </button>
                </div>
                <div className="p-12 flex justify-center text-slate-400">
                    <Loader2 className="animate-spin h-8 w-8" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Custom Alerts</h1>
                    <p className="text-slate-500">Monitor the market and track specific opportunities in real-time.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all"
                >
                    <Plus size={20} /> Create New Alert
                </button>
            </div>

            {/* Active Alerts List */}
            <div className="space-y-6">

                {/* Search & Filter - Simplified for now */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search alerts..."
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400 shadow-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {alerts.map((alert) => (
                        <div key={alert.id} className={`bg-white border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${alert.is_active ? 'border-slate-200 shadow-sm' : 'border-slate-100 bg-slate-50/50 opacity-75'}`}>
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl flex items-center justify-center ${alert.type === 'deal_flow' ? 'bg-blue-50 text-blue-600' :
                                    alert.type === 'portfolio' ? 'bg-purple-50 text-purple-600' :
                                        'bg-amber-50 text-amber-600'
                                    }`}>
                                    <Zap size={20} className={alert.is_active ? 'fill-current' : ''} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-slate-900 text-lg">{alert.name}</h3>
                                        {!alert.is_active && <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wide">Paused</span>}
                                    </div>
                                    <p className="text-slate-600 text-sm mt-1 mb-2 font-mono bg-slate-50 inline-block px-2 py-0.5 rounded border border-slate-100">
                                        {alert.condition}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                        <span className="flex items-center gap-1">
                                            <Bell size={12} /> {alert.channels.join(', ')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 size={12} /> Last triggered: {alert.last_triggered}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 md:border-l md:border-slate-100 md:pl-6">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={alert.is_active} onChange={() => toggleAlert(alert.id)} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(alert.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {alerts.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm text-slate-300">
                            <Bell size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No alerts set up</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-6">Create your first alert to stay on top of new deals and market movements.</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                        >
                            Create Alert
                        </button>
                    </div>
                )}
            </div>

            {/* Recommended Section */}
            <div className="mt-12">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap size={20} className="text-amber-500 fill-amber-500" /> Recommended for you
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: 'New Unicorns', desc: 'Alert me when a company in my sectors reaches $1B+ valuation.' },
                        { title: 'Competitor Watch', desc: 'Track activity of specific competitor funds in Nigeria.' },
                        { title: 'Talent Moves', desc: 'Get notified when C-level talent leaves major fintechs.' },
                    ].map((rec, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 transition-all group cursor-pointer">
                            <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{rec.title}</h3>
                            <p className="text-sm text-slate-500 mb-4">{rec.desc}</p>
                            <button className="text-sm font-bold text-emerald-600 flex items-center gap-1 group-hover:underline">
                                Activate <Plus size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {isCreateModalOpen && (
                <CreateAlertModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSave={handleCreateAlert}
                />
            )}
        </div>
    );
}
