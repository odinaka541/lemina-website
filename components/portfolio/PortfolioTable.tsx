'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, TrendingUp, TrendingDown, MoreHorizontal, Filter, Search } from 'lucide-react';
import { Company } from '@/types'; // Assuming types exist or using any for now

interface PortfolioInvestment {
    id: string;
    company: {
        id: string;
        name: string;
        logo_url: string | null;
        sector: string;
    };
    amount_invested: number;
    investment_date: string;
    ownership_percent: number;
    current_value: number;
    return_multiple: number;
    status: 'active' | 'exited' | 'written_off';
}

interface PortfolioTableProps {
    investments: PortfolioInvestment[];
}

export default function PortfolioTable({ investments }: PortfolioTableProps) {
    const [sortField, setSortField] = useState<keyof PortfolioInvestment | 'current_value'>('current_value');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-emerald-100">Active</span>;
            case 'exited': return <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-blue-100">Exited</span>;
            case 'written_off': return <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-slate-200">Written Off</span>;
            default: return null;
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Header / Filters */}
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-bold text-slate-800">Portfolio Companies</h3>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 w-48 transition-colors"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 font-medium transition-colors">
                        <Filter size={14} /> Filter
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sector</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invested</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Own.</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Current Value</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {investments.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                            {inv.company.logo_url ? (
                                                <img src={inv.company.logo_url} alt={inv.company.name} className="w-5 h-5 object-contain" />
                                            ) : (
                                                <span className="text-xs font-bold text-slate-700">{inv.company.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <span className="font-semibold text-slate-800 text-sm">{inv.company.name}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium border border-slate-200">
                                        {inv.company.sector}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-600 font-mono">
                                    {formatCurrency(inv.amount_invested)}
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                    {new Date(inv.investment_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </td>
                                <td className="p-4 text-sm text-slate-600">
                                    {inv.ownership_percent}%
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-slate-900 font-mono">{formatCurrency(inv.current_value)}</span>
                                        <span className={`text-[10px] font-medium flex items-center gap-0.5 ${inv.return_multiple >= 1 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {inv.return_multiple.toFixed(1)}x
                                            {inv.return_multiple >= 1 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    {getStatusBadge(inv.status)}
                                </td>
                                <td className="p-4 text-right">
                                    <Link
                                        href={`/dashboard/companies/${inv.company.id}`}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                                    >
                                        View <ArrowUpRight size={12} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {investments.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">
                    No investments found matching filters.
                </div>
            )}
        </div>
    );
}
