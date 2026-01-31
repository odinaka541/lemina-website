'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useToast } from '@/components/providers/ToastProvider';
import PipelineColumn from '@/components/crm/PipelineColumn';
import DealModal from '@/components/crm/DealModal';
import CreateDealModal from '@/components/crm/CreateDealModal';
import { Deal } from '@/types';
import { Plus, Filter, Search, ArrowRight, ArrowLeft, ChevronDown, MapPin, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const INITIAL_COLUMNS = {
    'inbox': { id: 'inbox', title: 'Inbox', dealIds: [] as string[] },
    'diligence': { id: 'diligence', title: 'Due Diligence', dealIds: [] as string[] },
    'negotiation': { id: 'negotiation', title: 'Negotiation', dealIds: [] as string[] },
    'committed': { id: 'committed', title: 'Committed', dealIds: [] as string[] },
    'done': { id: 'done', title: 'Done', dealIds: [] as string[] }, // Added Done column
    'passed': { id: 'passed', title: 'Passed', dealIds: [] as string[] }
};

const COLUMN_ORDER = ['inbox', 'diligence', 'negotiation', 'committed', 'done', 'passed'];

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
    const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [creatingDealStage, setCreatingDealStage] = useState<string>('inbox');
    const [prefillCompany, setPrefillCompany] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    // Enhanced Filter State
    const [openFilterDropdown, setOpenFilterDropdown] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        sector: '',
        priority: '',
        verification: '',
        value: ''
    });

    const [deleteStageId, setDeleteStageId] = useState<string | null>(null);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const searchParams = useSearchParams();
    const { showToast } = useToast();

    // Derived State for Selected Deal
    const selectedDeal = selectedDealId ? data.deals[selectedDealId] : null;

    useEffect(() => {
        if (searchParams.get('action') === 'new') {
            const companyId = searchParams.get('companyId');
            const companyName = searchParams.get('companyName');

            if (companyId || companyName) {
                setPrefillCompany({ id: companyId, name: companyName });
            }

            setCreatingDealStage('inbox');
            setIsCreateModalOpen(true);
        }
        fetchDeals();
    }, [searchParams]);

    const fetchDeals = async () => {
        try {
            const res = await fetch('/api/pipeline/deals');
            const json = await res.json();

            if (!json.data) {
                console.error("Pipeline Fetch Error:", json);
                throw new Error(json.error || "No data received from API");
            }

            const normalizedDeals: Record<string, Deal> = {};
            const newColumns = JSON.parse(JSON.stringify(INITIAL_COLUMNS));

            json.data.forEach((deal: any) => {
                const uiDeal: Deal = {
                    ...deal,
                    companyName: deal.company?.name || 'Unknown',
                    logo: deal.company?.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(deal.company?.name || 'C')}&background=random`,
                    industry: deal.company?.sector ? [deal.company.sector] : [],
                    website: deal.company?.website,
                    location: deal.company?.location || deal.company?.country,
                    ownerName: deal.owner?.name, // Add owner mapping
                    ownerAvatar: deal.owner?.avatar_url, // Add owner avatar mapping
                    lastContact: deal.last_contact,
                    lastContactType: deal.last_contact_type,
                    closeDate: deal.expected_close_date, // Keep raw ISO for modal/editing logic
                    documentsCount: deal.documents_count,
                    tier: deal.company?.verification_tier,
                    score: deal.company?.confidence_score,
                    is_syndicate: deal.is_syndicate,
                    syndicate_lead: deal.syndicate_lead,
                    nextSteps: deal.notes
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
        }
    };

    const handleAddDeal = (stageId: string) => {
        setCreatingDealStage(stageId);
        setIsCreateModalOpen(true);
    };

    const handleDeleteAllDeals = (stageId: string) => {
        setDeleteStageId(stageId);
    };

    const confirmDeleteAll = async () => {
        if (!deleteStageId) return;
        const stageId = deleteStageId;
        const column = data.columns[stageId as keyof typeof data.columns];
        const dealIds = column.dealIds;

        if (dealIds.length === 0) {
            setDeleteStageId(null);
            return;
        }

        try {
            await Promise.all(dealIds.map(id => fetch(`/api/pipeline/deals?id=${id}`, { method: 'DELETE' })));
            fetchDeals();
            showToast(`All deals in ${column.title} deleted`, 'success');
        } catch (error) {
            console.error('Error deleting deals:', error);
            showToast('Failed to delete some deals', 'error');
        } finally {
            setDeleteStageId(null);
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
            return;
        }

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
        updateDealStage(draggableId, destination.droppableId, destination.index);
    };

    // Filter Logic
    const getFilteredDeals = (dealIds: string[]) => {
        return dealIds.map(id => data.deals[id]).filter(deal => {
            if (!deal) return false;

            // Search Filter (Enhanced for People)
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchedCompany = deal.companyName.toLowerCase().includes(q);
                const matchedAmount = deal.amount.toString().includes(q);
                const matchedOwner = deal.ownerName?.toLowerCase().includes(q);
                const matchedLead = deal.syndicate_lead?.toLowerCase().includes(q);

                if (!matchedCompany && !matchedAmount && !matchedOwner && !matchedLead) return false;
            }

            // Category Filter
            if (filters.priority && deal.priority !== filters.priority) return false;
            // Sector Filter
            if (filters.sector && !deal.industry?.includes(filters.sector)) return false;

            // Verification Filter
            if (filters.verification) {
                // Parse "Tier X"
                if (filters.verification === 'Verified' && (!deal.tier || deal.tier < 1)) return false;
                const requiredTier = parseInt(filters.verification.replace('Tier ', ''));
                if (!isNaN(requiredTier) && deal.tier !== requiredTier) return false;
            }

            // Simplified Logic for Value:
            if (filters.value === 'High' && deal.amount < 100000) return false;
            if (filters.value === 'Low' && deal.amount >= 100000) return false;

            return true;
        });
    };

    // Filter Dropdown Helper
    const FilterDropdown = ({ label, options, field }: { label: string, options: string[], field: keyof typeof filters }) => (
        <div className="relative">
            <button
                onClick={() => setOpenFilterDropdown(openFilterDropdown === field ? null : field)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filters[field] ? 'text-slate-900 bg-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
            >
                <span className={filters[field] ? 'font-semibold' : ''}>{filters[field] || label}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${openFilterDropdown === field ? 'rotate-180' : ''}`} />
            </button>
            {openFilterDropdown === field && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenFilterDropdown(null)} />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                        <button
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${filters[field] === '' ? 'text-emerald-600 font-semibold bg-slate-50' : 'text-slate-600'}`}
                            onClick={() => { setFilters(prev => ({ ...prev, [field]: '' })); setOpenFilterDropdown(null); }}
                        >
                            All {label === 'Priority' ? 'Priorities' : `${label}s`}
                        </button>
                        {options.map(opt => (
                            <button
                                key={opt}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${filters[field] === opt ? 'text-emerald-600 font-semibold bg-slate-50' : 'text-slate-600'}`}
                                onClick={() => { setFilters(prev => ({ ...prev, [field]: opt })); setOpenFilterDropdown(null); }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );

    if (loading) {
        return <div className="h-[calc(100vh-64px)] flex items-center justify-center text-[var(--color-text-secondary)]">Loading pipeline...</div>;
    }

    return (
        <div className="h-screen flex flex-col relative bg-slate-50/50 overflow-hidden">
            {/* Glass Canopy Header Section - Fixed Height */}
            <div className="relative border-b border-indigo-100/50 bg-white/40 backdrop-blur-xl z-[60] shrink-0">
                {/* Abstract Background Blobs */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                </div>

                <div className="px-6 py-5 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Title & Filters */}
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Pipeline</h1>
                        </div>

                        <div className="h-8 w-px bg-slate-200/60 hidden md:block"></div>

                        {/* Enhanced Encapsulated Filters */}
                        <div className="bg-white/60 border border-slate-200/60 p-1 rounded-xl flex items-center shadow-sm backdrop-blur-md">
                            <button
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/60 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-100 transition-all active:scale-95 uppercase tracking-wide"
                                onClick={() => {
                                    setFilters({ sector: '', priority: '', verification: '', value: '' });
                                    setOpenFilterDropdown(null);
                                }}
                            >
                                <Filter size={14} className="text-slate-500" /> Filters
                            </button>
                            <div className="h-4 w-px bg-slate-200 mx-2"></div>
                            <div className="flex items-center gap-1">
                                <FilterDropdown label="Sector" field="sector" options={['Fintech', 'Healthtech', 'Logistics', 'AgriTech', 'CleanTech', 'EdTech', 'Ecommerce']} />
                                <FilterDropdown label="Priority" field="priority" options={['High', 'Medium', 'Low']} />
                                <FilterDropdown label="Tier" field="verification" options={['Verified', 'Tier 5', 'Tier 4', 'Tier 3', 'Tier 2', 'Tier 1']} />
                                <FilterDropdown label="Value" field="value" options={['High', 'Low']} />
                            </div>
                        </div>
                    </div>

                    {/* Right: Search & Action */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 flex items-center justify-center bg-white/60 border border-slate-200/60 rounded-xl text-slate-500 shadow-sm backdrop-blur-md">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search companies or deals..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-48 md:w-64 bg-white/60 border border-slate-200/60 rounded-xl px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 shadow-sm transition-all backdrop-blur-md"
                            />
                        </div>
                        <button
                            onClick={() => handleAddDeal('inbox')}
                            className="h-10 flex items-center gap-2 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wide rounded-xl shadow-lg shadow-slate-900/10 transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus size={16} />
                            New Deal
                        </button>
                    </div>
                </div>
            </div>

            {/* Kanban Board Area */}
            <div className="flex-1 overflow-hidden relative">
                {/* Premium Grid Background */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div ref={scrollContainerRef} className="h-full overflow-x-auto overflow-y-hidden p-6 no-scrollbar scroll-smooth flex items-start">
                        <div className="flex gap-6 h-full min-w-max pb-4">
                            {data.columnOrder.map((columnId) => {
                                const column = data.columns[columnId as keyof typeof data.columns];
                                const filteredDeals = getFilteredDeals(column.dealIds);

                                return (
                                    <PipelineColumn
                                        key={column.id}
                                        column={{ ...column, deals: filteredDeals }}
                                        onDealClick={(deal) => setSelectedDealId(deal.id)}
                                        onAddDeal={handleAddDeal}
                                        onDeleteAll={handleDeleteAllDeals}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </DragDropContext>

                {/* Vertical Center Scroll Controls */}
                <button
                    onClick={scrollLeft}
                    className="hidden md:flex absolute top-1/2 left-6 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 group z-40"
                    aria-label="Scroll Left"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
                <button
                    onClick={scrollRight}
                    className="hidden md:flex absolute top-1/2 right-6 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 group z-40"
                    aria-label="Scroll Right"
                >
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
            </div>

            {/* Custom Delete All Confirmation Overlay */}
            {deleteStageId && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center scale-100 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-sm ring-4 ring-red-50/50">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Clear {data.columns[deleteStageId as keyof typeof data.columns]?.title}?</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                            You are about to delete <span className="font-bold text-slate-800">{data.columns[deleteStageId as keyof typeof data.columns]?.dealIds.length} deals</span>. This action is permanent and cannot be undone.
                        </p>
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => setDeleteStageId(null)}
                                className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wide text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteAll}
                                className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wide text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95"
                            >
                                Delete All
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modals */}
            <CreateDealModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    fetchDeals();
                    setIsCreateModalOpen(false);
                }}
                defaultStage={creatingDealStage}
                defaultCompanyId={prefillCompany.id}
                defaultCompanyName={prefillCompany.name}
            />

            <DealModal
                deal={selectedDeal}
                isOpen={!!selectedDeal}
                onClose={() => setSelectedDealId(null)}
                onDealUpdate={fetchDeals}
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
