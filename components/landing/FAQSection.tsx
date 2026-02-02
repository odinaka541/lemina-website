'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "How does Lemina verify startup data?",
        answer: "We employ a rigorous multi-step verification process: direct integration with regulatory sources (Corporate Affairs Commission, Central Bank filings, securities registries), cross-referencing multiple data providers, and manual validation by Lemina. Every data point is timestamped, sourced, and traceable."
    },
    {
        question: "What stages of companies do you cover?",
        answer: "We track companies from pre-seed through Series B+ across African tech ecosystems. Coverage spans multiple sectors (fintech, logistics, health tech, agri-tech, SaaS) and geographies—focusing on markets where our clients are actively deploying capital."
    },
    {
        question: "Can I invest directly through the platform?",
        answer: "No. Lemina is an intelligence and workflow platform, not a transaction facilitator. You invest directly with companies through your standard process. We don't take carry or facilitate deals—this keeps our analysis completely unbiased."
    },
    {
        question: "Is there a free trial for investors?",
        answer: "Yes. Our Solo Investor plan includes a 14-day free trial with full access to all features. No credit card required. For Network plans, we offer personalized demos to walk through the collaboration features and answer your team's specific questions."
    },
    {
        question: "How often is data updated?",
        answer: "Company profiles update continuously as new information becomes available—funding rounds, regulatory filings, news mentions, and operational changes are tracked in real-time. Regulatory data (CAC, CBN) refreshes monthly. You can also flag specific companies for priority monitoring."
    },
    {
        question: "Can I export data or reports?",
        answer: "Yes. Solo and Network plans include full export capabilities—download company data as CSV/Excel and save AI-generated investment memos as PDF. Enterprise plans add API access for custom integrations with your existing tools and workflows."
    },
    {
        question: "What if I'm not satisfied?",
        answer: "We offer a 30-day money-back guarantee on annual subscriptions. If Lemina doesn't deliver measurable value in your first month—whether that's time saved on research, better deal quality, or improved network coordination—we'll refund you in full. No questions asked."
    }
];

function FAQItem({ item, isOpen, onClick, index }: { item: FAQItem; isOpen: boolean; onClick: () => void; index: number }) {
    return (
        <div className="border-b border-[var(--glass-border-color)] last:border-0">
            <button
                className={`flex items-center justify-between w-full text-left focus:outline-none group ${index === 0 ? 'pb-6 pt-0' : 'py-6'}`}
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span className={`text-lg transition-colors ${isOpen ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]'}`}>
                    {item.question}
                </span>
                <span className={`ml-6 p-1 rounded-full border transition-all duration-300 ${isOpen
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)] rotate-180 bg-[var(--color-primary)]/10'
                    : 'border-[var(--glass-border-color)] text-[var(--color-text-secondary)] group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)]'
                    }`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                    {item.answer}
                </p>
            </div>
        </div>
    );
}

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 relative overflow-hidden" aria-labelledby="faq-headline">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    {/* Left Column: Heading */}
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-32">
                            <span className="text-[var(--color-accent-primary)] font-semibold tracking-wider uppercase text-xs mb-4 block">FAQ</span>
                            <h2 id="faq-headline" className="text-4xl md:text-5xl font-light mb-6 text-[var(--color-text-primary)] leading-[1.1]">
                                Frequently<br />Asked<br />Questions
                            </h2>
                        </div>
                    </div>

                    {/* Right Column: List */}
                    <div className="lg:col-span-7">
                        <div className="divide-y divide-[var(--glass-border-color)]">
                            {faqs.map((faq, index) => (
                                <FAQItem
                                    key={index}
                                    index={index}
                                    item={faq}
                                    isOpen={openIndex === index}
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
