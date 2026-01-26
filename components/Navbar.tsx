'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="flex justify-between items-center h-16 sticky top-4 z-50 backdrop-blur-xl border border-[var(--glass-border-color)] px-6 mx-4 rounded-2xl bg-[var(--nav-bg)] shadow-lg relative my-4 max-w-7xl lg:mx-auto">
            <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    {/* Placeholder Logo if asset missing, typically /assets/lemina.svg */}
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">L</div>
                    <div className="font-semibold text-xl tracking-tight text-[var(--color-text-primary)] hidden md:block">Lemina</div>
                </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                <Link href="/search" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                    Search
                </Link>
                <Link href="/dashboard" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                    Dashboard
                </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
                <button
                    onClick={() => {
                        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                        document.documentElement.setAttribute('data-theme', newTheme);
                    }}
                    className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                    {/* Theme Icons */}
                    <span className="text-xs">Theme</span>
                </button>
                <Link href="/dashboard" className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors">
                    Log In
                </Link>
                <Link href="/dashboard" className="text-xs font-medium py-2 px-4 bg-[var(--glass-bg)] hover:bg-[var(--glass-border-color)] border border-[var(--glass-border-color)] backdrop-blur-md text-[var(--color-text-primary)] rounded-full transition-all shadow-sm">
                    Launch App
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden text-[var(--color-text-primary)] p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-[var(--color-bg-secondary)] border border-[var(--glass-border-color)] rounded-2xl shadow-xl flex flex-col gap-4 md:hidden animate-in fade-in slide-in-from-top-2">
                    <Link href="/search" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-2" onClick={() => setIsMobileMenuOpen(false)}>
                        Search
                    </Link>
                    <Link href="/dashboard" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-2" onClick={() => setIsMobileMenuOpen(false)}>
                        Dashboard
                    </Link>
                    <div className="h-px bg-[var(--glass-border-color)] my-1" />
                    <Link href="/dashboard" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-2" onClick={() => setIsMobileMenuOpen(false)}>
                        Log In
                    </Link>
                </div>
            )}
        </nav>
    );
}
