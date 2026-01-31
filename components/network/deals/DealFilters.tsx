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
        <div className="flex flex-col md:flex-row gap-3 items-center">
            {/* Search */}
            <div className="relative w-full md:w-[320px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search companies or deals..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-shadow"
                />
                {searchValue && (
                    <button
                        onClick={() => setSearchValue('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Filter size={16} className="text-slate-400" />
                </div>
                <select
                    value={filters.status}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                    className="appearance-none pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer min-w-[140px]"
                >
                    <option value="all">All Deals</option>
                    <option value="open">Open</option>
                    <option value="filled">Filled</option>
                    <option value="closed">Closed</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-slate-100">
                    <div className="border-t-4 border-t-slate-400 border-l-4 border-l-transparent border-r-4 border-r-transparent"></div>
                </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ArrowUpDown size={16} className="text-slate-400" />
                </div>
                <select
                    value={filters.sort}
                    onChange={(e) => onFilterChange('sort', e.target.value)}
                    className="appearance-none pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer min-w-[160px]"
                >
                    <option value="urgency">Urgency</option>
                    <option value="progress">Progress</option>
                    <option value="amount">Allocation Size</option>
                    <option value="recent">Recently Added</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-slate-100">
                    <div className="border-t-4 border-t-slate-400 border-l-4 border-l-transparent border-r-4 border-r-transparent"></div>
                </div>
            </div>
        </div>
    );
}
