'use client';

import { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import PipelineColumn from '@/components/crm/PipelineColumn';
import DealModal from '@/components/crm/DealModal';
import { Deal } from '@/types';
import { ConfidenceTier } from '@/components/company/ConfidenceBadge';
import { Plus, Filter, Search } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

// Initial structure for columns
const INITIAL_COLUMNS = {
    'inbox': { id: 'inbox', title: 'Inbox', dealIds: [] as string[] },
    'diligence': { id: 'diligence', title: 'Due Diligence', dealIds: [] as string[] },
    'negotiation': { id: 'negotiation', title: 'Negotiation', dealIds: [] as string[] },
    'committed': { id: 'committed', title: 'Committed', dealIds: [] as string[] },
    'passed': { id: 'passed', title: 'Passed', dealIds: [] as string[] }
};

const COLUMN_ORDER = ['inbox', 'diligence', 'negotiation', 'committed', 'passed'];

export default function PipelinePage() {
    const [data, setData] = useState<{
        columns: typeof INITIAL_COLUMNS,
        deals: Record<string, Deal>,
        columnOrder: string[]
    }>({
        columns: INITIAL_COLUMNS,
        deals: {},
        columnOrder: COLUMN_ORDER
    });
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            // Fallback: Fetch companies from API if deals table not ready
            const res = await fetch('/api/companies?limit=20');
            const json = await res.json();

            if (!json.data) throw new Error("No data");

            const normalizedDeals: Record<string, Deal> = {};
            const newColumns = JSON.parse(JSON.stringify(INITIAL_COLUMNS)); // Deep copy

            json.data.forEach((company: any, index: number) => {
                // Mock Deal Wrapper
                const dealId = company.id.toString();
                const uiDeal: Deal = {
                    id: dealId,
                    user_id: 'mock-user-id', // Required by type
                    company_id: company.id.toString(), // Required by type
                    companyName: company.name,
                    logo: company.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random`,
                    website: company.website || undefined,
                    ownerName: 'Odinaka',
                    priority: (index % 3 === 0 ? 'High' : 'Medium') as 'High' | 'Medium',
                    lastContact: 'Recently',
                    industry: company.sector ? [company.sector.primary] : ['Tech'],
                    amount: [50000, 150000, 1000000, 500000][index % 4], // Numeric now
                    stage: COLUMN_ORDER[index % 5] as 'inbox' | 'diligence' | 'negotiation' | 'committed' | 'passed',
                    probability: [20, 40, 60, 80, 5][index % 5],
                    closeDate: '2025-12-01',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                normalizedDeals[dealId] = uiDeal;

                // Add to assigned column
                const stage = uiDeal.stage || 'inbox';
                if (newColumns[stage]) {
                    newColumns[stage].dealIds.push(dealId);
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

    const updateDealStage = async (dealId: string, newStage: string) => {
        // Mock update - in real app would call API/Supabase
        console.log(`Moved deal ${dealId} to ${newStage}`);
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
        updateDealStage(draggableId, destination.droppableId);
    };

    if (loading) {
        return <div className="h-[calc(100vh-64px)] flex items-center justify-center text-[var(--color-text-secondary)]">Loading pipeline...</div>;
    }

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col relative">
            {/* Header */}
            <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-bg-primary)]">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Deal Pipeline</h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">Manage your deal flow and track progress.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search deals..."
                            className="bg-[var(--input-bg)] border border-[var(--color-border)] rounded-lg py-2 pl-9 pr-4 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent-primary)] outline-none"
                        />
                    </div>
                    <button className="btn btn-secondary gap-2 py-2 text-sm">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="btn btn-primary gap-2 py-2 text-sm">
                        <Plus size={16} /> New Deal
                    </button>
                </div>
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
                                    column={{ ...column, deals: deals as any }}
                                    onDealClick={(deal) => setSelectedDeal(deal)}
                                />
                            );
                        })}
                    </div>
                </div>
            </DragDropContext>

            {/* Deal Detail Modal (The "Pop up") */}
            <DealModal
                deal={selectedDeal}
                isOpen={!!selectedDeal}
                onClose={() => setSelectedDeal(null)}
            />
        </div>
    );
}
