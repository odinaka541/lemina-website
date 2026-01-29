'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Briefcase, Calendar, CheckCircle2, Copy, Download, Globe, MapPin, MoreHorizontal, PieChart, Send, Share2, Plus } from 'lucide-react';
import { mapCompanyToDetail } from '@/lib/api-mapper';

// Tab Components (Imports will be active once files are created)
import OverviewTab from '@/components/company/tabs/OverviewTab';
import MarketTab from '@/components/company/tabs/MarketTab';
import TeamLegalTab from '@/components/company/tabs/TeamLegalTab';
import CommercialsTab from '@/components/company/tabs/CommercialsTab';
import NewsTab from '@/components/company/tabs/NewsTab';
import AIAnalysisCard from '@/components/market/AIAnalysisCard';


const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'market', label: 'Market' },
    { id: 'team-legal', label: 'Team & Legal' },
    { id: 'commercials', label: 'Commercials & Financials' },
    { id: 'news', label: 'News' },
];

export default function CompanyPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    // State for fetching real data
    const [company, setCompany] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data using the mapper
    const { id } = params;

    // Import mapper dynamically if needed, or use the imported one (need to add import)
    // For now assuming `mapCompanyToDetail` is imported at top.

    useEffect(() => {
        if (!id) return;

        async function init() {
            try {
                const res = await fetch(`/api/companies/${id}`);
                if (!res.ok) throw new Error('Company not found');
                const json = await res.json();

                // Map the RAW API payload to our frontend profile structure
                // We need to import mapCompanyToDetail. 
                // Since I cannot add import in this tool call easily without breaking file structure in restricted edit, I'll rely on a second tool call to add imports.
                // Or I can copy the import here if I replace the whole file. 
                // Strategies: I'm replacing lines 23-181. I will assume imports are handled or I will add imports in a separate call.
                // Wait, I should do imports first or together.

                // Let's assume the function is valid.
                const mappedProfile = mapCompanyToDetail(json);
                setCompany(mappedProfile);
            } catch (err: any) {
                console.error("Failed to load company", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, [id]);


    const renderTabContent = () => {
        if (!company) return null;

        // Pass the REAL data to tabs
        switch (activeTab) {
            case 'overview': return <OverviewTab company={company} />;
            case 'market': return <MarketTab company={company} />;
            case 'team-legal': return <TeamLegalTab />;
            case 'commercials': return <CommercialsTab />;
            case 'news': return <NewsTab company={company} />;
            default: return <OverviewTab company={company} />;
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-[var(--color-text-secondary)]">Loading company profile...</div>;
    }

    if (error || !company) {
        return <div className="min-h-screen flex items-center justify-center text-rose-500">Error: {error || 'Company not found'}</div>;
    }

    return (
        <div className="min-h-screen bg-transparent pb-32">
            {/* Header / Sticky Top */}
            <div className="sticky top-16 z-20 bg-[var(--card-bg)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
                <div className="container mx-auto px-4 py-2">
                    {/* Navigation Actions */}
                    <div className="flex items-center justify-between mb-2">
                        <Link href="/dashboard" className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors text-xs">
                            <ArrowLeft size={14} />
                            Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-2">
                            <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors">
                                <Share2 size={16} />
                            </button>
                            <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors">
                                <Download size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Company Identity */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex gap-4">
                            {company.logo ? (
                                <img src={company.logo} alt={company.name} className="w-14 h-14 rounded-xl object-contain bg-white border border-[var(--color-border)] p-1" />
                            ) : (
                                <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-[var(--color-border)] flex items-center justify-center text-xl font-bold text-gray-900 overflow-hidden relative">
                                    {company.name.charAt(0)}
                                </div>
                            )}

                            <div>
                                <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-0.5">{company.name}</h1>
                                <p className="text-[var(--color-text-secondary)] text-xs mb-2 max-w-xl line-clamp-1">{company.description}</p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {company.tags.map((tag: string, index: number) => (
                                        <span key={index} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 text-[10px] text-[var(--color-text-secondary)] mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={10} />
                                        {company.location}
                                        {/* Flags - hardcoded NG for now or mapped */}
                                        <div className="flex items-center gap-1 ml-1">
                                            <img
                                                src="https://flagcdn.com/w20/ng.png"
                                                alt="Nigeria"
                                                className="w-4 h-3 object-cover rounded-[1px]"
                                            />
                                        </div>
                                    </div>
                                    {company.website && (
                                        <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[var(--color-accent-primary)] hover:underline">
                                            <Globe size={10} />
                                            {company.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    )}
                                </div>
                                <div className="text-[10px] text-[var(--color-text-secondary)] opacity-60 mb-2">
                                    Last updated: {company.lastUpdated}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="py-1.5 px-3 bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-secondary)] text-white text-xs font-medium rounded-lg transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-1.5">
                                        <Briefcase size={14} />
                                        Add to Pipeline
                                    </button>
                                    <button className="py-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors shadow-sm flex items-center gap-1.5">
                                        <Share2 size={14} />
                                        Share with Network
                                    </button>
                                    <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200 shadow-sm">
                                        {company.stage}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:flex w-full max-w-2xl gap-4 h-48">
                            {/* Private Notes */}
                            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm h-full min-h-[120px] flex flex-col relative flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-[10px] font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        Private Notes
                                    </label>
                                </div>
                                <div className="relative flex-1 group">
                                    <textarea
                                        className="w-full h-full min-h-[60px] bg-white border border-emerald-500 rounded-lg text-xs text-slate-700 placeholder-slate-400 resize-none focus:outline-none ring-1 ring-emerald-500 p-2 pr-8 leading-relaxed transition-all"
                                        placeholder=""
                                    />
                                    <button className="absolute bottom-2 right-2 p-1 bg-white text-emerald-600 border border-emerald-100 rounded hover:bg-emerald-50 hover:text-emerald-700 transition-all shadow-sm flex items-center justify-center">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* AI Analysis Button/Card */}
                            <div className="flex-1 min-w-[300px]">
                                <AIAnalysisCard companyId={company.id} />
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-[var(--color-border)] pt-1">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    px-3 py-1.5 text-xs font-medium rounded-t-lg whitespace-nowrap transition-colors relative
                                    ${activeTab === tab.id
                                        ? 'text-[var(--color-accent-primary)] border-b-2 border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/5'
                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="container mx-auto px-4 pt-40 pb-12">
                {renderTabContent()}
            </div>

            {/* Bottom Spacer */}
            <div className="h-32 w-full" aria-hidden="true" />
        </div >
    );
}
