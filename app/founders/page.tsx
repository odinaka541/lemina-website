'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/ui/BrandLogo';
import PlusGridBackdrop from '@/components/landing/PlusGridBackdrop';
import { Loader2, ArrowRight, CheckCircle2, Building, TrendingUp, DollarSign, Users } from 'lucide-react';

interface FormData {
  companyName: string;
  website: string;
  sector: string;
  description: string;
  foundedYear: string;
  hqCity: string;
  teamSize: string;
  stage: string;
  hasTraction: string;
  keyMetric: string;
  growthRate: string;
  fundingStatus: string;
  totalFunding: string;
  investors: string;
  founderName: string;
  founderRole: string;
  founderEmail: string;
  founderLinkedIn: string;
  founderTwitter: string;
}

const INITIAL_DATA: FormData = {
  companyName: '',
  website: '',
  sector: '',
  description: '',
  foundedYear: '',
  hqCity: '',
  teamSize: '',
  stage: '',
  hasTraction: '',
  keyMetric: '',
  growthRate: '',
  fundingStatus: '',
  totalFunding: '',
  investors: '',
  founderName: '',
  founderRole: '',
  founderEmail: '',
  founderLinkedIn: '',
  founderTwitter: ''
};

export default function FoundersPage() {
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/submit-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen relative flex flex-col overflow-hidden bg-[var(--color-bg-primary)]">
        <PlusGridBackdrop />
        <div className="flex-1 flex items-center justify-center relative z-10 px-6">
          <div className="glass-panel p-12 text-center max-w-lg mx-auto animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-light mb-4">Submission Received</h2>
            <p className="text-[var(--color-text-secondary)] text-lg mb-8">
              Thank you adding <strong>{formData.companyName}</strong>. Our intelligence team will verify your data within 48 hours.
            </p>
            <Link href="/" className="btn btn-primary inline-flex items-center gap-2">
              Back to Knowledge Base <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <PlusGridBackdrop />

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="inline-block mb-10 hover:opacity-80 transition-opacity">
            <BrandLogo />
          </Link>
          <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
            Add your company to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">the intelligence network</span>
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto font-light">
            Get discovered by 100+ vetted investors actively deploying capital in African markets.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Users, title: "VC Visibility", desc: "Direct exposure to active funds" },
            { icon: TrendingUp, title: "Verified Profile", desc: "Build trust with validated data" },
            { icon: DollarSign, title: "Deal Flow", desc: "Inbound interest from investors" }
          ].map((item, i) => (
            <div key={i} className="glass-panel p-6 flex flex-col items-center text-center">
              <item.icon className="w-8 h-8 text-[var(--color-accent-primary)] mb-4" />
              <h3 className="font-medium mb-1">{item.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="glass-panel p-8 md:p-12 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {errorMessage && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">

            {/* Section 1 */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--glass-border-color)]">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] flex items-center justify-center font-mono text-sm">01</div>
                <h3 className="text-xl font-light">Company Basics</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Company Name *</label>
                  <input name="companyName" value={formData.companyName} onChange={handleInputChange} required className="input-field w-full" placeholder="Acme Inc" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Website *</label>
                  <input name="website" type="url" value={formData.website} onChange={handleInputChange} required className="input-field w-full" placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Headquarters *</label>
                  <input name="hqCity" value={formData.hqCity} onChange={handleInputChange} required className="input-field w-full" placeholder="Lagos, Nigeria" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Founded Year *</label>
                  <input name="foundedYear" type="number" min="2010" max="2026" value={formData.foundedYear} onChange={handleInputChange} required className="input-field w-full" placeholder="2024" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">One-line Description *</label>
                <input name="description" value={formData.description} onChange={handleInputChange} required maxLength={120} className="input-field w-full" placeholder="e.g. B2B payments infrastructure for emerging markets" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Sector *</label>
                  <select name="sector" value={formData.sector} onChange={handleInputChange} required className="input-field w-full bg-[#0A0F1E]"> {/* Hardcode bg for select */}
                    <option value="">Select...</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Healthtech">Healthtech</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Agtech">Agtech</option>
                    <option value="Cleantech">Cleantech</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Edtech">Edtech</option>
                    <option value="Proptech">Proptech</option>
                    <option value="Mobility">Mobility</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Team Size *</label>
                  <select name="teamSize" value={formData.teamSize} onChange={handleInputChange} required className="input-field w-full bg-[#0A0F1E]">
                    <option value="">Select...</option>
                    <option value="1-5">1-5</option>
                    <option value="6-10">6-10</option>
                    <option value="11-25">11-25</option>
                    <option value="26-50">26-50</option>
                    <option value="50+">50+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--glass-border-color)]">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] flex items-center justify-center font-mono text-sm">02</div>
                <h3 className="text-xl font-light">Traction & Funding</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Current Stage *</label>
                  <select name="stage" value={formData.stage} onChange={handleInputChange} required className="input-field w-full bg-[#0A0F1E]">
                    <option value="">Select...</option>
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B+">Series B+</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Funding Status *</label>
                  <select name="fundingStatus" value={formData.fundingStatus} onChange={handleInputChange} required className="input-field w-full bg-[#0A0F1E]">
                    <option value="">Select...</option>
                    <option value="Bootstrapped">Bootstrapped</option>
                    <option value="Raised Pre-Seed">Raised Pre-Seed</option>
                    <option value="Raised Seed">Raised Seed</option>
                    <option value="Raising Now">Raising Now</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Do you have traction? *</label>
                <select name="hasTraction" value={formData.hasTraction} onChange={handleInputChange} required className="input-field w-full bg-[#0A0F1E]">
                  <option value="">Select...</option>
                  <option value="yes">Yes, generating revenue/users</option>
                  <option value="no">No, pre-product/pre-revenue</option>
                </select>
              </div>

              {formData.hasTraction === 'yes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-secondary)]">Key Metric</label>
                    <input name="keyMetric" value={formData.keyMetric} onChange={handleInputChange} className="input-field w-full" placeholder="e.g. $50k MRR" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-secondary)]">MoM Growth</label>
                    <input name="growthRate" value={formData.growthRate} onChange={handleInputChange} className="input-field w-full" placeholder="e.g. 15%" />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3 */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--glass-border-color)]">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] flex items-center justify-center font-mono text-sm">03</div>
                <h3 className="text-xl font-light">Founder Contact</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Full Name *</label>
                  <input name="founderName" value={formData.founderName} onChange={handleInputChange} required className="input-field w-full" placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Role *</label>
                  <input name="founderRole" value={formData.founderRole} onChange={handleInputChange} required className="input-field w-full" placeholder="CEO / Co-founder" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Work Email *</label>
                <input name="founderEmail" type="email" value={formData.founderEmail} onChange={handleInputChange} required className="input-field w-full" placeholder="jane@company.com" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">LinkedIn Profile *</label>
                <input name="founderLinkedIn" type="url" value={formData.founderLinkedIn} onChange={handleInputChange} required className="input-field w-full" placeholder="https://linkedin.com/in/..." />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary py-4 rounded-lg flex items-center justify-center gap-2 text-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed group transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit to Intelligence Network
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Global Style Override for Inputs (if not already in globals.css) */}
      <style jsx global>{`
        .input-field {
            background-color: var(--color-bg-secondary);
            border: 1px solid var(--glass-border-color);
            border-radius: 0.5rem; /* rounded-lg */
            padding: 0.75rem 1rem; /* py-3 px-4 */
            color: var(--color-text-primary);
            transition: all 0.2s;
        }
        .input-field:focus {
            outline: none;
            border-color: var(--color-primary);
            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }
        .input-field::placeholder {
            color: var(--color-text-secondary);
            opacity: 0.5;
        }
      `}</style>
    </div>
  );
}