'use client';

import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DealFiltersProps {
    filters: any;
    onFilterChange: (key: string, value: string) => void;
}

export default function DealFilters({ filters, onFilterChange }: DealFiltersProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== filters.search) {
                onFilterChange('search', searchValue);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchValue, filters.search, onFilterChange]);

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
            {/* Search - Two Box System */}
            <div className="flex gap-2 w-full md:w-[360px]">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                    <Search size={20} />
                </div>
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm placeholder:text-slate-300"
                    />
                    {searchValue && (
                        <button
                            onClick={() => setSearchValue('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 p-1"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Filters Group */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                {/* Status Filter */}
                <div className="relative group shrink-0">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <Filter size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="h-12 appearance-none pl-11 pr-8 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer min-w-[130px] shadow-sm hover:border-slate-300 transition-colors uppercase tracking-wide"
                    >
                        <option value="all">Status: All</option>
                        <option value="open">Status: Open</option>
                        <option value="filled">Status: Filled</option>
                        <option value="closed">Status: Closed</option>
                    </select>
                </div>

                {/* Sort Filter */}
                <div className="relative group shrink-0">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <ArrowUpDown size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <select
                        value={filters.sort}
                        onChange={(e) => onFilterChange('sort', e.target.value)}
                        className="h-12 appearance-none pl-11 pr-8 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer min-w-[150px] shadow-sm hover:border-slate-300 transition-colors uppercase tracking-wide"
                    >
                        <option value="urgency">Sort: Urgency</option>
                        <option value="progress">Sort: Progress</option>
                        <option value="amount">Sort: Size</option>
                        <option value="recent">Sort: Newest</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
