'use client';

import { Filter, ChevronDown } from 'lucide-react';

export default function FilterBar() {
    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="flex items-center gap-2 p-1 bg-white/40 backdrop-blur-md border border-white/20 shadow-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 border border-slate-200/50 text-xs font-semibold text-slate-700 hover:bg-white transition-colors cursor-pointer">
                    <Filter size={14} className="text-slate-400" />
                    <span>Filters</span>
                </div>

                <div className="h-4 w-px bg-slate-200/50 mx-1" />

                {['Sector', 'Stage', 'Location', 'Deal Size'].map((filter) => (
                    <button
                        key={filter}
                        className="flex items-center gap-1 px-3 py-1.5 hover:bg-white/50 text-xs font-medium text-slate-600 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
                    >
                        {filter}
                        <ChevronDown size={12} className="opacity-40" />
                    </button>
                ))}
            </div>

            <button className="flex items-center gap-1 px-3 py-1.5 bg-transparent text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors ml-auto">
                Reset
            </button>
        </div>
    );
}
