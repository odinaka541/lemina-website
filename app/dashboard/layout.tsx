'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/dashboard/Sidebar';
import { Menu, Search, X } from 'lucide-react';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import BrandLogo from '@/components/ui/BrandLogo';

import { UserProvider, useUser } from '@/components/providers/UserProvider';

function DashboardHeaderContent() {
    const { profile } = useUser();

    return (
        <div className="flex items-center gap-6 ml-4">
            <NotificationCenter />
            <div className="h-6 w-px bg-[var(--color-border)]" />
            <Link href="/dashboard/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="text-right hidden xl:block">
                    <p className="text-sm font-medium text-white">{profile?.full_name || 'Loading...'}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{profile?.job_title || 'Wait...'}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 border border-[var(--color-border)] flex items-center justify-center text-white font-medium text-sm shadow-lg shadow-emerald-500/20">
                    {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : 'OD'}
                </div>
            </Link>
        </div>
    );
}

function DashboardLayoutContent({
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
                    <BrandLogo iconSize="w-6 h-6" textSize="text-lg" />
                </div>
                <div className="flex items-center gap-4">
                    <NotificationCenter />
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
                        <div className="flex items-center">
                            {/* Search Icon Box */}
                            <button
                                onClick={() => {
                                    if (searchQuery.trim()) {
                                        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                                    }
                                }}
                                className="h-10 w-12 flex items-center justify-center bg-white/5 border border-white/10 border-r-0 rounded-l-xl hover:bg-white/10 transition-colors group"
                            >
                                <Search className="h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                            </button>

                            {/* Input Box */}
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                                        }
                                    }}
                                    className="block w-full h-10 pl-3 pr-10 border border-white/10 border-l-white/5 rounded-r-xl leading-5 bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:bg-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 sm:text-sm transition-all shadow-sm backdrop-blur-sm"
                                    placeholder="Search companies or deals..."
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
                    </div>

                    {/* Dynamic Profile Section */}
                    <DashboardHeaderContent />
                </header>
                {children}
            </main>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </UserProvider>
    );
}
