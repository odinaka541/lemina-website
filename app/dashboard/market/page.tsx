'use client';

import React from 'react';
import Link from 'next/link';
import { Construction, ArrowLeft, Globe } from 'lucide-react';

export default function MarketIntelPage() {
    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">

            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 border border-amber-100 shadow-sm animate-pulse">
                <Construction size={40} className="text-amber-500" />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                MARKET INTELLIGENCE
            </h1>

            <span className="inline-block px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full mb-8">
                LAUNCHING Q2 2026
            </span>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-lg w-full shadow-sm mb-8 text-left">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Globe size={18} className="text-indigo-500" />
                    Ecosystem Insights
                </h3>
                <ul className="space-y-3 mb-6">
                    {['Deal flow trends across 15+ countries', 'Sector performance benchmarks', 'Regional capital deployment', 'Valuation multiples by stage'].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5" />
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-2">Data Requirement: <span className="font-semibold text-slate-700">500+ Companies</span></p>
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                        <div className="bg-amber-500 h-2 rounded-full w-[16%]" />
                    </div>
                    <p className="text-xs font-medium text-slate-600 text-right">We're at 81 companies—getting there!</p>
                </div>
            </div>

            <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>
        </div>
    );
}
