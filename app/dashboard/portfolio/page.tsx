'use client';

import { useState, useEffect, Suspense } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, ArrowUpRight, FileText, Download, Plus, Activity } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AllocationChart from '@/components/portfolio/AllocationChart';
import UploadDocumentModal from '@/components/portfolio/UploadDocumentModal';
import AddInvestmentModal from '@/components/portfolio/AddInvestmentModal';
import EmptyPortfolioState from '@/components/portfolio/EmptyPortfolioState';
import PortfolioTable from '@/components/portfolio/PortfolioTable';
import AIInsightsPanel from '@/components/dashboard/AIInsightsPanel';
import { PortfolioDocument, MetricsState } from '@/lib/types';

function PortfolioContent() {
    const [stats, setStats] = useState<MetricsState>({
        totalInvested: '$0',
        currentValue: '$0',
        moic: '0.00x',
        netIrr: '0%',
        healthScore: 0,
        activeCompanies: 0
    });
    const [sectors, setSectors] = useState<any[]>([]);
    const [stages, setStages] = useState<any[]>([]);
    const [portfolioCompanies, setPortfolioCompanies] = useState<any[]>([]);
    const [documents, setDocuments] = useState<PortfolioDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('action') === 'new') {
            setIsAddInvestmentOpen(true);
        }
        fetchData();
    }, [searchParams]);

    async function fetchData() {
        try {
            // Parallel fetch for speed
            const [portfolioRes, docsRes] = await Promise.all([
                fetch('/api/portfolio', { cache: 'no-store' }),
                fetch('/api/documents', { cache: 'no-store' })
            ]);

            const portfolioJson = await portfolioRes.json();
            const docsJson = await docsRes.json();

            if (portfolioJson.investments) {
                setStats(portfolioJson.stats);
                setSectors(portfolioJson.sectors);
                setStages(portfolioJson.stages);
                setPortfolioCompanies(portfolioJson.investments);
            }

            if (Array.isArray(docsJson)) {
                setDocuments(docsJson);
            }

        } catch (error) {
            console.error("Failed to load portfolio/docs", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDocUploadSuccess = (newDoc: PortfolioDocument) => {
        setDocuments(prev => [newDoc, ...prev]);
    };

    const handleInvestmentSuccess = () => {
        fetchData();
    };

    const getHealthColor = (score: number) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-amber-500';
        return 'text-red-500';
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-32">
            {/* Glass Canopy Header Section */}
            <div className="relative border-b border-indigo-100/50 overflow-hidden bg-white/40 backdrop-blur-xl pt-12 pb-6">
                {/* Abstract Background Blobs */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-50/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4 flex-1">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">
                            Portfolio Intelligence
                        </h1>

                        {/* Two-Box Search Bar */}
                        <div className="flex items-center gap-2 max-w-md">
                            <div className="w-10 h-10 flex items-center justify-center bg-white/60 border border-slate-200/60 rounded-xl text-slate-500 shadow-sm backdrop-blur-md">
                                <FileText size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search investments, reports..."
                                className="h-10 flex-1 bg-white/60 border border-slate-200/60 rounded-xl px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 shadow-sm transition-all backdrop-blur-md"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200/60 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                        >
                            <Download size={16} /> Upload Report
                        </button>
                        <button
                            onClick={() => setIsAddInvestmentOpen(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                        >
                            <Plus size={18} className="text-slate-300 group-hover:text-white transition-colors" />
                            <span>New Investment</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-8 space-y-8">
                {/* Stats Grid - 4 Horizontal Tactile Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Total Invested */}
                    <div className="bg-white/60 border border-slate-200/60 rounded-2xl p-6 shadow-sm backdrop-blur-md relative overflow-hidden group hover:shadow-md transition-all duration-300 cursor-default">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <DollarSign size={64} className="text-indigo-600" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Total Invested</p>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight font-mono">{stats.totalInvested}</h3>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Across {portfolioCompanies.length} companies</p>
                    </div>

                    {/* Card 2: Current Value */}
                    <div className="bg-white/60 border border-slate-200/60 rounded-2xl p-6 shadow-sm backdrop-blur-md relative overflow-hidden group hover:shadow-md transition-all duration-300 cursor-default">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <TrendingUp size={64} className="text-emerald-600" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Current Val.</p>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight font-mono">{stats.currentValue}</h3>
                        <div className={`inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide ${parseFloat(stats.netIrr) >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            {parseFloat(stats.netIrr) >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {stats.netIrr} IRR
                        </div>
                    </div>

                    {/* Card 3: Portfolio MOIC */}
                    <div className="bg-white/60 border border-slate-200/60 rounded-2xl p-6 shadow-sm backdrop-blur-md relative overflow-hidden group hover:shadow-md transition-all duration-300 cursor-default">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Activity size={64} className="text-amber-600" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Realized MOIC</p>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight font-mono">{stats.moic}</h3>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Target: 3.00x</p>
                    </div>

                    {/* Card 4: AI Health Score */}
                    <div className="bg-white/60 border border-slate-200/60 rounded-2xl p-6 shadow-sm backdrop-blur-md relative overflow-hidden group hover:shadow-md transition-all duration-300 cursor-default">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Activity size={64} className={getHealthColor(stats.healthScore)} />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Portfolio Health</p>
                        <div className="flex items-baseline gap-3">
                            <h3 className={`text-3xl font-bold tracking-tight font-mono ${getHealthColor(stats.healthScore)}`}>
                                {stats.healthScore}
                            </h3>
                            <span className="text-sm font-semibold text-slate-400">/ 100</span>
                        </div>
                        <div className="mt-2 text-xs flex gap-2">
                            <span className="flex items-center gap-1 text-emerald-600 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {portfolioCompanies.filter(c => c.ai_health_score >= 80).length}</span>
                            <span className="flex items-center gap-1 text-amber-600 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {portfolioCompanies.filter(c => c.ai_health_score >= 60 && c.ai_health_score < 80).length}</span>
                            <span className="flex items-center gap-1 text-red-600 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {portfolioCompanies.filter(c => c.ai_health_score < 60).length}</span>
                        </div>
                    </div>
                </div>

                {/* AI Insights Bar */}
                <div className="mb-8 h-[220px] rounded-2xl overflow-hidden shadow-lg shadow-indigo-900/5 ring-1 ring-slate-900/5">
                    <AIInsightsPanel />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Charts (2/3 width) - Only show if data exists */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
                                <PieChartIcon size={16} className="text-indigo-500" />
                                Sector Allocation
                            </h3>
                            {sectors.length > 0 ? (
                                <AllocationChart data={sectors} />
                            ) : (
                                <div className="h-48 flex items-center justify-center text-sm text-slate-400 border border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                                    Add investments to see breakdown
                                </div>
                            )}
                        </div>
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
                                <PieChartIcon size={16} className="text-emerald-500" />
                                Stage Allocation
                            </h3>
                            {stages.length > 0 ? (
                                <AllocationChart data={stages} />
                            ) : (
                                <div className="h-48 flex items-center justify-center text-sm text-slate-400 border border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                                    Track investments by stage
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Documents List (1/3 width) */}
                    <div className="bg-white border border-slate-200/60 rounded-2xl flex flex-col h-[360px] shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                                <FileText size={16} className="text-slate-500" />
                                Documents
                            </h3>
                            <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-sm">
                                {documents.length}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {documents.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-80">
                                    <FileText size={32} className="mb-2 opacity-50" />
                                    <p className="text-xs font-medium">No documents yet.</p>
                                </div>
                            ) : documents.map((doc) => (
                                <div key={doc.id} className="p-3 rounded-xl hover:bg-slate-50 transition-colors group flex items-center justify-between border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border shadow-sm ${doc.type === 'Report' ? 'bg-sky-50 border-sky-100 text-sky-600' :
                                            doc.type === 'Contract' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                                'bg-slate-50 border-slate-100 text-slate-500'
                                            }`}>
                                            <FileText size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-bold text-slate-800 truncate">{doc.title}</h4>
                                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                                                {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Just now'} • {doc.file_size}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                        <Download size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Portfolio Table */}
                <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
                    <PortfolioTable investments={portfolioCompanies} />
                </div>
            </div>

            <UploadDocumentModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onSuccess={handleDocUploadSuccess}
            />

            <AddInvestmentModal
                isOpen={isAddInvestmentOpen}
                onClose={() => setIsAddInvestmentOpen(false)}
                onSuccess={handleInvestmentSuccess}
            />
        </div>
    );
}

export default function PortfolioPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center text-slate-500">Loading portfolio...</div>}>
            <PortfolioContent />
        </Suspense>
    );
}
