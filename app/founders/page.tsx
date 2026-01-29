'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/ui/BrandLogo';

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
  raisingNow: string;
  raiseAmount: string;
  registered: string;
  license_cbn: boolean;
  license_sec: boolean;
  license_naicom: boolean;
  license_none: boolean;
  founderName: string;
  founderRole: string;
  founderEmail: string;
  founderLinkedIn: string;
  founderTwitter: string;
  featureInReports: boolean;
  shareWithInvestors: boolean;
  notifyViewers: boolean;
  quarterlyUpdates: boolean;
  newsletter: boolean;
}

export default function FoundersPage() {
  const [formData, setFormData] = useState<FormData>({
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
    raisingNow: '',
    raiseAmount: '',
    registered: '',
    license_cbn: false,
    license_sec: false,
    license_naicom: false,
    license_none: false,
    founderName: '',
    founderRole: '',
    founderEmail: '',
    founderLinkedIn: '',
    founderTwitter: '',
    featureInReports: true,
    shareWithInvestors: true,
    notifyViewers: true,
    quarterlyUpdates: true,
    newsletter: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/submit-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Submission failed');
      }

      // redirect to thank you page on success
      window.location.href = '/thank-you?company=' + encodeURIComponent(formData.companyName);
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', marginBottom: '40px' }}>
            <BrandLogo />
          </div>

          <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Add Your Company</h1>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-accent-primary)', fontWeight: 500, marginBottom: '16px' }}>
            Get discovered by investors actively deploying capital
          </h2>
          <p style={{ fontSize: '1.125rem', maxWidth: '700px', margin: '0 auto', color: 'var(--color-text-secondary)' }}>
            Featured in intelligence reports. Connected to active VCs. Free company profile in our verified database.
          </p>
        </div>

        {/* Benefits */}
        <div className="glass-panel" style={{ padding: '40px', marginBottom: '60px' }}>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '24px', color: 'var(--color-accent-primary)' }}>Why Add Your Company?</h3>
          <ul style={{ listStyle: 'none', display: 'grid', gap: '16px' }}>
            {[
              "Get discovered by VCs and angel investors actively looking for deals",
              "Featured in our intelligence reports read by 100+ investors",
              "Free company profile in our verified database",
              "Potential warm introductions to investors searching for what you're building",
              "Quarterly reminders to keep your profile fresh and discoverable"
            ].map((benefit, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <div className="glass-panel" style={{ padding: '40px' }}>
          {errorMessage && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#FCA5A5',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* SECTION 1: COMPANY BASICS */}
            <div style={{ marginBottom: '48px' }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '24px',
                color: 'var(--color-accent-primary)',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                1. Company Basics
              </h3>

              <div className="form-group">
                <label htmlFor="companyName">Company Name <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourcompany.com"
                  required
                />
                <p style={{ fontSize: '0.875rem', marginTop: '8px', color: 'var(--color-text-secondary)' }}>Include https://</p>
              </div>

              <div className="form-group">
                <label htmlFor="sector">Primary Sector <span style={{ color: '#EF4444' }}>*</span></label>
                <select
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select sector...</option>
                  <option value="payments">Payments & Processing</option>
                  <option value="lending">Lending & Credit</option>
                  <option value="neobank">Digital Banking / Neobank</option>
                  <option value="infrastructure">Financial Infrastructure / APIs</option>
                  <option value="wealthtech">Wealth Management / Investment</option>
                  <option value="insurtech">Insurance Technology</option>
                  <option value="regtech">Regulatory Technology</option>
                  <option value="other-fintech">Other Fintech</option>
                  <option value="healthtech">Healthtech</option>
                  <option value="edtech">Edtech</option>
                  <option value="agritech">Agritech</option>
                  <option value="logistics">Logistics</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="other">Other</option>
                </select>
                <p style={{ fontSize: '0.875rem', marginTop: '8px', color: 'var(--color-text-secondary)' }}>We focus on fintech but track all Nigerian tech</p>
              </div>

              <div className="form-group">
                <label htmlFor="description">One-line Description <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., B2B payment infrastructure for SMEs"
                  required
                  maxLength={120}
                />
                <p style={{ fontSize: '0.875rem', marginTop: '8px', color: 'var(--color-text-secondary)' }}>What you build, for whom - max 120 characters</p>
              </div>

              <div className="form-group">
                <label htmlFor="foundedYear">Founded Year <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="number"
                  id="foundedYear"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleInputChange}
                  placeholder="2024"
                  min="2010"
                  max="2025"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="hqCity">Headquarters <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  id="hqCity"
                  name="hqCity"
                  value={formData.hqCity}
                  onChange={handleInputChange}
                  placeholder="e.g., Lagos, Nigeria"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="teamSize">Team Size <span style={{ color: '#EF4444' }}>*</span></label>
                <select
                  id="teamSize"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select range...</option>
                  <option value="1-5">1-5 people</option>
                  <option value="6-10">6-10 people</option>
                  <option value="11-25">11-25 people</option>
                  <option value="26-50">26-50 people</option>
                  <option value="51-100">51-100 people</option>
                  <option value="100+">100+ people</option>
                </select>
              </div>
            </div>

            {/* SECTION 2: TRACTION & METRICS */}
            <div style={{ marginBottom: '48px' }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '24px',
                color: 'var(--color-accent-primary)',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                2. Traction & Metrics
              </h3>

              <div className="form-group">
                <label htmlFor="stage">Current Stage <span style={{ color: '#EF4444' }}>*</span></label>
                <select
                  id="stage"
                  name="stage"
                  value={formData.stage}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select stage...</option>
                  <option value="idea">Idea / Pre-product</option>
                  <option value="mvp">MVP / Beta</option>
                  <option value="pre-revenue">Live Product / Pre-revenue</option>
                  <option value="revenue">Generating Revenue</option>
                  <option value="scaling">Scaling / Growth</option>
                </select>
              </div>

              <div className="form-group">
                <label>Do you have traction? <span style={{ color: '#EF4444' }}>*</span></label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="hasTraction"
                      value="yes"
                      checked={formData.hasTraction === 'yes'}
                      onChange={handleInputChange}
                      required
                    />
                    Yes - we have users/revenue
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="hasTraction"
                      value="no"
                      checked={formData.hasTraction === 'no'}
                      onChange={handleInputChange}
                      required
                    />
                    No - still building
                  </label>
                </div>
              </div>

              {formData.hasTraction === 'yes' && (
                <div className="form-group">
                  <label htmlFor="keyMetric">Key Metric <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400, fontSize: '0.875rem' }}>(optional but recommended)</span></label>
                  <input
                    type="text"
                    id="keyMetric"
                    name="keyMetric"
                    value={formData.keyMetric}
                    onChange={handleInputChange}
                    placeholder="e.g., 10,000 active users OR $50k MRR OR ₦1B monthly GMV"
                  />
                  <p style={{ fontSize: '0.875rem', marginTop: '8px', color: 'var(--color-text-secondary)' }}>Your most impressive number - helps investors discover you</p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="growthRate">Growth Rate (last 3 months) <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400, fontSize: '0.875rem' }}>(optional)</span></label>
                <select
                  id="growthRate"
                  name="growthRate"
                  value={formData.growthRate}
                  onChange={handleInputChange}
                >
                  <option value="">Select range...</option>
                  <option value="negative">Negative / Flat</option>
                  <option value="0-10">0-10% monthly</option>
                  <option value="10-20">10-20% monthly</option>
                  <option value="20-50">20-50% monthly</option>
                  <option value="50+">50%+ monthly</option>
                </select>
              </div>
            </div>

            {/* SECTION 3: FUNDING */}
            <div style={{ marginBottom: '48px' }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '24px',
                color: 'var(--color-accent-primary)',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                3. Funding
              </h3>

              <div className="form-group">
                <label htmlFor="fundingStatus">Funding Status <span style={{ color: '#EF4444' }}>*</span></label>
                <select
                  id="fundingStatus"
                  name="fundingStatus"
                  value={formData.fundingStatus}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select status...</option>
                  <option value="bootstrapped">Bootstrapped / Self-funded</option>
                  <option value="friends-family">Friends & Family</option>
                  <option value="pre-seed">Pre-seed</option>
                  <option value="seed">Seed</option>
                  <option value="series-a">Series A</option>
                  <option value="series-b+">Series B+</option>
                  <option value="raising">Currently Raising</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="totalFunding">Total Funding Raised <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400, fontSize: '0.875rem' }}>(optional)</span></label>
                <select
                  id="totalFunding"
                  name="totalFunding"
                  value={formData.totalFunding}
                  onChange={handleInputChange}
                >
                  <option value="">Select range...</option>
                  <option value="0">$0 (Bootstrapped)</option>
                  <option value="1-50k">$1k - $50k</option>
                  <option value="50-250k">$50k - $250k</option>
                  <option value="250k-1m">$250k - $1M</option>
                  <option value="1-5m">$1M - $5M</option>
                  <option value="5m+">$5M+</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="investors">Key Investors <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400, fontSize: '0.875rem' }}>(optional)</span></label>
                <input
                  type="text"
                  id="investors"
                  name="investors"
                  value={formData.investors}
                  onChange={handleInputChange}
                  placeholder="e.g., TLcom Capital, Partech Africa"
                />
                <p style={{ fontSize: '0.875rem', marginTop: '8px', color: 'var(--color-text-secondary)' }}>If you've raised from notable VCs, list them</p>
              </div>
            </div>

            {/* SECTION 4: FOUNDER INFO */}
            <div style={{ marginBottom: '48px' }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '24px',
                color: 'var(--color-accent-primary)',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                4. Founder Info
              </h3>

              <div className="form-group">
                <label htmlFor="founderName">Founder Name <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  id="founderName"
                  name="founderName"
                  value={formData.founderName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="founderRole">Role <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  id="founderRole"
                  name="founderRole"
                  value={formData.founderRole}
                  onChange={handleInputChange}
                  placeholder="e.g., CEO, CTO"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="founderEmail">Work Email <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="email"
                  id="founderEmail"
                  name="founderEmail"
                  value={formData.founderEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="founderLinkedIn">LinkedIn Profile <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="url"
                  id="founderLinkedIn"
                  name="founderLinkedIn"
                  value={formData.founderLinkedIn}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/..."
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '1.125rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Company'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px' }}>
          <Link href="/" style={{ color: 'var(--color-accent-primary)', textDecoration: 'none', fontSize: '1rem' }}>
            &larr; Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}