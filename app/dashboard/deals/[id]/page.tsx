'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, DollarSign, FileText, MessageSquare, Clock, CheckCircle2, MoreHorizontal, Paperclip } from 'lucide-react';
import ConfidenceBadge, { ConfidenceTier } from '@/components/company/ConfidenceBadge';

export default function DealPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState('notes');
    const [deal, setDeal] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!params?.id) return;

        async function fetchDeal() {
            try {
                const res = await fetch(`/api/companies/${params.id}`);
                const data = await res.json();

                if (data) {
                    // Mix real company data with mock deal logic
                    setDeal({
                        id: data.id,
                        companyName: data.name,
                        logo: data.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
                        amount: '$200,000', // Mock
                        stage: 'Due Diligence', // Mock
                        probability: 60, // Mock
                        closeDate: 'Dec 15, 2025', // Mock
                        owner: 'Odinaka', // Mock
                        tier: data.verification?.overall_tier || 1,
                        score: data.verification?.data_quality_score || 50,
                        notes: [
                            { id: 1, author: 'Odinaka', text: `Evaluating ${data.name} for Series A participation.`, date: '2h ago' },
                            { id: 2, author: 'System', text: 'Deal moved to Due Diligence stage.', date: '1d ago' }
                        ],
                        documents: [
                            { id: 1, name: 'Pitch Deck.pdf', size: '2.4 MB', date: '3d ago' },
                            { id: 2, name: 'Financial Model.xlsx', size: '1.1 MB', date: '3d ago' }
                        ]
                    });
                }
            } catch (error) {
                console.error("Failed to fetch deal", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchDeal();
    }, [params?.id]);

    if (isLoading) return <div className="p-8 text-center text-[var(--color-text-secondary)]">Loading deal...</div>;
    if (!deal) return <div className="p-8 text-center text-[var(--color-text-secondary)]">Deal not found.</div>;

    const DEAL = deal;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <Link href="/dashboard/pipeline" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-4 transition-colors font-medium text-sm">
                    <ArrowLeft size={16} className="mr-2" /> Back to Pipeline
                </Link>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-sm">
                            <img src={DEAL.logo} alt={DEAL.companyName} className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{DEAL.companyName}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200">
                                    {DEAL.stage}
                                </span>
                                <Link href={`/dashboard/companies/${DEAL.id}?tab=verification`} title="View Verification Details">
                                    <ConfidenceBadge tier={DEAL.tier} score={DEAL.score} />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-semibold rounded-xl transition-all shadow-sm">
                            Edit Deal
                        </button>
                        <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all">
                            Move Stage
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Deal Info */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Deal Details</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center group cursor-help relative">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <DollarSign size={16} />
                                    <span className="text-sm font-medium border-b border-dotted border-slate-400">Your Allocation</span>
                                </div>
                                <span className="font-mono text-slate-900 font-bold">{DEAL.amount}</span>

                                <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    This is your reserved allocation in the current round.
                                </div>
                            </div>
                            {/* Probability removed as per request */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar size={16} />
                                    <span className="text-sm font-medium">Tentative Close</span>
                                </div>
                                <span className="text-slate-900 font-medium">{DEAL.closeDate}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Clock size={16} />
                                    <span className="text-sm font-medium">Created</span>
                                </div>
                                <span className="text-slate-900 font-medium">3 days ago</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Documents</h3>
                        <div className="space-y-3">
                            {DEAL.documents.map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white border border-slate-100 text-slate-400 group-hover:text-blue-500 shadow-sm">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{doc.name}</p>
                                            <p className="text-xs text-slate-400">{doc.size}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                <Paperclip size={16} /> Upload Document
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Activity & Notes */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[500px] flex flex-col overflow-hidden">
                        <div className="flex border-b border-slate-200 bg-slate-50/50">
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'notes' ? 'border-slate-900 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Notes & Activity
                            </button>
                            <button
                                onClick={() => setActiveTab('email')}
                                className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'email' ? 'border-slate-900 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Emails <span className="text-xs font-normal text-slate-400 ml-1">(History with Founder)</span>
                            </button>
                        </div>

                        <div className="p-6 flex-1 flex flex-col bg-slate-50/30">
                            <div className="flex-1 space-y-6 mb-6 overflow-y-auto max-h-[600px] pr-2">
                                {DEAL.notes.map((note: any) => (
                                    <div key={note.id} className="flex gap-4 group">
                                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm border-2 border-white ring-1 ring-slate-100">
                                            {note.author[0]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="font-bold text-slate-900 text-sm">{note.author}</span>
                                                <span className="text-xs text-slate-400 font-medium">{note.date}</span>
                                            </div>
                                            <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 shadow-sm relative group-hover:shadow-md transition-shadow">
                                                {note.text}
                                                {/* Thread reply mockup */}
                                                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1">
                                                        <MessageSquare size={12} /> Reply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto">
                                <div className="relative group">
                                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none" />
                                    <textarea
                                        placeholder="Type a note... Use @ to mention network members"
                                        className="w-full bg-white border border-slate-200 rounded-xl p-4 pr-32 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 min-h-[120px] resize-none shadow-sm transition-shadow focus:shadow-md"
                                    />
                                    {/* Rich Text Toolbar Mockup */}
                                    <div className="absolute bottom-3 left-3 flex gap-1 text-slate-400">
                                        <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-600"><b className="font-serif font-bold">B</b></button>
                                        <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-600"><i className="font-serif italic">I</i></button>
                                        <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-600 underline">U</button>
                                    </div>
                                    <div className="absolute bottom-3 right-3 flex gap-2">
                                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors" title="Attach File">
                                            <Paperclip size={18} />
                                        </button>
                                        <button className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
                                            Post Note
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
