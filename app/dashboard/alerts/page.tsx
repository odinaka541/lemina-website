'use client';

import { useState, useEffect } from 'react';
import {
    Bell, Plus, Trash2, Edit2, Zap, Search, Filter,
    AlertCircle, CheckCircle2, Loader2, ArrowRight,
    TrendingUp, ShieldAlert, Radio, Activity, Users
} from 'lucide-react';
import Link from 'next/link';
import CreateAlertModal from '@/components/alerts/CreateAlertModal';
import { useToast } from '@/components/providers/ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';

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
                    priority: a.priority || 'medium',
                    last_triggered: a.last_triggered_at ? new Date(a.last_triggered_at).toLocaleDateString() : 'Never'
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
        const originalAlerts = alerts;
        setAlerts(alerts.filter(a => a.id !== id));

        try {
            const res = await fetch(`/api/alerts/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete alert');
            showToast('Alert deleted', 'success');
        } catch (error) {
            console.error('Error deleting alert:', error);
            showToast('Failed to delete alert', 'error');
            setAlerts(originalAlerts);
        }
    };

    const toggleAlert = async (id: string) => {
        const alert = alerts.find(a => a.id === id);
        if (!alert) return;

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
            setAlerts(originalAlerts);
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

            await fetchAlerts();
            showToast('Alert created successfully', 'success');
            setIsCreateModalOpen(false);
        } catch (error: any) {
            console.error('Error creating alert:', error);
            showToast(error.message || 'Failed to create alert', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Glass Canopy Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm shadow-slate-200/50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
                                Intelligence & Alerts
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Search Box - "Two separate boxes" style */}
                            <div className="hidden md:flex items-center">
                                <div className="h-10 w-10 bg-white border border-slate-200 border-r-0 rounded-l-xl flex items-center justify-center text-slate-400">
                                    <Search size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search signals..."
                                    className="h-10 bg-white border border-slate-200 border-l-0 rounded-r-xl pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/20 w-64 transition-all"
                                />
                            </div>

                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/20 hover:bg-slate-800 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <Plus size={16} strokeWidth={3} />
                                New Alert
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Tactile Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Monitors</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2 font-mono">{alerts.filter(a => a.is_active).length}</h3>
                            </div>
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
                                <Radio className="animate-pulse" size={20} />
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full w-3/4" />
                        </div>
                        <p className="text-xs font-bold text-emerald-600 mt-3 flex items-center gap-1">
                            <CheckCircle2 size={12} /> System operational
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Triggered Today</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2 font-mono">12</h3>
                            </div>
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors">
                                <Bell size={20} />
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full w-1/4" />
                        </div>
                        <p className="text-xs font-bold text-indigo-600 mt-3 flex items-center gap-1">
                            <Activity size={12} /> +2 from yesterday
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Signals</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2 font-mono">3</h3>
                            </div>
                            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-100 transition-colors">
                                <ShieldAlert size={20} />
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-rose-500 h-full rounded-full w-1/2" />
                        </div>
                        <p className="text-xs font-bold text-rose-600 mt-3 flex items-center gap-1">
                            <AlertCircle size={12} /> Action required
                        </p>
                    </div>
                </div>

                {/* Swiss Style Alert Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Your Signal Feed</h2>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                                    <Filter size={18} />
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-slate-300" /></div>
                        ) : alerts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-300">
                                    <Bell size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">No alerts configured</h3>
                                <p className="text-slate-500 text-sm mb-6">Set up your first monitor to track market movements.</p>
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-wider"
                                >
                                    Create Signal
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200 ring-1 ring-slate-100 shadow-sm overflow-hidden">
                                {alerts.map((alert, idx) => (
                                    <div
                                        key={alert.id}
                                        className={`p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group flex items-start gap-4 ${!alert.is_active ? 'opacity-60 grayscale' : ''}`}
                                    >
                                        <div className={`mt-1 p-3 rounded-xl flex-shrink-0 ${alert.type === 'deal_flow' ? 'bg-blue-50 text-blue-600' :
                                            alert.type === 'portfolio' ? 'bg-purple-50 text-purple-600' :
                                                'bg-amber-50 text-amber-600'
                                            }`}>
                                            <Zap size={20} className={alert.is_active ? 'fill-current' : ''} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-bold text-slate-900 text-base truncate pr-4">{alert.name}</h3>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(alert.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${alert.priority === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    'bg-slate-50 text-slate-500 border-slate-100'
                                                    }`}>
                                                    {alert.priority || 'Normal'} Priority
                                                </span>
                                                <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                    {alert.condition}
                                                </span>
                                                <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                                                    <Activity size={12} /> Last: {alert.last_triggered}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center self-center pl-4 border-l border-slate-100">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={alert.is_active} onChange={() => toggleAlert(alert.id)} />
                                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recommended Side Panel */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                            <TrendingUp size={20} className="text-indigo-500" />
                            Recommended
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { title: 'New Unicorns', desc: 'Alert me when a company in my sectors reaches $1B+ valuation.', icon: <TrendingUp size={48} className="text-slate-900" /> },
                                { title: 'Competitor Watch', desc: 'Track activity of specific competitor funds in Nigeria.', icon: <Activity size={48} className="text-slate-900" /> },
                                { title: 'Talent Moves', desc: 'Get notified when C-level talent leaves major fintechs.', icon: <Users size={48} className="text-slate-900" /> },
                            ].map((rec, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group cursor-pointer relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform">{rec.icon}</div>
                                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{rec.title}</h3>
                                    <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed pr-8">{rec.desc}</p>
                                    <button className="text-xs font-bold text-slate-400 flex items-center gap-1 group-hover:text-indigo-600 uppercase tracking-wider transition-colors">
                                        Activate Signal <ArrowRight size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-2">AI Pulse</h3>
                                <p className="text-indigo-200 text-xs mb-4 leading-relaxed">Let AI analyze your portfolio daily and suggest critical alerts based on market shifts.</p>
                                <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
                                    Enable Copilot
                                </button>
                            </div>
                        </div>
                    </div>
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
