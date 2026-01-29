'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useToast } from '@/components/providers/ToastProvider';
import PipelineColumn from '@/components/crm/PipelineColumn';
import DealModal from '@/components/crm/DealModal';
import CreateDealModal from '@/components/crm/CreateDealModal';
import { Deal } from '@/types';
import { Plus, Filter, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const INITIAL_COLUMNS = {
    'inbox': { id: 'inbox', title: 'Inbox', dealIds: [] as string[] },
    'diligence': { id: 'diligence', title: 'Due Diligence', dealIds: [] as string[] },
    'negotiation': { id: 'negotiation', title: 'Negotiation', dealIds: [] as string[] },
    'committed': { id: 'committed', title: 'Committed', dealIds: [] as string[] },
    'passed': { id: 'passed', title: 'Passed', dealIds: [] as string[] }
};

const COLUMN_ORDER = ['inbox', 'diligence', 'negotiation', 'committed', 'passed'];

function PipelineContent() {
    const [data, setData] = useState<{
        columns: typeof INITIAL_COLUMNS,
        deals: Record<string, Deal>,
        columnOrder: string[]
    }>({
        columns: JSON.parse(JSON.stringify(INITIAL_COLUMNS)),
        deals: {},
        columnOrder: COLUMN_ORDER
    });
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const { showToast } = useToast();

    useEffect(() => {
        if (searchParams.get('action') === 'new') {
            setIsCreateModalOpen(true);
        }
        fetchDeals();
    }, [searchParams]);

    const fetchDeals = async () => {
        try {
            const res = await fetch('/api/pipeline/deals');
            const json = await res.json();

            if (!json.data) throw new Error("No data");

            const normalizedDeals: Record<string, Deal> = {};
            const newColumns = JSON.parse(JSON.stringify(INITIAL_COLUMNS));

            json.data.forEach((deal: any) => {
                const uiDeal: Deal = {
                    ...deal,
                    // Map joined company data flattened for UI if needed
                    companyName: deal.company?.name || 'Unknown',
                    logo: deal.company?.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(deal.company?.name || 'C')}&background=random`,
                    industry: deal.company?.sector ? [deal.company.sector] : [],
                    website: deal.company?.website
                };

                normalizedDeals[deal.id] = uiDeal;

                const stage = deal.stage || 'inbox';
                if (newColumns[stage]) {
                    newColumns[stage].dealIds.push(deal.id);
                }
            });

            setData({
                columns: newColumns,
                deals: normalizedDeals,
                columnOrder: COLUMN_ORDER
            });
        } catch (error) {
            console.error('Error fetching deals:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateDealStage = async (dealId: string, newStage: string, index: number) => {
        try {
            const res = await fetch('/api/pipeline/update-stage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealId,
                    newStage,
                    newOrderIndex: index
                })
            });
            if (!res.ok) throw new Error('Failed to update stage');
        } catch (error) {
            console.error('Failed to update deal stage:', error);
            showToast('Failed to save changes. Please refresh.', 'error');
            // Revert changes if needed (optimistic UI implies we might need rollback, but skipping for MVC simplicity)
        }
    };

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = data.columns[source.droppableId as keyof typeof data.columns];
        const finish = data.columns[destination.droppableId as keyof typeof data.columns];

        if (start === finish) {
            const newDealIds = Array.from(start.dealIds);
            newDealIds.splice(source.index, 1);
            newDealIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                dealIds: newDealIds,
            };

            const newState = {
                ...data,
                columns: {
                    ...data.columns,
                    [newColumn.id]: newColumn,
                },
            };

            setData(newState);
            // We could also update order index on DB here if we supported reordering within column
            return;
        }

        // Moving from one list to another
        const startDealIds = Array.from(start.dealIds);
        startDealIds.splice(source.index, 1);
        const newStart = {
            ...start,
            dealIds: startDealIds,
        };

        const finishDealIds = Array.from(finish.dealIds);
        finishDealIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            dealIds: finishDealIds,
        };

        const newState = {
            ...data,
            columns: {
                ...data.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };

        setData(newState);

        // Update DB
        updateDealStage(draggableId, destination.droppableId, destination.index);
    };

    if (loading) {
        return <div className="h-[calc(100vh-64px)] flex items-center justify-center text-[var(--color-text-secondary)]">Loading pipeline...</div>;
    }

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col relative">
            {/* Header */}
            <div className="px-6 py-6 flex justify-end items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search deals..."
                        className="w-64 bg-white border border-slate-300 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 shadow-sm transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 text-sm font-medium rounded-xl shadow-sm hover:shadow-md transition-all">
                    <Filter size={16} /> Filter
                </button>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                    <Plus size={16} />
                    New Deal
                </button>
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 no-scrollbar">
                    <div className="flex gap-6 h-full min-w-max">
                        {data.columnOrder.map((columnId) => {
                            const column = data.columns[columnId as keyof typeof data.columns];
                            const deals = column.dealIds.map((dealId) => data.deals[dealId as keyof typeof data.deals]);

                            return (
                                <PipelineColumn
                                    key={column.id}
                                    column={{ ...column, deals: (deals as any[]).filter(Boolean) }}
                                    onDealClick={(deal) => setSelectedDeal(deal)}
                                />
                            );
                        })}
                    </div>
                </div>
            </DragDropContext>

            {/* Deal Detail Modal */}
            <DealModal
                deal={selectedDeal}
                isOpen={!!selectedDeal}
                onClose={() => setSelectedDeal(null)}
            />

            {/* Create Deal Modal */}
            <CreateDealModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    fetchDeals(); // Refresh list
                    // Could also show a toast here
                }}
            />
        </div>
    );
}

export default function PipelinePage() {
    return (
        <Suspense fallback={<div className="h-[calc(100vh-64px)] flex items-center justify-center text-[var(--color-text-secondary)]">Loading pipeline...</div>}>
            <PipelineContent />
        </Suspense>
    );
}
