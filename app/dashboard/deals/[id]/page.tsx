'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, FileText, MessageSquare, Clock, CheckCircle2, MoreHorizontal, Paperclip } from 'lucide-react';
import ConfidenceBadge, { ConfidenceTier } from '@/components/company/ConfidenceBadge';

export default function DealPage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState('notes');
    const [deal, setDeal] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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
    }, [params.id]);

    if (isLoading) return <div className="p-8 text-center text-[var(--color-text-secondary)]">Loading deal...</div>;
    if (!deal) return <div className="p-8 text-center text-[var(--color-text-secondary)]">Deal not found.</div>;

    const DEAL = deal; // Re-use existing variable name to minimize refactor

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-6">
                <Link href="/dashboard/pipeline" className="inline-flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-4 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Pipeline
                </Link>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[var(--color-bg-secondary)] p-2 flex items-center justify-center shadow-lg">
                            <img src={DEAL.logo} alt={DEAL.companyName} className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{DEAL.companyName}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-bg-secondary)] text-xs font-medium text-[var(--color-text-primary)] border border-[var(--color-border)]">
                                    {DEAL.stage}
                                </span>
                                <ConfidenceBadge tier={DEAL.tier} score={DEAL.score} />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="btn btn-secondary">Edit Deal</button>
                        <button className="btn btn-primary">Move Stage</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Deal Info */}
                <div className="space-y-6">
                    <div className="glass-panel p-5">
                        <h3 className="font-bold text-[var(--color-text-primary)] mb-4">Deal Details</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                    <DollarSign size={16} />
                                    <span className="text-sm">Amount</span>
                                </div>
                                <span className="font-mono text-[var(--color-text-primary)] font-medium">{DEAL.amount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                    <CheckCircle2 size={16} />
                                    <span className="text-sm">Probability</span>
                                </div>
                                <span className="text-[var(--color-text-primary)] font-medium">{DEAL.probability}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                    <Calendar size={16} />
                                    <span className="text-sm">Expected Close</span>
                                </div>
                                <span className="text-[var(--color-text-primary)] font-medium">{DEAL.closeDate}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                    <Clock size={16} />
                                    <span className="text-sm">Created</span>
                                </div>
                                <span className="text-[var(--color-text-primary)] font-medium">3 days ago</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-5">
                        <h3 className="font-bold text-[var(--color-text-primary)] mb-4">Documents</h3>
                        <div className="space-y-3">
                            {DEAL.documents.map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)] transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors">{doc.name}</p>
                                            <p className="text-xs text-[var(--color-text-secondary)]">{doc.size}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-2 border border-dashed border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent-primary)] transition-colors flex items-center justify-center gap-2">
                                <Paperclip size={14} /> Upload Document
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Activity & Notes */}
                <div className="lg:col-span-2">
                    <div className="glass-panel min-h-[500px] flex flex-col">
                        <div className="flex border-b border-[var(--color-border)]">
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'notes' ? 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                            >
                                Notes & Activity
                            </button>
                            <button
                                onClick={() => setActiveTab('email')}
                                className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'email' ? 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                            >
                                Emails
                            </button>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex-1 space-y-6 mb-6">
                                {DEAL.notes.map((note: any) => (
                                    <div key={note.id} className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                            {note.author[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="font-bold text-[var(--color-text-primary)] text-sm">{note.author}</span>
                                                <span className="text-xs text-[var(--color-text-secondary)]">{note.date}</span>
                                            </div>
                                            <div className="p-3 rounded-lg bg-[var(--input-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]">
                                                {note.text}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto">
                                <div className="relative">
                                    <textarea
                                        placeholder="Type a note..."
                                        className="w-full bg-[var(--input-bg)] border border-[var(--color-border)] rounded-xl p-4 text-[var(--color-text-primary)] focus:border-[var(--color-accent-primary)] outline-none min-h-[100px] resize-none"
                                    />
                                    <div className="absolute bottom-3 right-3 flex gap-2">
                                        <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors">
                                            <Paperclip size={18} />
                                        </button>
                                        <button className="bg-[var(--color-accent-primary)] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
                                            Post
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
