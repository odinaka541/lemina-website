'use client';

import Link from 'next/link';
import BrandLogo from '@/components/ui/BrandLogo';
import { Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-[var(--glass-border-color)] bg-[var(--nav-bg)]/50 backdrop-blur-xl mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-4">
                        <div className="mb-6">
                            <BrandLogo />
                        </div>
                        <p className="text-[var(--color-text-primary)] font-medium mb-1">
                            Powering African Investments
                        </p>
                        <a href="mailto:admin@lemina.co" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors block mb-6">
                            admin@lemina.co
                        </a>

                        <div className="space-y-4">
                            <p className="text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider">Language</p>
                            <div className="flex gap-4 text-sm text-[var(--color-text-secondary)]">
                                <span className="text-[var(--color-text-primary)] font-medium">English (UK)</span>
                                <span className="opacity-50">Português</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="font-semibold text-[var(--color-text-primary)] mb-6">Company</h4>
                            <ul className="space-y-4 text-sm">
                                <li>
                                    <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link href="mailto:odinaka@lemina.co" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                        Log In
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-[var(--color-text-primary)] mb-6">Platform</h4>
                            <ul className="space-y-4 text-sm">
                                <li>
                                    <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                        Intelligence
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                        Deal Flow
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                        Networks
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                        Documentation
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-[var(--color-text-primary)] mb-6">Resources</h4>
                            <ul className="space-y-4 text-sm">
                                <li>
                                    <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                        Sample Report
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                        Case Studies
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="md:col-span-3">
                        <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">Stay informed</h4>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                            Monthly insights on African tech and private markets
                        </p>
                        <div className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full bg-white/5 border border-[var(--glass-border-color)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            />
                            <button className="w-full bg-[var(--color-primary)] text-white font-medium py-2 rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors text-sm">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[var(--glass-border-color)]">
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4 md:mb-0">
                        © 2026 Lemina Inc.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
                        <Link href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Terms of Use</Link>
                        <div className="flex gap-4 ml-4">
                            <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors"><Twitter size={18} /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
