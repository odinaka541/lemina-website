'use client';

import React from 'react';
import { Plus, ArrowDownToLine, Upload, Briefcase } from 'lucide-react';

interface EmptyPortfolioStateProps {
    onAddInvestment: () => void;
    onImportPipeline: () => void; // Optional for now
}

export default function EmptyPortfolioState({ onAddInvestment, onImportPipeline }: EmptyPortfolioStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-10 max-w-2xl w-full text-center shadow-sm">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase size={32} className="text-indigo-600" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">Start Tracking Your Portfolio</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    You haven't added any investments yet. Centralize your angel portfolio to track performance and documents.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-10">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm mb-3">
                            <ArrowDownToLine size={16} className="text-emerald-500" />
                        </div>
                        <h3 className="font-semibold text-slate-900 text-sm mb-1">From Pipeline</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">Move completed deals directly from your "Committed" stage.</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm mb-3">
                            <Plus size={16} className="text-blue-500" />
                        </div>
                        <h3 className="font-semibold text-slate-900 text-sm mb-1">Manual Add</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">Track past investments made before using Lemina.</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm mb-3">
                            <Upload size={16} className="text-amber-500" />
                        </div>
                        <h3 className="font-semibold text-slate-900 text-sm mb-1">Upload Docs</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">Store pitch decks, SAFEs, and quarterly reports.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={onAddInvestment}
                        className="btn bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        <Plus size={18} /> Add Your First Investment
                    </button>
                    <button
                        onClick={onImportPipeline}
                        className="btn bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
                    >
                        <ArrowDownToLine size={18} /> Import from Pipeline
                    </button>
                </div>
            </div>
        </div>
    );
}
