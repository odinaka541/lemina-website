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
import FilterBar from '@/components/dashboard/FilterBar';

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

    const [user] = useState({ name: 'Odinaka' });

    useEffect(() => {
        async function fetchData() {
            try {
                // 1. Fetch Companies
                const resCompanies = await fetch('/api/companies?limit=10');
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
                    setTasks(json.data || []);
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

    const recommended = companies.slice(0, 4);
    const trending = companies.slice(4, 8);

    const isNewUser = stats.active_diligence === 0 && stats.market_cap === 0;

    // Dynamic Greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="container mx-auto px-4 pt-32 pb-12 space-y-10">
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
                        {greeting}, {user.name}! <span className="ml-1">👋</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm">
                        Here's everything you missed.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-xs text-slate-400 font-medium hidden md:block">
                        Last updated: <span className="text-slate-600">Just now</span>
                    </p>
                    <Link
                        href="/dashboard/pipeline?action=new"
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
                    >
                        <Plus size={16} />
                        New Deal
                    </Link>
                </div>
            </div>

            {/* Stats Grid - 3 Horizontal Compact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* 1. Pending Actions (List View) */}
                {/* 1. Pending Actions (List View) */}
                <TaskActionCard tasks={tasks} />

                {/* 2. Active Diligence */}
                <StatCard
                    icon={Activity}
                    label="Active Diligence"
                    value={stats.active_diligence.toString()}
                    subtext={stats.active_diligence > 0 ? "In progress now" : "No active pipeline"}
                    color="gray"
                    variant="compact"
                    actionLabel="View Pipeline"
                    actionLink="/dashboard/pipeline"
                />

                {/* 3. New Opportunities (Grayscale requested, Zap icon remains) */}
                <StatCard
                    icon={Zap}
                    label="New Opportunities"
                    value={stats.new_opportunities.toString()}
                    subtext="Added this week"
                    color="gray" // Grayscale as requested
                    variant="compact"
                    actionLabel="View Companies"
                    actionLink="/search?sort=newest"
                />
            </div>

            {/* Empty State vs Main Content */}
            {isNewUser && !isLoading ? (
                <OnboardingState />
            ) : null}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Left Column - Feeds */}
                <div className="xl:col-span-3 space-y-10">

                    {/* Personalized Recommendations */}
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-1">
                                    <Zap size={20} className="text-amber-500 fill-amber-500" />
                                    Top Matches for Fintech Investors
                                </h2>
                                <p className="text-sm text-slate-500 font-medium">Here are companies that match your investment thesis.</p>
                            </div>
                            <Link
                                href="/search?filter=recommended"
                                className="text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                            >
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>

                        {/* Phase 2: Filters */}
                        <FilterBar />

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2].map(n => (
                                    <div key={n} className="h-[240px] bg-white rounded-2xl animate-pulse border border-slate-100"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {recommended.slice(0, 2).map((company, i) => (
                                    <CompanyCard
                                        key={company.id}
                                        {...company}
                                        matchScore={i === 0 ? 98 : 95} // Mock Intelligence
                                        isVerified={true} // Mock Verification
                                    />
                                ))}
                                {recommended.length === 0 && (
                                    <div className="col-span-2 py-10 text-center border-2 border-dashed border-slate-200 rounded-xl">
                                        <p className="text-slate-400">No recommendations available yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Trending Section */}
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-1">
                                    <TrendingUp size={20} className="text-emerald-500" />
                                    Trending in Network
                                </h2>
                                <p className="text-sm text-slate-500 font-medium">Rising stars with high investor momentum.</p>
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2].map(n => (
                                    <div key={n} className="h-[240px] bg-white rounded-2xl animate-pulse border border-slate-100"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {trending.slice(0, 2).map(company => (
                                    <CompanyCard key={company.id} {...company} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Column - Activity */}
                <div className="space-y-6">
                    <ActivityFeed activities={activities} isLoading={loadingActivities} />
                </div>
            </div>

            {/* Bottom Spacer */}
            <div className="h-20 w-full" aria-hidden="true" />
        </div>
    );
}
