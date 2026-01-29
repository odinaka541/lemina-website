'use client';

import React, { useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { AIAnalysisResult } from '@/lib/ai/openai-service';

interface AIAnalysisCardProps {
    companyId: string;
}

export default function AIAnalysisCard({ companyId }: AIAnalysisCardProps) {
    const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyId }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Analysis failed');
            }

            const json = await res.json();
            setAnalysis(json.data);
            setExpanded(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!analysis && !loading && !error) {
        return (
            <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-4 shadow-sm h-full flex flex-col items-center justify-center text-center">
                <div className="bg-indigo-100 p-3 rounded-full mb-3 text-indigo-600">
                    <Sparkles size={24} />
                </div>
                <h3 className="text-indigo-900 font-semibold mb-1">AI Investment Memo</h3>
                <p className="text-xs text-indigo-600/80 mb-4 max-w-[200px]">
                    Generate an instant deep-dive analysis on this company.
                </p>
                <button
                    onClick={handleAnalyze}
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Sparkles size={14} />
                    Generate Analysis
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full flex flex-col items-center justify-center">
                <div className="animate-spin text-indigo-600 mb-3">
                    <RefreshCw size={24} />
                </div>
                <p className="text-xs font-medium text-slate-500 animate-pulse">Analyzing market data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 h-full flex flex-col items-center justify-center text-center">
                <AlertCircle className="text-red-500 mb-2" size={24} />
                <p className="text-xs text-red-700 mb-3">{error}</p>
                <button
                    onClick={handleAnalyze}
                    className="text-xs text-red-600 font-medium hover:underline flex items-center gap-1"
                >
                    <RefreshCw size={12} /> Retry
                </button>
            </div>
        );
    }

    // Success State
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col w-full h-full">
            {/* Header / Verdict */}
            <div className="bg-slate-50 border-b border-slate-100 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg">
                        <Sparkles size={14} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">AI Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${analysis?.investment_recommendation.verdict === 'Buy' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        analysis?.investment_recommendation.verdict === 'Watch' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            'bg-rose-100 text-rose-700 border-rose-200'
                        }`}>
                        {analysis?.investment_recommendation.verdict}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                        {analysis?.investment_recommendation.confidence}% Conf.
                    </span>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 overflow-y-auto flex-1 h-px scrollbar-thin scrollbar-thumb-slate-200">
                <p className="text-xs text-slate-600 italic mb-4 leading-relaxed border-l-2 border-indigo-200 pl-3">
                    "{analysis?.executive_summary}"
                </p>

                {/* Key Strengths */}
                <div className="mb-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-500" /> Strengths
                    </h4>
                    <ul className="space-y-2">
                        {analysis?.key_strengths.slice(0, 2).map((s, i) => (
                            <li key={i} className="text-xs text-slate-700 flex gap-2 items-start">
                                <span className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                <span>{s.point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Red Flags */}
                {analysis?.red_flags && analysis.red_flags.length > 0 && (
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <AlertTriangle size={12} className="text-amber-500" /> Risks
                        </h4>
                        <ul className="space-y-2">
                            {analysis?.red_flags.slice(0, 2).map((f, i) => (
                                <li key={i} className="text-xs text-slate-700 flex gap-2 items-start">
                                    <span className="w-1 h-1 rounded-full bg-amber-300 mt-1.5 shrink-0" />
                                    <span>{f.flag}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
