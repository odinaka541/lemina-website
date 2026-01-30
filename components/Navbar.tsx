'use client';

import Link from 'next/link';
import { Home, Bell } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center h-16 sticky top-4 z-50 backdrop-blur-xl border border-[var(--glass-border-color)] px-6 mx-4 rounded-2xl bg-[var(--nav-bg)] shadow-lg relative my-4 max-w-7xl lg:mx-auto">
            <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    {/* Brand Logo - Simplified for internal apps */}
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">L</div>
                    <div className="font-semibold text-xl tracking-tight text-[var(--color-text-primary)]">Lemina</div>
                </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--glass-border-color)] rounded-full transition-all">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--glass-border-color)] px-4 py-2 rounded-full transition-all border border-transparent hover:border-[var(--glass-border-color)]">
                    <Home size={16} />
                    <span>Home</span>
                </Link>
            </div>
        </nav>
    );
}
