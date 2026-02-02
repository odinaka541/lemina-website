'use client';

import { TrendingUp, Activity, Globe, Zap, Search, ArrowRight, Wallet, Building2, Plus, ArrowUpRight, CheckCircle2, BellRing } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import CompanyCard, { CompanyCardProps } from '@/components/company/CompanyCard';
import { mapCompanyToList } from '@/lib/api-mapper';
import { Task } from '@/lib/types';

// New Components
import StatCard from '@/components/dashboard/StatCard';
import TaskActionCard from '@/components/dashboard/TaskActionCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import OnboardingState from '@/components/dashboard/OnboardingState';
import FilterBar, { FilterState } from '@/components/dashboard/FilterBar';

export default function DashboardPage() {
    const [companies, setCompanies] = useState<CompanyCardProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activities, setActivities] = useState<any[]>([]);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState({
        total_deal_flow: 0,
        active_diligence: 0,
        market_cap: 0,
        new_opportunities: 0,
        completed_deals: 0 // Adding mocked field
    });

    // Filter State - Top Matches
    const [filters, setFilters] = useState<FilterState>({
        sector: [],
        stage: [],
        location: [],
        verification: []
    });

    // Filter State - Trending
    const [trendingFilters, setTrendingFilters] = useState<FilterState>({
        sector: [],
        stage: [],
        location: [],
        verification: []
    });

    const [user] = useState({ name: 'Odinaka' });

    useEffect(() => {
        async function fetchData() {
            try {
                // 1. Fetch Companies
                const resCompanies = await fetch('/api/companies?limit=20'); // Fetch more to show filtering better
                if (resCompanies.ok) {
                    const json = await resCompanies.json();
                    setCompanies(json.data.map(mapCompanyToList));
                }

                // 2. Fetch Activities
                const resActivities = await fetch('/api/activities');
                if (resActivities.ok) {
                    const json = await resActivities.json();
                    setActivities(json.data);
                }

                // 3. Fetch Stats
                const resStats = await fetch('/api/dashboard/stats');
                if (resStats.ok) {
                    const json = await resStats.json();
                    // Mock completed_deals if missing from API
                    if (json.completed_deals === undefined) json.completed_deals = 12;
                    setStats(json);
                }

                // 4. Fetch Tasks (Pending Actions)
                const resTasks = await fetch('/api/tasks');
                if (resTasks.ok) {
                    const json = await resTasks.json();
                    if (json.data && json.data.length > 0) {
                        setTasks(json.data);
                    } else {
                        // Mock Data for "Pending Actions" if API is empty
                        setTasks([
                            {
                                id: 't-1',
                                title: 'Review Term Sheet: TikiAnaly',
                                type: 'review',
                                status: 'pending',
                                priority: 'high',
                                due_date: new Date().toISOString() // Today
                            },
                            {
                                id: 't-2',
                                title: 'Schedule call with Paystack Founder',
                                type: 'call',
                                status: 'pending',
                                priority: 'medium',
                                due_date: new Date(Date.now() + 86400000).toISOString() // Tomorrow
                            }
                        ]);
                    }
                }
            } catch (error) {
                console.error('Dashboard Fetch Error:', error);
            } finally {
                setIsLoading(false);
                setLoadingActivities(false);
            }
        }

        fetchData();
    }, []);

    // --- Filtering Logic ---
    const getVerificationTier = (score: number) => {
        if (score >= 90) return 'Tier 5 (90+)';
        if (score >= 80) return 'Tier 4 (80-89)';
        if (score >= 60) return 'Tier 3 (60-79)';
        if (score >= 40) return 'Tier 2 (40-59)';
        return 'Tier 1 (<40)';
    };

    const applyFilters = (list: CompanyCardProps[], activeFilters: FilterState) => {
        return list.filter(company => {
            const sectorMatch = activeFilters.sector.length === 0 || activeFilters.sector.some(s => company.description.toLowerCase().includes(s.toLowerCase()));
            const stageMatch = activeFilters.stage.length === 0 || activeFilters.stage.some(s => company.funding.toLowerCase().includes(s.toLowerCase()));
            const locationMatch = activeFilters.location.length === 0 || activeFilters.location.some(l => company.location.includes(l));
            const tier = getVerificationTier(company.matchScore || 0);
            const verificationMatch = activeFilters.verification.length === 0 || activeFilters.verification.includes(tier);

            return sectorMatch && stageMatch && locationMatch && verificationMatch;
        });
    };

    // Split initial list into Recommended and Trending (Mock logic: first 10 recommended, next 10 trending)
    // In a real app, these might come from separate API endpoints or flags.
    const initialRecommended = companies.slice(0, 10);
    const initialTrending = companies.slice(10, 20);

    const recommended = applyFilters(initialRecommended, filters).slice(0, 4);
    const trending = applyFilters(initialTrending, trendingFilters).slice(0, 4);

    const isNewUser = stats.active_diligence === 0 && stats.market_cap === 0;

    // Dynamic Greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="min-h-screen bg-slate-50/50 pb-32">

            {/* Glass Canopy Header Section */}
            <div className="relative border-b border-indigo-100/50 overflow-hidden bg-white/40 backdrop-blur-xl pt-12 pb-6">
                {/* Abstract Background Blobs */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-50/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 space-y-6">
                    {/* Header / Welcome */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-sans">
                                {greeting}, {user.name}! 👋
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard/pipeline?action=new"
                                className="group flex items-center gap-3 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <Plus size={18} className="text-slate-300 group-hover:text-white transition-colors" />
                                <span>Create New Deal</span>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Grid - 3 Horizontal Tactile Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* 1. Pending Actions (List View) */}
                        <TaskActionCard tasks={tasks} />

                        {/* 2. Active Diligence - GRAYSCALE */}
                        <StatCard
                            icon={Activity}
                            label="Active Diligence"
                            value={stats.active_diligence.toString()}
                            subtext={stats.active_diligence > 0 ? "Deals in negotiation" : "Pipeline empty"}
                            color="gray"
                            variant="compact"
                            actionLabel="Go to Pipeline"
                            actionLink="/dashboard/pipeline"
                        />

                        {/* 3. New Opportunities - GRAYSCALE */}
                        <StatCard
                            icon={Zap}
                            label="New Opportunities"
                            value={stats.new_opportunities.toString()}
                            subtext="Added this week"
                            color="gray"
                            variant="compact"
                            actionLabel="Discover"
                            actionLink="/search?sort=newest"
                        />
                    </div>
                </div>
            </div>

            {/* Empty State vs Main Content */}
            {isNewUser && !isLoading ? (
                <div className="container mx-auto px-6 mt-10">
                    <OnboardingState />
                </div>
            ) : null}

            {/* Main Content Grid */}
            <div className="container mx-auto px-6 mt-12 grid grid-cols-1 xl:grid-cols-4 gap-10 items-start">

                {/* Left Column - Feeds */}
                <div className="xl:col-span-3 space-y-12">

                    {/* Personalized Recommendations */}
                    <section>
                        {/* Premium Section Header */}
                        <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-2">
                                    Top Matches
                                </h2>
                                <p className="text-sm text-slate-500 font-medium">Curated selection based on your thesis</p>
                            </div>
                            <Link
                                href="/search?filter=recommended"
                                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                            >
                                View All <ArrowRight size={12} />
                            </Link>
                        </div>

                        {/* Top Matches Filters */}
                        <div className="mb-6">
                            <FilterBar filters={filters} onFilterChange={setFilters} />
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2].map(n => (
                                    <div key={n} className="h-[280px] bg-white rounded-2xl animate-pulse border border-slate-100 shadow-sm"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {recommended.map((company, i) => (
                                    <CompanyCard
                                        key={company.id}
                                        {...company}
                                        matchScore={company.matchScore || (i === 0 ? 98 : 95)} // Use data score or fallback
                                    />
                                ))}
                                {recommended.length === 0 && (
                                    <div className="col-span-2 py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Search size={20} className="text-slate-400" />
                                        </div>
                                        <p className="text-slate-500 font-medium">No results match your filters.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Trending Section */}
                    <section>
                        {/* Premium Section Header */}
                        <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-2">
                                    Popular in Network
                                </h2>
                                <p className="text-sm text-slate-500 font-medium">High momentum across the network</p>
                            </div>
                        </div>

                        {/* Trending Filters */}
                        <div className="mb-6">
                            <FilterBar filters={trendingFilters} onFilterChange={setTrendingFilters} />
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2].map(n => (
                                    <div key={n} className="h-[280px] bg-white rounded-2xl animate-pulse border border-slate-100 shadow-sm"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {trending.map(company => (
                                    <CompanyCard key={company.id} {...company} />
                                ))}
                                {trending.length === 0 && (
                                    <div className="col-span-2 py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                        <p className="text-slate-400 font-medium">No trending companies found.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Column - Activity */}
                <div className="space-y-8 sticky top-32">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Activity</h3>
                        <div className="h-px bg-slate-200 flex-1 ml-4"></div>
                    </div>
                    <ActivityFeed activities={activities} isLoading={loadingActivities} />
                </div>
            </div>
        </div>
    );
}
