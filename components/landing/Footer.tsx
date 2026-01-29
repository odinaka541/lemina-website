'use client';

import React from 'react';
import BrandLogo from '@/components/ui/BrandLogo';
import { Twitter, Mail, Sun, Moon } from 'lucide-react';

export default function Footer() {
    const toggleTheme = () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <footer className="py-20 border-t border-[var(--color-border)] bg-[var(--card-bg)]/50 backdrop-blur-md text-[var(--color-text-primary)] relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
                    {/* Left Side: Navigation Columns (Span 7) */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="font-semibold mb-6">Company</h4>
                            <ul className="space-y-4 text-[var(--color-text-secondary)] text-sm">
                                <li><a href="#" className="hover:text-[var(--color-accent-primary)] transition-colors">About</a></li>
                                <li><a href="mailto:odinaka@lemina.co" className="hover:text-[var(--color-accent-primary)] transition-colors">Contact</a></li>
                                <li><a href="mailto:admin@lemina.co" className="hover:text-[var(--color-accent-primary)] transition-colors">Log In</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-6">Platform</h4>
                            <ul className="space-y-4 text-[var(--color-text-secondary)] text-sm">
                                <li><a href="#" className="hover:text-[var(--color-accent-primary)] transition-colors">Intelligence</a></li>
                                <li><a href="#" className="hover:text-[var(--color-accent-primary)] transition-colors">Dealroom</a></li>
                                <li><a href="#" className="hover:text-[var(--color-accent-primary)] transition-colors">Networks</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-6">Resources</h4>
                            <ul className="space-y-4 text-[var(--color-text-secondary)] text-sm">
                                <li><a href="#" className="hover:text-[var(--color-accent-primary)] transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-[var(--color-accent-primary)] transition-colors">Sample Report</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Side: Large Brand (Span 5) */}
                    <div className="lg:col-span-5 lg:text-right flex flex-col items-start lg:items-end">
                        {/* Huge Brand Text with Logo */}
                        <div className="mb-6 scale-125 origin-top-left lg:origin-top-right">
                            <BrandLogo textSize="text-6xl" iconSize="w-12 h-12" />
                        </div>

                        <div className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-xs text-left lg:text-right mb-8">
                            Powering African Investments.<br />
                            <br />
                            <a href="mailto:admin@lemina.co" className="hover:text-[var(--color-text-primary)]">admin@lemina.co</a>
                        </div>

                        <div className="flex flex-col items-start lg:items-end gap-3">
                            <div className="flex items-center gap-2 text-[var(--color-text-primary)] text-sm border border-[var(--color-border)] rounded-full px-3 py-1 bg-[var(--card-bg)]">
                                <span>English (UK)</span>
                            </div>
                            <button className="flex items-center gap-2 text-[var(--color-text-secondary)] text-sm border border-transparent hover:border-[var(--color-border)] rounded-full px-3 py-1 transition-all opacity-60 hover:opacity-100">
                                <span>Português</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                    <p>© 2025 Lemina Inc.</p>
                    <div className="flex gap-6 items-center">
                        <button onClick={toggleTheme} className="hover:text-[var(--color-text-primary)] transition-colors" aria-label="Toggle Theme">
                            <Sun className="h-4 w-4 hidden [html[data-theme='light']_&]:block" />
                            <Moon className="h-4 w-4 block [html[data-theme='light']_&]:hidden" />
                        </button>
                        <a href="https://x.com/uselemina" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text-primary)] transition-colors" aria-label="Twitter">
                            <Twitter className="h-4 w-4" />
                        </a>
                        <a href="#" className="hover:text-[var(--color-text-primary)]">Privacy Policy</a>
                        <a href="#" className="hover:text-[var(--color-text-primary)]">Terms of Use</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
