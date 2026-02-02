'use client';

// TODO: This page should be hidden behind log in. Do not enforce this rule yet until we set up the magic link log in again, but note.

import { useState, useEffect, Suspense, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Search, Filter, Shield, ArrowRight, CheckCircle2, LayoutGrid, List as ListIcon, SlidersHorizontal, ChevronDown } from 'lucide-react';
import CompanyCard, { CompanyCardProps } from '@/components/company/CompanyCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { mapCompanyToList } from '@/lib/api-mapper';
import { motion, AnimatePresence } from 'framer-motion';

// Main Component Wrapper for Suspense
export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading search...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}

function SearchPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get active filters from URL
    const activeSector = searchParams.get('sector') || 'All';
    const activeVerification = searchParams.get('verification') || 'All';
    const searchQuery = searchParams.get('q') || '';

    const [companies, setCompanies] = useState<CompanyCardProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch when filters change
    useEffect(() => {
        async function fetchResults() {
            setIsLoading(true);
            try {
                // Construct query string
                const params = new URLSearchParams();
                if (activeSector !== 'All') params.set('sector', activeSector);
                if (activeVerification !== 'All') params.set('verification', activeVerification.toLowerCase());
                if (searchQuery) params.set('search', searchQuery); // Assuming API supports search param? Not yet in route.ts but user might expect it.
                // Note: route.ts currently filters by sector and verification. Search text support might be needed later.

                const res = await fetch(`/api/companies?${params.toString()}`);
                if (!res.ok) throw new Error('Fetch failed');
                const json = await res.json();

                // Map API data to component props
                if (json.data && Array.isArray(json.data)) {
                    setCompanies(json.data.map(mapCompanyToList));
                } else {
                    setCompanies([]);
                }

            } catch (err) {
                console.error(err);
                setCompanies([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchResults();
    }, [activeSector, activeVerification, searchQuery]);


    // Update URL helper
    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === 'All') {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-white" data-theme="light">
            <Navbar />

            {/* Hero / Header Section */}
            <div className="relative border-b border-slate-100 bg-slate-50/50">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <div className="container mx-auto px-6 py-12 pt-16 max-w-[1600px]">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                Find Verified African Companies
                            </h1>
                        </motion.div>

                        {/* Premium Two-Box Search */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="max-w-2xl mx-auto flex items-center gap-3"
                        >
                            {/* Box 1: Search Trigger */}
                            <button
                                onClick={() => {
                                    if (searchQuery.trim()) {
                                        updateFilter('q', searchQuery);
                                    }
                                }}
                                className="h-14 w-16 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm group"
                            >
                                <Search className="h-6 w-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                            </button>

                            {/* Box 2: Input Field */}
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by name, sector, or investors..."
                                    className="w-full h-14 px-6 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm text-base font-medium"
                                    defaultValue={searchQuery}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            updateFilter('q', e.currentTarget.value);
                                        }
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 py-12 max-w-[1600px]">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Sidebar Filters - "Swiss Control Panel" */}
                    <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
                        <div className="sticky top-24 space-y-8">
                            <div className="flex items-center gap-2 text-slate-900 font-bold pb-4 border-b border-slate-100">
                                <SlidersHorizontal size={18} />
                                <span>Filters</span>
                            </div>

                            {/* Sector Filter */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <LayoutGrid size={14} /> Sector
                                </h3>
                                <div className="space-y-1">
                                    {['All', 'Fintech', 'Logistics', 'Healthtech', 'Cleantech', 'AgriTech'].map(sector => (
                                        <button
                                            key={sector}
                                            onClick={() => updateFilter('sector', sector)}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${activeSector === sector
                                                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                }`}
                                        >
                                            {sector}
                                            {activeSector === sector && <CheckCircle2 size={14} className="text-emerald-400" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Verification Filter */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Shield size={14} /> Verification Tier
                                </h3>
                                <div className="space-y-1">
                                    {['All', 'Verified', 'Self-Reported'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => updateFilter('verification', status)}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between ${activeVerification === status
                                                ? 'bg-white border border-emerald-500 text-emerald-700 shadow-sm'
                                                : 'text-slate-600 border border-transparent hover:bg-slate-50'
                                                }`}
                                        >
                                            {status}
                                            {activeVerification === status && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-sm font-medium text-slate-500">
                                Showing <span className="text-slate-900 font-bold">{companies.length}</span> companies
                            </p>

                            <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                                Sort by: Recommended <ChevronDown size={14} />
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                    <div key={n} className="h-[320px] bg-slate-50/50 rounded-2xl border border-slate-100 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                <AnimatePresence mode="popLayout">
                                    {companies.map((company, index) => (
                                        <motion.div
                                            key={company.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <CompanyCard {...company} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {companies.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full py-20 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200"
                                    >
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                                            <Search className="text-slate-400" size={24} />
                                        </div>
                                        <h3 className="text-slate-900 font-bold text-lg mb-2">No results found</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto mb-6">
                                            We couldn't find any companies matching your specific criteria. Try broadening your search.
                                        </p>
                                        <button
                                            onClick={() => router.push('/search')}
                                            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                                        >
                                            Clear all filters
                                        </button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Pagination (Visual) */}
                        {!isLoading && companies.length > 0 && (
                            <div className="mt-12 flex justify-center items-center gap-2">
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all disabled:opacity-50" disabled>
                                    <ArrowRight size={16} className="rotate-180" />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20">1</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-all">2</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-all">3</button>
                                <span className="text-slate-300 font-bold px-2">...</span>
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
