'use client';

import { useState, useEffect } from 'react';
import QuickStatsBar from '@/components/network/deals/QuickStatsBar';
import DealFilters from '@/components/network/deals/DealFilters';
import DealCard from '@/components/network/deals/DealCard';
import EmptyState from '@/components/network/deals/EmptyState';
import QuickCommitModal from '@/components/network/QuickCommitModal';
import { useToast } from '@/components/providers/ToastProvider';

export default function DealFlowPage() {
    const [deals, setDeals] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'all',
        sector: '',
        stage: '',
        sort: 'urgency',
        search: ''
    });

    // Modal State
    const [selectedDeal, setSelectedDeal] = useState<any>(null);

    // Fetch Data
    useEffect(() => {
        setLoading(true);
        const queryParams = new URLSearchParams(filters).toString();
        fetch(`/api/network/deals?${queryParams}`)
            .then(res => res.json())
            .then(res => {
                setDeals(res.deals || []);
                setStats(res.stats || null);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [filters]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            status: 'all',
            sector: '',
            stage: '',
            sort: 'urgency',
            search: ''
        });
    };

    const handleCommit = (deal: any) => {
        setSelectedDeal(deal);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-8 pt-20 max-w-[1400px]">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">Network Deal Flow</h1>
                        </div>
                        <DealFilters filters={filters} onFilterChange={handleFilterChange} />
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            {stats && <QuickStatsBar stats={stats} />}

            {/* Content */}
            <div className="container mx-auto px-4 py-8 max-w-[1400px]">
                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-[300px] bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />
                        ))}
                    </div>
                ) : deals.length === 0 ? (
                    <EmptyState
                        type={filters.search || filters.status !== 'all' ? 'no_match' : 'no_deals'}
                        onClearFilters={handleClearFilters}
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {deals.map(deal => (
                            <DealCard
                                key={deal.id}
                                deal={deal}
                                onCommit={handleCommit}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Commit Modal */}
            <QuickCommitModal
                isOpen={!!selectedDeal}
                onClose={() => setSelectedDeal(null)}
                deal={selectedDeal ? {
                    id: selectedDeal.id,
                    company_name: selectedDeal.company.name,
                    min_ticket: selectedDeal.min_ticket,
                    max_ticket: selectedDeal.max_ticket || 50000,
                    amount_committed: selectedDeal.committed_amount,
                    total_allocation: selectedDeal.network_allocation
                } : null}
            />
        </div>
    );
}
