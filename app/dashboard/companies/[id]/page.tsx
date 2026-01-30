'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Briefcase, Calendar, CheckCircle2, Copy, Download, Globe, MapPin, MoreHorizontal, PieChart, Send, Share2, Plus, Activity, Zap } from 'lucide-react';
import { mapCompanyToDetail } from '@/lib/api-mapper';
import { createClient } from '@/lib/supabase/client';
import { Investment, PortfolioAnalysis } from '@/lib/types';

// Tab Components
import OverviewTab from '@/components/company/tabs/OverviewTab';
import MarketTab from '@/components/company/tabs/MarketTab';
import TeamLegalTab from '@/components/company/tabs/TeamLegalTab';
import CommercialsTab from '@/components/company/tabs/CommercialsTab';
import NewsTab from '@/components/company/tabs/NewsTab';
import DocumentsTab from '@/components/company/tabs/DocumentsTab';
import MetricsTab from '@/components/company/tabs/MetricsTab';
import TimelineTab from '@/components/company/tabs/TimelineTab';

import AIAnalysisCard from '@/components/market/AIAnalysisCard';
import AIHealthBanner from '@/components/company/AIHealthBanner';
import AIAnalysisModal from '@/components/company/AIAnalysisModal';


const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'documents', label: 'Documents & Analysis' },
    { id: 'market', label: 'Market' },
    { id: 'team-legal', label: 'Team & Legal' },
    // { id: 'commercials', label: 'Commercials & Financials' },
    { id: 'news', label: 'News' },
];

export default function CompanyPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    // State for fetching real data
    const [company, setCompany] = useState<any>(null);
    const [investment, setInvestment] = useState<Investment | null>(null);
    const [latestAnalysis, setLatestAnalysis] = useState<PortfolioAnalysis | null>(null);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { id } = params;
    const supabase = createClient();

    useEffect(() => {
        if (!id) return;

        async function init() {
            try {
                // 1. Fetch Company Profile
                const res = await fetch(`/api/companies/${id}`);
                if (!res.ok) throw new Error('Company not found');
                const json = await res.json();
                const mappedProfile = mapCompanyToDetail(json);
                setCompany(mappedProfile);

                // 2. Fetch Investment Context (if any)
                const { data: invData } = await supabase
                    .from('investments')
                    .select('*')
                    .eq('company_id', id)
                    .maybeSingle();

                if (invData) {
                    setInvestment(invData as any);

                    // 3. Fetch Latest Analysis
                    const { data: analysisData } = await supabase
                        .from('portfolio_analyses')
                        .select('*')
                        .eq('investment_id', invData.id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle();

                    if (analysisData) {
                        setLatestAnalysis(analysisData as PortfolioAnalysis);
                    }
                }

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

        switch (activeTab) {
            case 'overview': return <OverviewTab company={company} />;
            case 'metrics': return <MetricsTab company={company} />;
            case 'timeline': return <TimelineTab investment={investment} />;
            case 'documents': return <DocumentsTab investmentId={investment?.id} companyId={company.id} />;
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

    // Filter tabs
    const visibleTabs = TABS.filter(t => ['metrics', 'timeline', 'documents'].includes(t.id) ? !!investment : true);

    return (
        <div className="min-h-screen bg-transparent pb-32">
            {/* Header / Sticky Top */}
            <div className="sticky top-16 z-20 bg-[var(--card-bg)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
                <div className="container mx-auto px-4 py-2">
                    {/* Navigation Actions */}
                    <div className="flex items-center justify-between mb-2">
                        <Link href="/dashboard/portfolio" className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors text-xs">
                            <ArrowLeft size={14} />
                            Back to Portfolio
                        </Link>
                        <div className="flex items-center gap-2">
                            <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors">
                                <Share2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Company Identity */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex gap-4">
                            {company.logo || company.logo_url ? (
                                <img src={company.logo || company.logo_url} alt={company.name} className="w-14 h-14 rounded-xl object-contain bg-white border border-[var(--color-border)] p-1" />
                            ) : (
                                <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-[var(--color-border)] flex items-center justify-center text-xl font-bold text-gray-900 overflow-hidden relative">
                                    {company.name.charAt(0)}
                                </div>
                            )}

                            <div>
                                <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-0.5 flex items-center gap-2">
                                    {company.name}
                                    {investment && (
                                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wide">Portfolio</span>
                                    )}
                                </h1>
                                <p className="text-[var(--color-text-secondary)] text-xs mb-2 max-w-xl line-clamp-1">{company.description_short || company.description}</p>

                                {/* Tags & Location */}
                                <div className="flex items-center gap-4 text-[10px] text-[var(--color-text-secondary)] mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={10} />
                                        {company.metadata?.headquarters?.city || company.location || 'Unknown'}
                                    </div>
                                    {company.website && (
                                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[var(--color-accent-primary)] hover:underline">
                                            <Globe size={10} />
                                            {company.website.replace(/^https?:\/\//, '').split('/')[0]}
                                        </a>
                                    )}
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

                            {/* AI Analysis */}
                            <div className="flex-1 min-w-[300px]">
                                {latestAnalysis ? (
                                    <AIHealthBanner analysis={latestAnalysis} onClick={() => setIsAnalysisModalOpen(true)} />
                                ) : (
                                    <AIAnalysisCard companyId={company.id} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-[var(--color-border)] pt-1">
                        {visibleTabs.map(tab => (
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
            <div className="container mx-auto px-4 pt-8 pb-12">
                {renderTabContent()}
            </div>

            <div className="h-32 w-full" aria-hidden="true" />

            {/* AI Analysis Modal */}
            {latestAnalysis && (
                <AIAnalysisModal
                    isOpen={isAnalysisModalOpen}
                    onClose={() => setIsAnalysisModalOpen(false)}
                    analysis={latestAnalysis}
                    companyName={company.name}
                />
            )}
        </div >
    );
}
