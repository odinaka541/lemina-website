'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutGrid,
    Target,
    LineChart,
    Bell,
    Settings,
    ShieldCheck,
    Users,
    Globe
} from 'lucide-react';

const navItems = [
    { name: 'Companies', href: '/dashboard', icon: LayoutGrid },
    { name: 'My Pipeline', href: '/dashboard/pipeline', icon: Target },
    { name: 'Portfolio', href: '/dashboard/portfolio', icon: LineChart },
    { name: 'Market Intel', href: '/dashboard/market', icon: Globe },
    { name: 'Alerts', href: '/dashboard/alerts', icon: Bell },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const networkItems = [
    { name: 'My Syndicate', href: '/dashboard/syndicate', icon: Users },
    { name: 'Deal Flow', href: '/dashboard/syndicate/deals', icon: Target },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 bottom-0 left-0 w-60 bg-[#030712]/80 backdrop-blur-xl border-r border-[var(--color-border)] flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img src="/assets/lemina.svg" alt="Lemina" className="w-8 h-8 rounded-lg" />
                        <span className="text-xl font-bold text-white tracking-tight font-sans">Lemina</span>
                    </Link>
                </div>



                {/* Navigation */}
                <nav className="flex-1 px-3 py-2 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-accent-primary)]'
                                    : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                                    }`}
                                onClick={() => onClose?.()}
                            >
                                <Icon size={18} />
                                {item.name}
                            </Link>
                        );
                    })}

                    <div className="mt-6 mb-2 px-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                        Network
                    </div>
                    {networkItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-accent-primary)]'
                                    : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                                    }`}
                                onClick={() => onClose?.()}
                            >
                                <Icon size={18} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Health */}
                <div className="p-4 border-t border-[var(--color-border)]">
                    <div className="bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck size={16} className="text-[var(--color-accent-primary)]" />
                            <span className="text-xs font-medium text-[var(--color-accent-primary)]">Account Health</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">92/100</span>
                            <span className="text-xs text-[var(--color-text-secondary)]">Excellent</span>
                        </div>
                        <div className="w-full h-1 bg-[rgba(255,255,255,0.1)] rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-[var(--color-accent-primary)] w-[92%]"></div>
                        </div>
                    </div>

                    <button className="w-full mt-4 text-xs text-[var(--color-text-secondary)] hover:text-white transition-colors">
                        Upgrade Plan
                    </button>
                </div>
            </aside>
        </>
    );
}
