'use client';

import { Check } from 'lucide-react';

interface PricingTierProps {
    name: string;
    price: string;
    description: string;
    features: string[];
    cta: string;
    highlighted?: boolean;
    subPrice?: string;
    badge?: string;
    smallPrint?: string;
}

function PricingCard({ name, price, description, features, cta, highlighted = false, subPrice, badge, smallPrint }: PricingTierProps) {
    return (
        <div className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 h-full ${highlighted
            ? 'bg-[var(--card-bg)] border-[var(--color-accent-primary)] shadow-[0_0_20px_rgba(16,185,129,0.1)] scale-105 z-10'
            : 'glass-panel border-[var(--glass-border-color)] hover:border-[var(--color-border-hover)]'
            }`}>
            {badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-accent-primary)] text-white text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full whitespace-nowrap">
                    {badge}
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-xl font-medium text-[var(--color-text-primary)] mb-2">{name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[var(--color-text-primary)] tracking-tight">{price}</span>
                    {price !== 'Custom' && price !== 'Free' && (
                        <span className="text-sm text-[var(--color-text-secondary)]">/ month</span>
                    )}
                </div>
                {subPrice && (
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">{subPrice}</div>
                )}
                <p className="mt-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {description}
                </p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-primary)]">
                        <Check size={16} className={`shrink-0 mt-0.5 ${highlighted ? 'text-[var(--color-accent-primary)]' : 'text-slate-400'}`} />
                        <span className="leading-snug">{feature}</span>
                    </li>
                ))}
            </ul>

            <button className={`w-full py-3 px-6 rounded-full text-sm font-semibold transition-all ${highlighted
                ? 'bg-[var(--color-accent-primary)] text-white hover:brightness-110 shadow-lg shadow-[var(--color-accent-primary)]/20'
                : 'bg-transparent border border-[var(--glass-border-color)] text-[var(--color-text-primary)] hover:bg-[var(--glass-border-color)]'
                }`}>
                {cta}
            </button>

            {smallPrint && (
                <div className="mt-4 text-xs text-center text-[var(--color-text-secondary)]">
                    {smallPrint}
                </div>
            )}
        </div>
    );
}

export default function PricingSection() {
    const tiers = [
        {
            name: "Basic",
            price: "Free",
            description: "Essential access for startup discovery and tracking.",
            features: [
                "Access to Startup Database",
                "Basic Search & Filtering",
                "View Limited Company Profiles",
                "Track up to 5 Companies"
            ],
            cta: "Get Started"
        },
        {
            name: "Solo Investor",
            price: "$89",
            description: "Full power of Lemina for the independent investor.",
            features: [
                "Everything in Basic",
                "Unlimited Company Profiles",
                "Advanced Screening & Alerts",
                "Personal Deal Pipeline",
                "Full AI Due Diligence Engine",
                "Automated Portfolio Intelligence",
                "Export Data & Reports"
            ],
            cta: "Start Free Trial",
            highlighted: true,
            badge: "MOST POPULAR",
            smallPrint: "14-day free trial. No credit card required."
        },
        {
            name: "Network",
            price: "$59",
            subPrice: "per member (minimum 10 members)",
            description: "Collaborative intelligence for Networks & VC Firms.",
            features: [
                "Everything in Solo Investor",
                "Up to 15 Members (Min 10)",
                "Deal Sharing & Collaboration",
                "Shared Pipeline & Notes",
                "Network-wide Portfolio Tracking",
                "Unified Diligence Rooms",
                "Admin & Member Roles"
            ],
            cta: "Schedule Demo"
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "Tailored solutions for large institutions and ecosystem builders.",
            features: [
                "Full API Access",
                "Custom Data Integration",
                "White-label Reports",
                "Dedicated Account Manager",
                "On-premise Deployment Options",
                "Custom Verification Workflows",
                "Priority Support & Training"
            ],
            cta: "Speak with Us"
        }
    ];

    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">Simple, transparent pricing</h2>
                    <p className="text-lg text-[var(--color-text-secondary)]">
                        Whether you're a solo angel or running a syndicate, we have a plan that fits your investment thesis.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                    {tiers.map((tier, i) => (
                        <PricingCard key={i} {...tier} />
                    ))}
                </div>
            </div>
        </section>
    );
}
