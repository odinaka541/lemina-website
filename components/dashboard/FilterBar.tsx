'use client';

import { Filter, ChevronDown, X, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export interface FilterState {
    sector: string[];
    stage: string[];
    location: string[];
    verification: string[];
}

interface FilterBarProps {
    filters: FilterState;
    onFilterChange: (newFilters: FilterState) => void;
}

const SECTORS = ['Fintech', 'Logistics', 'Healthtech', 'Cleantech', 'AgriTech', 'EdTech'];
const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth'];
const LOCATIONS = ['Lagos, Nigeria', 'Nairobi, Kenya', 'Cairo, Egypt', 'Cape Town, South Africa', 'Accra, Ghana'];
const VERIFICATIONS = ['Tier 5 (90+)', 'Tier 4 (80-89)', 'Tier 3 (60-79)', 'Tier 2 (40-59)', 'Tier 1 (<40)'];

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleFilter = (category: keyof FilterState, value: string) => {
        const current = filters[category];
        const newValues = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];

        onFilterChange({ ...filters, [category]: newValues });
    };

    const clearAll = () => {
        onFilterChange({ sector: [], stage: [], location: [], verification: [] });
    };

    const renderDropdown = (label: string, category: keyof FilterState, options: string[]) => {
        const isOpen = openDropdown === category;
        const selectedCount = filters[category].length;

        return (
            <div className="relative">
                <button
                    onClick={() => setOpenDropdown(isOpen ? null : category)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all border rounded-md ${isOpen || selectedCount > 0
                        ? 'bg-slate-50 border-slate-300 text-slate-900'
                        : 'bg-transparent border-transparent hover:bg-white/50 text-slate-600 hover:text-slate-900'
                        }`}
                >
                    {label}
                    {selectedCount > 0 && (
                        <span className="flex items-center justify-center w-4 h-4 text-[9px] bg-slate-900 text-white rounded-full">
                            {selectedCount}
                        </span>
                    )}
                    <ChevronDown size={12} className={`opacity-40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 animate-fade-in">
                        <div className="space-y-1">
                            {options.map(option => {
                                const isSelected = filters[category].includes(option);
                                return (
                                    <button
                                        key={option}
                                        onClick={() => toggleFilter(category, option)}
                                        className={`w-full text-left px-2 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors ${isSelected ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span>{option}</span>
                                        {isSelected && <Check size={12} className="text-emerald-500" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6 relative z-30" ref={containerRef}>
            <div className="w-full flex items-center p-1 bg-white/40 backdrop-blur-md border border-white/20 shadow-sm rounded-lg">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 border border-slate-200/50 text-xs font-bold text-slate-700 rounded-md">
                        <Filter size={14} className="text-slate-400" />
                        <span>Filters</span>
                    </div>

                    <div className="h-4 w-px bg-slate-200/50 mx-1" />

                    {renderDropdown('Sector', 'sector', SECTORS)}
                    {renderDropdown('Stage', 'stage', STAGES)}
                    {renderDropdown('Location', 'location', LOCATIONS)}
                    {renderDropdown('Verification', 'verification', VERIFICATIONS)}
                </div>

                {/* Reset Button - Pushed to far right */}
                {hasActiveFilters && (
                    <button
                        onClick={clearAll}
                        className="ml-auto flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <X size={12} />
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
}
