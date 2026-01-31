'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertCircle, AlertTriangle, CheckCircle, X, ArrowRight, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Alert {
    id: string;
    type: 'closing_soon' | 'filled' | 'low_participation' | 'risk' | 'pending_approval';
    title: string;
    subtitle: string;
    severity: 'high' | 'medium' | 'critical' | 'low';
    action: string;
    link: string;
}

export default function UrgentAttentionPanel() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Fetch alerts
        fetch('/api/network/urgent-alerts')
            .then(res => res.json())
            .then(data => setAlerts(data.data || []))
            .catch(err => console.error('Failed to load alerts', err));
    }, []);

    const dismissAlert = (id: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link click if wrapped
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    if (alerts.length === 0) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'closing_soon': return <Clock size={20} />;
            case 'filled': return <CheckCircle size={20} />;
            case 'risk': return <AlertTriangle size={20} />;
            case 'pending_approval': return <UserCheck size={20} />;
            default: return <AlertCircle size={20} />;
        }
    };

    const getColors = (type: string, severity: string) => {
        if (type === 'risk' || severity === 'critical') return 'bg-red-50 border-red-100 text-red-700';
        if (type === 'closing_soon' || severity === 'high') return 'bg-amber-50 border-amber-100 text-amber-700';
        if (type === 'filled') return 'bg-emerald-50 border-emerald-100 text-emerald-700';
        if (type === 'pending_approval') return 'bg-purple-50 border-purple-100 text-purple-700';
        return 'bg-blue-50 border-blue-100 text-blue-700';
    };

    return (
        <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-500" />
                Urgent Attention
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                    {alerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`relative p-4 rounded-xl border shadow-sm flex items-start gap-4 ${getColors(alert.type, alert.severity)}`}
                        >
                            <div className="mt-1 p-1.5 bg-white/50 rounded-lg">
                                {getIcon(alert.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm leading-tight mb-1">{alert.title}</h4>
                                <p className="text-xs opacity-90 font-medium mb-3">{alert.subtitle}</p>

                                <Link
                                    href={alert.link}
                                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide hover:opacity-80 transition-opacity bg-white/50 px-2 py-1 rounded"
                                >
                                    {alert.action} <ArrowRight size={12} />
                                </Link>
                            </div>

                            <button
                                onClick={(e) => dismissAlert(alert.id, e)}
                                className="absolute top-2 right-2 p-1 hover:bg-black/5 rounded-full transition-colors opacity-70 hover:opacity-100"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
}
