'use client';

// TODO: This page should be hidden behind log in. Do not enforce this rule yet until we set up the magic link log in again, but note.

import { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { Search, Filter, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import CompanyCard, { CompanyCardProps } from '@/components/company/CompanyCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { mapCompanyToList } from '@/lib/api-mapper';

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
        <div className="min-h-screen bg-slate-50 overflow-hidden relative" data-theme="light">
            <div className="gradient-bg opacity-50" />
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                {/* Search Header */}
                <div className="max-w-4xl mx-auto mb-10 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">
                        Find Verified African Companies
                    </h1>

                    {/* Search Bar - Two Box Design */}
                    <div className="max-w-2xl mx-auto flex items-center">
                        {/* Search Icon Box */}
                        <button
                            onClick={() => {
                                if (searchQuery.trim()) {
                                    updateFilter('q', searchQuery);
                                }
                            }}
                            className="h-12 w-14 flex items-center justify-center bg-white border border-slate-200 border-r-slate-100 rounded-l-xl hover:bg-slate-50 transition-colors group"
                        >
                            <Search className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                        </button>

                        {/* Input Box */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search by name, sector, or investors..."
                                className="w-full h-12 pl-4 pr-4 rounded-r-xl bg-white border border-slate-200 border-l-0 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder:text-slate-400"
                                defaultValue={searchQuery}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        updateFilter('q', e.currentTarget.value);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full md:w-64 flex-shrink-0 space-y-8">
                        {/* Sector Filter */}
                        <div>
                            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                                <Filter size={14} />
                                Sector
                            </h3>
                            <div className="space-y-2">
                                {['All', 'Fintech', 'Logistics', 'Healthtech', 'Cleantech', 'AgriTech'].map(sector => (
                                    <button
                                        key={sector}
                                        onClick={() => updateFilter('sector', sector)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSector === sector
                                            ? 'bg-[var(--color-accent-primary)] text-white font-medium'
                                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]'
                                            }`}
                                    >
                                        {sector}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Verification Filter */}
                        <div>
                            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                                <Shield size={14} />
                                Verification
                            </h3>
                            <div className="space-y-2">
                                {['All', 'Verified', 'Self-Reported'].map(status => (
                                    <label key={status} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${activeVerification === status
                                            ? 'bg-[var(--color-accent-primary)] border-[var(--color-accent-primary)]'
                                            : 'border-[var(--color-border)] group-hover:border-[var(--color-text-secondary)]'
                                            }`}>
                                            {activeVerification === status && <CheckCircle2 size={10} className="text-white" />}
                                        </div>
                                        <button onClick={() => updateFilter('verification', status)}>{status}</button>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                Showing <span className="font-bold text-[var(--color-text-primary)]">{companies.length}</span> results
                            </p>

                            {/* Sort Dropdown (Visual only for now) */}
                            <button className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                                Sort by: Recommended <ArrowRight size={14} className="rotate-90" />
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                    <div key={n} className="h-64 bg-[var(--card-bg)] rounded-xl border border-[var(--color-border)] animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {companies.map(company => (
                                    <CompanyCard key={company.id} {...company} />
                                ))}

                                {companies.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-[var(--color-text-secondary)] bg-[var(--card-bg)] rounded-xl border border-[var(--color-border)] border-dashed">
                                        <p>No companies found matching your criteria.</p>
                                        <button
                                            onClick={() => router.push('/search')}
                                            className="mt-2 text-[var(--color-accent-primary)] hover:underline text-sm"
                                        >
                                            Clear filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination (Visual) */}
                        {!isLoading && companies.length > 0 && (
                            <div className="mt-8 flex justify-center gap-2">
                                <button className="px-3 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]" disabled>Prev</button>
                                <button className="px-3 py-1 rounded bg-[var(--color-accent-primary)] text-white">1</button>
                                <button className="px-3 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]">2</button>
                                <button className="px-3 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]">Next</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
