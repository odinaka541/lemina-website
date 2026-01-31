'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Share2, Plus, MoreHorizontal } from 'lucide-react';
// Removed unused imports: Briefcase, Calendar, CheckCircle2, Copy, Download, Globe, MapPin, PieChart, Send, Activity, Zap, Sparkles, FileText
// Removed unused imports: mapCompanyToDetail, createClient, Investment, PortfolioAnalysis

// Tab Components
import OverviewTab from '@/components/company/tabs/OverviewTab';
import MarketTab from '@/components/company/tabs/MarketTab';
import TeamLegalTab from '@/components/company/tabs/TeamLegalTab';
import NewsTab from '@/components/company/tabs/NewsTab';
// Removed DocumentsTab

// App Components
import CompanyHeader from '@/components/company/CompanyHeader';
import AISidePanel from '@/components/company/AISidePanel';
import PremiumToast from '@/components/ui/PremiumToast';
import PrivateNotesHistoryModal, { Note } from '@/components/company/PrivateNotesHistoryModal';


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
    const router = useRouter();
    const { id } = params;

    const [activeTab, setActiveTab] = useState('overview');

    // State for fetching real data
    const [company, setCompany] = useState<any>(null);
    const [market, setMarket] = useState<any>(null);
    const [aiAnalysis, setAiAnalysis] = useState<any>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Context Menu & Modal State
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Notes State
    const [notes, setNotes] = useState<Note[]>([]);

    // Toast State
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

    // Load Notes from LocalStorage
    useEffect(() => {
        if (!id) return;
        const savedNotes = localStorage.getItem(`lemina_notes_${id}`);
        if (savedNotes) {
            try {
                setNotes(JSON.parse(savedNotes));
            } catch (e) {
                console.error("Failed to parse notes", e);
            }
        }
    }, [id]);

    // Save Notes to LocalStorage
    useEffect(() => {
        if (!id) return;
        localStorage.setItem(`lemina_notes_${id}`, JSON.stringify(notes));
    }, [notes, id]);

    useEffect(() => {
        if (!id) return;

        async function init() {
            try {
                // Fetch rich company profile
                const res = await fetch(`/api/companies/${id}`);
                if (!res.ok) throw new Error('Company not found');
                const json = await res.json();

                setCompany(json.company);
                setMarket(json.market);
                setAiAnalysis(json.ai_analysis);

            } catch (err: any) {
                console.error("Failed to load company", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, [id]);

    const showToast = (message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    // Note Handlers
    const handleSaveNoteFromHeader = (content: string) => {
        const newNote: Note = {
            id: Date.now().toString(),
            content,
            date: new Date().toISOString(),
            author: "You",
            replies: []
        };
        setNotes(prev => [newNote, ...prev]);
        showToast("Note saved to history!");
    };

    const handleAddNoteInModal = (note: Note) => {
        setNotes(prev => [...prev, note]); // Append to end or start? Usually newest at bottom in chat, but notes might be reverse chronological. Let's do append for chat-like. 
    };

    const handleDeleteNote = (noteId: string) => {
        setNotes(prev => prev.filter(n => n.id !== noteId));
    };

    const handleReplyNote = (parentId: string, reply: Note) => {
        setNotes(prev => prev.map(note => {
            if (note.id === parentId) {
                return { ...note, replies: [...(note.replies || []), reply] };
            }
            return note;
        }));
    };

    // Actions
    const handleShareOption = (option: string) => {
        setIsShareOpen(false);
        if (option === 'link') {
            // Do nothing functional, just show message
            showToast("Link copied to clipboard!");
        } else if (option === 'network') {
            showToast("Shared to your network!");
        }
    };

    const handleAddPipeline = () => {
        const params = new URLSearchParams({
            action: 'new',
            companyId: id as string,
            companyName: company?.name || ''
        });
        router.push(`/dashboard/pipeline?${params.toString()}`);
    };

    // Rendering Helpers
    const renderTabContent = () => {
        if (!company) return null;

        switch (activeTab) {
            case 'overview': return <OverviewTab company={company} analysis={aiAnalysis} />;
            case 'market': return <MarketTab market={market} />;
            case 'team-legal': return <TeamLegalTab founders={company.founders} legal={company} />;
            case 'news': return <NewsTab news={company.news} />;
            default: return <OverviewTab company={company} analysis={aiAnalysis} />;
        }
    };

    // Determine visible tabs based on data availability
    const visibleTabs = [
        { id: 'overview', label: 'Overview', show: true },
        { id: 'market', label: 'Market', show: !!market },
        { id: 'team-legal', label: 'Team & Legal', show: (company && (company.founders?.length > 0 || company.registration_number)) },
        { id: 'news', label: 'News', show: (company && company.news?.length > 0) },
    ].filter(t => t.show);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin"></div>
                    <span className="text-sm font-medium text-slate-500">Loading profile...</span>
                </div>
            </div>
        );
    }

    if (error || !company) {
        return <div className="min-h-screen flex items-center justify-center text-rose-500">Error: {error || 'Company not found'}</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-32">
            <PremiumToast
                message={toast.message}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            {/* Top Navigation */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/dashboard/portfolio" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft size={16} /> Back to Portfolio
                    </Link>
                    <div className="flex items-center gap-2 relative">
                        {/* Share Button & Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsShareOpen(!isShareOpen)}
                                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${isShareOpen ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                            >
                                <Share2 size={16} /> Share
                            </button>
                            {isShareOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl border border-slate-100 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <button onClick={() => handleShareOption('network')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 first:rounded-t-xl transition-colors">Share to Network</button>
                                    <button onClick={() => handleShareOption('link')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 last:rounded-b-xl transition-colors">Copy Link</button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleAddPipeline}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] text-white text-xs font-bold rounded-lg hover:bg-[#1E293B] shadow-sm transition-colors"
                        >
                            <Plus size={14} /> Add to Pipeline
                        </button>
                        <button
                            onClick={() => setIsMoreOpen(!isMoreOpen)}
                            className={`p-1.5 rounded-lg transition-colors ${isMoreOpen ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                        >
                            <MoreHorizontal size={16} />
                        </button>

                        {/* More Dropdown */}
                        {isMoreOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl border border-slate-100 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <button className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 first:rounded-t-xl transition-colors">Export as PDF</button>
                                <button className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">Report Data Issue</button>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 last:rounded-b-xl transition-colors">Archive Company</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Company Header */}
            <CompanyHeader
                company={company}
                isInPipeline={false}
                onSaveNote={handleSaveNoteFromHeader}
                onHistoryOpen={() => setIsHistoryOpen(true)}
            />

            {/* Main Content Layout */}
            <div className="max-w-[1600px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left Column: Tabs & Content (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Tabs Navigation (Sticky relative to this column) */}
                    <div className="sticky top-14 z-30 bg-slate-50/95 backdrop-blur-sm pt-2 pb-4 border-b border-slate-200/60 -mx-2 px-2">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {visibleTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        px-4 py-2.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all
                                        ${activeTab === tab.id
                                            ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200'
                                            : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                                        }
                                    `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="animate-in fade-in duration-500 min-h-[500px]">
                        {renderTabContent()}
                    </div>
                </div>

                {/* Right Column: Persistent AI Side Panel (4 cols) */}
                <div className="lg:col-span-4 hidden lg:block sticky top-20 h-[calc(100vh-100px)] flex flex-col gap-4">
                    <AISidePanel
                        analysis={aiAnalysis}
                        companyName={company.name}
                        className="flex-1 min-h-0"
                    />
                </div>
            </div>

            {/* Private Notes Modal */}
            <PrivateNotesHistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                companyName={company.name}
                notes={notes}
                onAddNote={handleAddNoteInModal}
                onDeleteNote={handleDeleteNote}
                onReplyNote={handleReplyNote}
            />
        </div>
    );
}
