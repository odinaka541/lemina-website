'use client';

import { useState, useEffect, Suspense } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, ArrowUpRight, FileText, Download, Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AllocationChart from '@/components/portfolio/AllocationChart';
import UploadDocumentModal from '@/components/portfolio/UploadDocumentModal';
import AddInvestmentModal from '@/components/portfolio/AddInvestmentModal';
import EmptyPortfolioState from '@/components/portfolio/EmptyPortfolioState';
import PortfolioTable from '@/components/portfolio/PortfolioTable';
import { PortfolioDocument } from '@/lib/types';

function PortfolioContent() {
    const [stats, setStats] = useState({
        totalInvested: '$0',
        currentValue: '$0',
        moic: '0.00x',
        irr: '0%'
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Portfolio Performance</h1>
                    <p className="text-[var(--color-text-secondary)]">Track your investments and returns.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsAddInvestmentOpen(true)}
                        className="btn btn-secondary flex items-center gap-2"
                    >
                        <Plus size={16} /> New Investment
                    </button>
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
                    >
                        <Plus size={16} /> Upload Report
                    </button>
                </div>
            </div>

            {/* Conditional Rendering: Empty State vs Content */}
            {portfolioCompanies.length === 0 && !isLoading ? (
                <EmptyPortfolioState
                    onAddInvestment={() => setIsAddInvestmentOpen(true)}
                    onImportPipeline={() => console.log('Import pipeline clicked')}
                />
            ) : (
                <>
                    {/* Aggregate Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="glass-panel p-5">
                            <p className="text-sm text-[var(--color-text-secondary)] mb-1">Total Invested</p>
                            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.totalInvested}</h3>
                            {stats.totalInvested === '$0' && (
                                <p className="text-xs text-slate-400 mt-1">Add investments to start tracking</p>
                            )}
                        </div>
                        <div className="glass-panel p-5">
                            <p className="text-sm text-[var(--color-text-secondary)] mb-1">Current Value</p>
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
                                    {stats.currentValue === '$0' ? 'N/A' : stats.currentValue}
                                </h3>
                                {stats.currentValue !== '$0' ? (
                                    <span className="text-xs text-emerald-500 font-medium flex items-center mt-1">
                                        <TrendingUp size={12} className="mr-1" /> +12.4% last quarter
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-400 mt-1">No active valuations</span>
                                )}
                            </div>
                        </div>
                        <div className="glass-panel p-5">
                            <p className="text-sm text-[var(--color-text-secondary)] mb-1 flex items-center gap-1" title="Current value ÷ Total invested">
                                MOIC <span className="text-slate-300 cursor-help">ℹ</span>
                            </p>
                            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
                                {stats.moic === '0.00x' ? '--' : stats.moic}
                            </h3>
                        </div>
                        <div className="glass-panel p-5">
                            <p className="text-sm text-[var(--color-text-secondary)] mb-1">Active Companies</p>
                            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
                                {portfolioCompanies.filter(c => c.status !== 'exited').length}
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Charts (2/3 width) - Only show if data exists */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-panel p-6">
                                <h3 className="font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                                    <PieChartIcon size={20} className="text-[var(--color-accent-primary)]" />
                                    Sector Allocation
                                </h3>
                                {sectors.length > 0 ? (
                                    <AllocationChart data={sectors} />
                                ) : (
                                    <div className="h-48 flex items-center justify-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                        Add investments to see breakdown
                                    </div>
                                )}
                            </div>
                            <div className="glass-panel p-6">
                                <h3 className="font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                                    <PieChartIcon size={20} className="text-blue-500" />
                                    Stage Allocation
                                </h3>
                                {stages.length > 0 ? (
                                    <AllocationChart data={stages} />
                                ) : (
                                    <div className="h-48 flex items-center justify-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                        Track investments by stage
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Documents List (1/3 width) */}
                        <div className="glass-panel flex flex-col h-[320px]">
                            {/* ... Existing Docs Code ... */}
                            <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                                <h3 className="font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                                    <FileText size={18} className="text-emerald-500" />
                                    Portfolio Documents
                                </h3>
                                <span className="text-xs text-[var(--color-text-secondary)] bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded-full">
                                    {documents.length} Files
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {documents.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-secondary)] opacity-50">
                                        <FileText size={40} className="mb-2" />
                                        <p className="text-sm">No documents yet.</p>
                                    </div>
                                ) : documents.map((doc) => (
                                    <div key={doc.id} className="p-3 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors group flex items-center justify-between">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${doc.type === 'Report' ? 'bg-blue-500/10 text-blue-500' :
                                                doc.type === 'Contract' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-gray-500/10 text-gray-500'
                                                }`}>
                                                <FileText size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-medium text-[var(--color-text-primary)] truncate">{doc.title}</h4>
                                                <p className="text-[10px] text-[var(--color-text-secondary)]">
                                                    {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Just now'} • {doc.file_size}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-[var(--color-text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                            <Download size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Portfolio Table */}
                    <PortfolioTable investments={portfolioCompanies} />
                </>
            )}

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
