import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, TrendingUp, TrendingDown, MoreHorizontal, Filter, Search, Activity, FileText } from 'lucide-react';
import { Investment } from '@/lib/types';

interface PortfolioTableProps {
    investments: Investment[];
}

export default function PortfolioTable({ investments }: PortfolioTableProps) {
    const [sortField, setSortField] = useState<keyof Investment | 'current_value'>('current_value');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-emerald-100">Active</span>;
            case 'at_risk': return <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-red-100">At Risk</span>;
            case 'monitoring': return <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-amber-100">Monitoring</span>;
            case 'exited': return <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-blue-100">Exited</span>;
            case 'written_off': return <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-slate-200">Written Off</span>;
            default: return <span className="bg-slate-50 text-slate-600 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-slate-200">{status}</span>;
        }
    };

    const getHealthColor = (score?: number) => {
        if (!score) return 'text-slate-400';
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-amber-500';
        return 'text-red-500';
    };

    return (
        <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
            {/* Header / Filters */}
            <div className="p-4 border-b border-[var(--color-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-bold text-[var(--color-text-primary)]">Portfolio Companies</h3>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            className="pl-9 pr-4 py-1.5 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent-primary)] w-48 transition-colors bg-[var(--input-bg)]"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--input-bg)] font-medium transition-colors">
                        <Filter size={14} /> Filter
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--input-bg)] border-b border-[var(--color-border)]">
                            <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Company</th>
                            <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Invested</th>
                            <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-right">Current Value</th>
                            <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-right">Return</th>
                            <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-center">AI Health</th>
                            <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {investments.map((inv) => (
                            <tr key={inv.id} className="hover:bg-[var(--input-bg)]/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-[var(--color-border)] flex items-center justify-center shadow-sm p-1">
                                            {inv.company?.logo_url ? (
                                                <img src={inv.company.logo_url} alt={inv.company?.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-xs font-bold text-slate-700">{inv.company?.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-[var(--color-text-primary)] text-sm">{inv.company?.name || 'Unknown'}</div>
                                            <div className="text-[10px] text-[var(--color-text-secondary)]">{inv.company?.industry || 'Tech'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm text-[var(--color-text-primary)] font-medium">{formatCurrency(inv.amount_invested)}</div>
                                    <div className="text-[10px] text-[var(--color-text-secondary)]">{new Date(inv.invested_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                                </td>
                                <td className="p-4">
                                    {getStatusBadge(inv.status)}
                                </td>
                                <td className="p-4 text-right">
                                    <span className="text-sm font-bold text-[var(--color-text-primary)] font-mono">{formatCurrency(inv.current_value)}</span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className={`text-sm font-bold font-mono ${inv.moic && inv.moic >= 1 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {inv.moic ? inv.moic.toFixed(2) + 'x' : '-'}
                                        </span>
                                        <span className={`text-[10px] font-medium ${inv.current_value >= inv.amount_invested ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {inv.current_value - inv.amount_invested >= 0 ? '+' : ''}{formatCurrency(inv.current_value - inv.amount_invested)}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-1.5" title={`${inv.ai_health_score}/100`}>
                                        <Activity size={16} className={getHealthColor(inv.ai_health_score)} />
                                        <span className={`text-sm font-bold ${getHealthColor(inv.ai_health_score)}`}>{inv.ai_health_score || '--'}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors" title="Upload Document">
                                            <FileText size={14} />
                                        </button>
                                        <Link
                                            href={`/dashboard/companies/${inv.company?.id}`}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                                        >
                                            View <ArrowUpRight size={12} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {investments.length === 0 && (
                <div className="p-12 text-center text-[var(--color-text-secondary)] text-sm italic">
                    No investments found via AI analysis. Upload documents to get started.
                </div>
            )}
        </div>
    );
}
