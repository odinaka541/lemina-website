'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import BrandLogo from '@/components/ui/BrandLogo';
import { Loader2, ArrowRight } from 'lucide-react';
import PlusGridBackdrop from '@/components/landing/PlusGridBackdrop';

export default function OnboardingPage() {
    const [fullName, setFullName] = useState('');
    const [investorType, setInvestorType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('No user found');

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: fullName,
                    investor_type: investorType,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            router.push('/dashboard');
        } catch (error) {
            console.error('Error updating profile:', error);
            // Handle error visually
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col overflow-hidden bg-[var(--color-bg-primary)]">
            <PlusGridBackdrop />

            <nav className="relative z-10 w-full p-6">
                <BrandLogo />
            </nav>

            <div className="flex-1 flex items-center justify-center relative z-10 px-6">
                <div className="w-full max-w-md">
                    <div className="glass-panel p-8 md:p-10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl md:text-3xl font-light mb-2">Welcome to Lemina</h1>
                            <p className="text-[var(--color-text-secondary)]">Let's set up your investor profile</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="e.g. Sarah Chen"
                                    className="w-full bg-[var(--color-bg-secondary)] border border-[var(--glass-border-color)] rounded-lg py-3 px-4 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                                    Investor Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Angel Investor', 'VC Fund', 'Syndicate Lead', 'Family Office'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setInvestorType(type)}
                                            className={`p-3 rounded-lg border text-sm text-left transition-all ${investorType === type
                                                    ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]'
                                                    : 'bg-[var(--color-bg-secondary)] border-[var(--glass-border-color)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)]'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !fullName || !investorType}
                                className="w-full btn btn-primary py-3 rounded-lg flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Complete Setup
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
