'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import QuickCommitModal from '@/components/network/QuickCommitModal';

// Sub Components
import DealHeader from '@/components/network/deal-detail/DealHeader';
import NetworkContextBanner from '@/components/network/deal-detail/NetworkContextBanner';
import DealTermsSection from '@/components/network/deal-detail/DealTermsSection';
import DocumentsSection from '@/components/network/deal-detail/DocumentsSection';
import CommitmentTracker from '@/components/network/deal-detail/CommitmentTracker';
import DiscussionSection from '@/components/network/deal-detail/DiscussionSection';
import AIAnalysisPanel from '@/components/network/deal-detail/AIAnalysisPanel';

export default function DealDetailPage({ params }: { params: { id: string } }) {
    const [deal, setDeal] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);

    useEffect(() => {
        fetch(`/api/network/deals/${params.id}`)
            .then(res => res.json())
            .then(res => {
                setDeal(res.deal);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [params.id]);

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div></div>;

    if (!deal) return <div className="p-10 text-center">Deal not found</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* 1. Navigation */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3">
                <div className="max-w-[1600px] mx-auto flex items-center gap-4">
                    <Link href="/dashboard/network/deals" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft size={16} /> Back to Deal Flow
                    </Link>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <span className="text-sm font-medium text-slate-400">Network / Deal Flow / {deal.company.name}</span>
                </div>
            </div>

            {/* 2. Header */}
            <DealHeader company={deal.company} urgency={deal.urgency} />

            {/* 3. Context Banner */}
            <NetworkContextBanner context={deal.network_context} />

            {/* 4. Main Content - Left Sidebar + Main Area */}
            <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left Column (Terms & Docs) - 3 cols */}
                <div className="lg:col-span-3 space-y-6">
                    <DealTermsSection terms={deal.terms} />
                    <DocumentsSection documents={deal.documents} />
                </div>

                {/* Main Content Area (Commitment, AI, Discussion) - 9 cols */}
                <div className="lg:col-span-9 space-y-6">

                    {/* Top Row: Commitment & AI */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <CommitmentTracker
                                commitments={deal.commitments}
                                onCommit={() => setIsCommitModalOpen(true)}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <AIAnalysisPanel analysis={deal.ai_analysis} />
                        </div>
                    </div>

                    {/* Bottom Row: Discussion (Full Width) */}
                    <DiscussionSection discussion={deal.discussion} />

                </div>

            </main>

            <QuickCommitModal
                isOpen={isCommitModalOpen}
                onClose={() => setIsCommitModalOpen(false)}
                deal={{
                    id: deal.id,
                    company_name: deal.company.name,
                    min_ticket: deal.terms.min_ticket,
                    max_ticket: deal.commitments.remaining,
                    amount_committed: deal.commitments.total_committed,
                    total_allocation: deal.network_context.allocation.amount
                }}
            />
        </div>
    );
}
