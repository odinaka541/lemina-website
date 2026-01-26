'use client';

import { ArrowRight, TrendingUp, Activity, Globe, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import CompanyCard, { CompanyCardProps } from '@/components/company/CompanyCard';
import { mapCompanyToList } from '@/lib/api-mapper';

// Mock Data (Reusing some from Search Page for consistency)
const RECOMMENDED_COMPANIES = [
    {
        id: '1',
        name: 'Paystack',
        description: 'Modern online and offline payments for Africa.',
        location: 'Lagos, Nigeria',
        logo: null,
        employees: 250,

        funding: 'Acquired',
        flags: ['ng'],
        lastUpdated: '2h ago',
        metrics: [
            { label: "Funding Stage", value: "Acquired" },
            { label: "Business Model", value: "B2B Payment Gateway" },
            { label: "Traction Signals", value: "Processes 50% of Nigeria's online payments" },
            { label: "Market Opportunity", value: "Dominating African payment infrastructure" },
            { label: "Why Promising?", value: "Deep local bank integration and reliability" },
            { label: "Regulatory Status", value: "Fully Licensed (CBN)" }
        ]
    },
    {
        id: '4',
        name: 'M-KOPA',
        description: 'Connected asset financing for underbanked customers.',
        location: 'Nairobi, Kenya',
        logo: null,
        employees: 1000,

        funding: 'Debt Financing',
        flags: ['ke'],
        lastUpdated: '3d ago',
        metrics: [
            { label: "Funding Stage", value: "Debt Financing" },
            { label: "Business Model", value: "Asset Financing / PAYG" },
            { label: "Traction Signals", value: "3M+ Customers, >$1B financing deployed" },
            { label: "Market Opportunity", value: "Credit for the underbanked millions" },
            { label: "Why Promising?", value: "Proprietary locking tech & repayment data" },
            { label: "Regulatory Status", value: "Compliant" }
        ]
    },

    {
        id: '7',
        name: 'Moniepoint',
        description: 'All-in-one business banking solution for emerging markets.',
        location: 'Lagos, Nigeria',
        logo: null,
        employees: 1200,

        funding: 'Series C',
        flags: ['ng'],
        lastUpdated: '1d ago',
        metrics: [
            { label: "Funding Stage", value: "Series C" },
            { label: "Business Model", value: "Business Banking & Payments" },
            { label: "Traction Signals", value: "$12B+ Monthly TPV" },
            { label: "Market Opportunity", value: "Banking for 40M+ MSMEs" },
            { label: "Why Promising?", value: "Dominant offline distribution network" },
            { label: "Regulatory Status", value: "Banking License" }
        ]
    },
    {
        id: '8',
        name: 'Chowdeck',
        description: 'Fastest food delivery service in Africa.',
        location: 'Lagos, Nigeria',
        logo: null,
        employees: 150,

        funding: 'Seed',
        flags: ['ng'],
        lastUpdated: '4h ago',
        metrics: [
            { label: "Funding Stage", value: "Seed" },
            { label: "Business Model", value: "On-demand Delivery" },
            { label: "Traction Signals", value: "300k+ Monthly Orders" },
            { label: "Market Opportunity", value: "Hyper-local logistics" },
            { label: "Why Promising?", value: "Best-in-class unit economics" },
            { label: "Regulatory Status", value: "Operating" }
        ]
    },
    {
        id: '9',
        name: 'Bamboo',
        description: 'Real-time access to global investment opportunities.',
        location: 'Lagos, Nigeria',
        logo: null,
        employees: 80,

        funding: 'Series A',
        flags: ['ng', 'gh'],
        lastUpdated: '6h ago',
        metrics: [
            { label: "Funding Stage", value: "Series A" },
            { label: "Business Model", value: "Wealth Tech / Brokerage" },
            { label: "Traction Signals", value: "500k+ Registered Users" },
            { label: "Market Opportunity", value: "Democratizing global access" },
            { label: "Why Promising?", value: "Licensed in Nigeria & Ghana" },
            { label: "Regulatory Status", value: "SEC Licensed" }
        ]
    }
];

const TRENDING_COMPANIES = [
    {
        id: '2',
        name: 'Flutterwave',
        description: 'Simplifying payments for endless possibilities.',
        location: 'Lagos, Nigeria',
        logo: null,
        employees: 500,

        funding: 'Series D',
        flags: ['ng'],
        lastUpdated: '5h ago',
        metrics: [
            { label: "Funding Stage", value: "Series D" },
            { label: "Business Model", value: "Payment Infrastructure" },
            { label: "Traction Signals", value: "Unicorn status, broad Pan-African presence" },
            { label: "Market Opportunity", value: "Connecting Africa to global economy" },
            { label: "Why Promising?", value: "Extensive partnerships network" },
            { label: "Regulatory Status", value: "Various Licenses" }
        ]
    },
    {
        id: '6',
        name: 'Wasoko',
        description: 'Transforming informal retail supply chains in Africa.',
        location: 'Nairobi, Kenya',
        logo: null,
        employees: 800,

        funding: 'Series B',
        flags: ['ke'],
        lastUpdated: '2d ago',
        metrics: [
            { label: "Funding Stage", value: "Series B" },
            { label: "Business Model", value: "B2B E-commerce" },
            { label: "Traction Signals", value: "Huge network of informal retailers" },
            { label: "Market Opportunity", value: "Digitizing the informal economy" },
            { label: "Why Promising?", value: "Strong last-mile delivery infrastructure" },
            { label: "Regulatory Status", value: "Active" }
        ]
    }
];

function StatWidget({ icon: Icon, label, value, trend, color }: any) {
    return (
        <div className="glass-panel p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">{value}</h3>
                    <span className="text-xs text-emerald-500 font-medium">{trend}</span>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [companies, setCompanies] = useState<CompanyCardProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCompanies() {
            try {
                const res = await fetch('/api/companies?limit=10');
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();

                // Use the mapper utility
                const mapped = json.data.map(mapCompanyToList);
                setCompanies(mapped);
            } catch (error) {
                console.error('Dashboard Fetch Error:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCompanies();
    }, []);

    // Split into "Recommended" and "Trending" for UI variety (just slicing for now)
    const recommended = companies.slice(0, 4);
    const trending = companies.slice(4, 8);

    return (
        <div className="container mx-auto px-4 pt-8 pb-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Dashboard</h1>
                    <p className="text-[var(--color-text-secondary)]">Welcome back. Here's what's happening in the market.</p>
                </div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                    Last updated: <span className="text-[var(--color-text-primary)] font-mono">Just now</span>
                </div>
            </div>

            {/* Market Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatWidget
                    icon={TrendingUp}
                    label="Total Deal Flow"
                    value="1,248"
                    trend="+12% this week"
                    color="emerald"
                />
                <StatWidget
                    icon={Activity}
                    label="Active Due Diligence"
                    value="8"
                    trend="2 closing soon"
                    color="blue"
                />
                <StatWidget
                    icon={Globe}
                    label="Market Cap Tracked"
                    value="$14.2B"
                    trend="+5% MoM"
                    color="purple"
                />
                <StatWidget
                    icon={Zap}
                    label="New Opportunities"
                    value={isLoading ? "..." : companies.length.toString()}
                    trend="Matches your thesis"
                    color="amber"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Left Column - Feeds */}
                <div className="xl:col-span-3 space-y-8">
                    {/* Recommended Section */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                                <Zap size={20} className="text-amber-500" />
                                Recommended for You
                            </h2>
                            <Link href="/search" className="text-sm text-[var(--color-accent-primary)] hover:text-white transition-colors flex items-center gap-1">
                                View all <ArrowRight size={14} />
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map(n => (
                                    <div key={n} className="h-48 bg-[var(--card-bg)] rounded-xl animate-pulse border border-[var(--color-border)]"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {recommended.map(company => (
                                    <CompanyCard key={company.id} {...company} />
                                ))}
                                {recommended.length === 0 && <p className="text-[var(--color-text-secondary)]">No recommended companies found.</p>}
                            </div>
                        )}
                    </section>

                    {/* Trending Section */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                                <TrendingUp size={20} className="text-emerald-500" />
                                Trending in Network
                            </h2>
                        </div>
                        {isLoading ? (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {[1, 2].map(n => (
                                    <div key={n} className="h-48 bg-[var(--card-bg)] rounded-xl animate-pulse border border-[var(--color-border)]"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {trending.map(company => (
                                    <CompanyCard key={company.id} {...company} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Column - Activity & Quick Actions */}
                <div className="space-y-6">
                    {/* Recent Activity */}
                    <div className="glass-panel p-4">
                        <h3 className="font-bold text-[var(--color-text-primary)] mb-3 text-sm">Recent Activity</h3>
                        <div className="space-y-3">
                            {[
                                { text: "Paystack released 2024 report", time: "2h ago", type: "report" },
                                { text: "Flutterwave raised Series E", time: "5h ago", type: "funding" },
                                { text: "New competitor for Chipper Cash", time: "1d ago", type: "alert" },
                                { text: "M-KOPA expanded to Ghana", time: "2d ago", type: "news" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-2 items-start pb-3 border-b border-[var(--color-border)] last:border-0 last:pb-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-primary)] mt-1.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-[var(--color-text-secondary)] leading-tight">{item.text}</p>
                                        <span className="text-[10px] text-[var(--color-text-secondary)] opacity-70">{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-3 py-1.5 text-xs text-[var(--color-text-secondary)] hover:text-white border border-[var(--color-border)] rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-all">
                            View All Activity
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-panel p-4">
                        <h3 className="font-bold text-[var(--color-text-primary)] mb-4 text-sm">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link href="/search" className="block w-full py-2 px-4 bg-[var(--color-accent-primary)] text-white text-center rounded-lg hover:bg-emerald-600 transition-colors font-medium text-xs">
                                Find Companies
                            </Link>
                            <button className="block w-full py-2 px-4 bg-[var(--input-bg)] text-[var(--color-text-primary)] text-center rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors border border-[var(--color-border)] text-xs">
                                Add Portfolio Company
                            </button>
                            <button className="block w-full py-2 px-4 bg-[var(--input-bg)] text-[var(--color-text-primary)] text-center rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors border border-[var(--color-border)] text-xs">
                                Create New Deal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom Spacer */}
            <div className="h-32 w-full" aria-hidden="true" />
        </div>
    );
}
