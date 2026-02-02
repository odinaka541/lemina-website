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
        <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
            {/* Header / Filters */}
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-500" />
                    Portfolio Companies
                </h3>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 shadow-sm">
                            <Search size={14} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search companies..."
                            className="h-8 w-48 text-xs bg-white border border-slate-200 rounded-lg px-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all">
                        <Filter size={12} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all">
                        <MoreHorizontal size={12} />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-200">
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-6">Company</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Invested</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Current Value</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Return (MOIC)</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">AI Health</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right pr-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {investments.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm p-1.5 relative overflow-hidden group-hover:border-indigo-200 transition-colors">
                                            {inv.company?.logo_url ? (
                                                <img src={inv.company.logo_url} alt={inv.company?.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-xs font-black text-slate-800">{inv.company?.name.slice(0, 2).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{inv.company?.name || 'Unknown'}</div>
                                            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{inv.company?.industry || 'Tech'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-bold text-slate-700 font-mono">{formatCurrency(inv.amount_invested)}</div>
                                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{new Date(inv.invested_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                                </td>
                                <td className="p-4">
                                    {getStatusBadge(inv.status)}
                                </td>
                                <td className="p-4 text-right">
                                    <span className="text-sm font-bold text-slate-900 font-mono tracking-tight">{formatCurrency(inv.current_value)}</span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className={`text-sm font-bold font-mono ${inv.moic && inv.moic >= 1 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {inv.moic ? inv.moic.toFixed(2) + 'x' : '-'}
                                        </span>
                                        <div className={`flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wide ${inv.current_value >= inv.amount_invested ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {inv.current_value >= inv.amount_invested ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                            {inv.current_value - inv.amount_invested >= 0 ? '+' : ''}{formatCurrency(inv.current_value - inv.amount_invested)}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-2" title={`${inv.ai_health_score}/100`}>
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${(inv.ai_health_score || 0) >= 80 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                            (inv.ai_health_score || 0) >= 60 ? 'bg-amber-50 border-amber-100 text-amber-700' :
                                                'bg-red-50 border-red-100 text-red-700'}`}>
                                            <Activity size={12} strokeWidth={2.5} />
                                            <span className="text-xs font-bold">{inv.ai_health_score || '--'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shadow-sm border border-transparent hover:border-indigo-100" title="Upload Document">
                                            <FileText size={14} />
                                        </button>
                                        <Link
                                            href={`/dashboard/companies/${inv.company?.id}`}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 rounded-lg text-xs font-bold text-slate-600 transition-all shadow-sm hover:shadow-md"
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
                <div className="p-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <Search size={24} className="text-slate-300" />
                    </div>
                    <h4 className="text-slate-900 font-bold mb-1">No investments found</h4>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">
                        Your search didn't return any portfolio companies. Try clearing filters or adding a new investment.
                    </p>
                </div>
            )}
        </div>
    );
}
