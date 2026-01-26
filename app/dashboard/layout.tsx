'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/dashboard/Sidebar';
import { Menu, Search, X } from 'lucide-react';
import NotificationCenter from '@/components/notifications/NotificationCenter'; // Added import

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'light');
    }, []);

    return (
        <div className="min-h-screen text-[var(--color-text-primary)] font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-30 bg-[#030712]/80 backdrop-blur-md border-b border-[var(--color-border)] px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 hover:bg-[rgba(255,255,255,0.05)] rounded-lg text-[var(--color-text-secondary)] hover:text-white transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-lg tracking-tight text-white">Lemina</span>
                </div>
                <div className="flex items-center gap-4"> {/* Added wrapper div for actions */}
                    <NotificationCenter /> {/* Added NotificationCenter */}
                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center text-sm font-bold text-white">
                        L
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="lg:pl-60 min-h-screen flex flex-col">
                {/* Desktop Header */}
                <header className="hidden lg:flex h-16 border-b border-[var(--color-border)] items-center justify-between px-8 sticky top-0 bg-[#030712]/80 backdrop-blur-md z-40">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-accent-primary)] transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-11 pr-10 py-2 border border-[var(--color-border)] rounded-lg leading-5 bg-[rgba(255,255,255,0.03)] text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-[rgba(255,255,255,0.05)] focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] sm:text-sm transition-all"
                                placeholder="Search companies, deals, or people..."
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-6 ml-4">
                        <NotificationCenter />
                        <div className="h-6 w-px bg-[var(--color-border)]" />
                        <Link href="/dashboard/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="text-right hidden xl:block">
                                <p className="text-sm font-medium text-white">Odinaka</p>
                                <p className="text-xs text-[var(--color-text-secondary)]">Investor</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 border border-[var(--color-border)] flex items-center justify-center text-white font-medium text-sm shadow-lg shadow-emerald-500/20">
                                OD
                            </div>
                        </Link>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
}
