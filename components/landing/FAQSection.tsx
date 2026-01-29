'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import PlusGridBackdrop from '@/components/landing/PlusGridBackdrop';

const faqs = [
    {
        question: "How does Lemina verify startup data?",
        answer: "We employ a rigorous multi-step verification process involving direct data integration, regulatory checks with local authorities (CAC, etc.), and manual validation by our investment analysts."
    },
    {
        question: "What stages of companies do you cover?",
        answer: "We focus primarily on Pre-Seed to Series A African startups, with a specific emphasis on high-growth technology ventures in Nigeria, Kenya, and South Africa."
    },
    {
        question: "Can I invest directly through the platform?",
        answer: "Yes. Accredited investors can participate in deal syndicates or make direct investments into open rounds through our secure deal/portfolio management infrastructure."
    },
    {
        question: "Is there a free trial for investors?",
        answer: "We offer a sample intelligence report to demonstrate the depth of our data. Full platform access is reserved for verified investors and partners."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative py-24 border-t border-[var(--color-border)] overflow-hidden">
            {/* Background: Faint Pluses */}
            <PlusGridBackdrop baseOpacity={0.15} className="z-0" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                {/* Left: Header */}
                <div className="lg:col-span-4">
                    <p className="text-[var(--color-accent-primary)] font-semibold mb-2 tracking-wide text-sm uppercase">FAQ</p>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[var(--color-text-primary)]">
                        Frequently asked <br className="hidden lg:block" />
                        questions
                    </h2>
                </div>

                {/* Right: Accordion */}
                <div className="lg:col-span-8 flex flex-col">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-[var(--color-border)] group">
                            <button
                                onClick={() => setOpenIndex(prev => prev === index ? null : index)}
                                className="w-full py-8 flex justify-between items-start text-left focus:outline-none"
                            >
                                <span className="text-xl md:text-2xl font-light pr-8 group-hover:text-[var(--color-accent-primary)] transition-colors">
                                    {faq.question}
                                </span>
                                <span className="shrink-0 pt-1 text-[var(--color-text-secondary)]">
                                    {openIndex === index ? <X size={24} /> : <Plus size={24} />}
                                </span>
                            </button>

                            <div className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100 pb-8' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                    <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed max-w-2xl">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
