export type ConfidenceTier = 'CAC Verified' | 'Direct Verified' | 'Third Party' | 'Estimated';

export interface VerificationData {
    overall_tier: number;
    data_quality_score: number;
    sources: string[];
    last_verified: string;
}

export interface Company {
    id: number | string; // Support both for legacy/new compat
    name: string;
    logo_url?: string;
    description?: string;
    industry?: string;
    stage?: string;
    confidence_score?: number; // 0-100
    verification_tier?: number; // 1-5
    verification_sources?: string[];
    founded_year?: number;
    website_url?: string;
    location?: string;
    employee_count?: number;

    // Financials
    total_funding?: number;
    last_valuation?: number;
    revenue_arr?: number;

    verification?: VerificationData;
}

export interface Investment {
    id: string; // UUID
    company_id: number | string;
    company?: Company;

    amount_invested: number;
    invested_date: string;
    round_type: 'Seed' | 'Series A' | 'Series B' | 'SAFE' | 'Convertible Note' | 'Other';
    valuation_at_investment?: number;
    ownership_percentage?: number;

    // Current Status
    current_value: number;
    status: 'active' | 'at_risk' | 'exited' | 'monitoring';
    ai_health_score?: number; // 0-100

    // Computed/Enriched
    moic?: number; // e.g. 1.5
    irr?: number; // e.g. 0.25 (25%)
    trend?: 'up' | 'down' | 'flat';
    last_updated?: string;
}

export interface PortfolioDocument {
    id: string;
    investment_id?: string;
    company_id?: number | string; // Fallback
    title: string;
    url: string; // Supabase public URL
    type: 'Contract' | 'Report' | 'Deck' | 'Financials' | 'Other';
    file_size?: string;
    created_at: string;
    uploaded_at?: string;

    // AI Status
    analysis_status?: 'pending' | 'processing' | 'completed' | 'failed';
    analysis_id?: string;
}

export interface PortfolioAnalysis {
    id: string;
    document_id: string;
    investment_id: string;
    created_at: string;

    // AI Extracted Data
    extracted_metrics: {
        revenue?: { value: string; unit: string; change_yoy?: string };
        burn_rate?: { value: string; unit: string; change_qoq?: string };
        runway?: { value: number; unit: string };
        team_size?: { value: number };
        customers?: { value: number };
    };

    health_score: number;
    health_status: 'healthy' | 'monitoring' | 'at_risk';

    // Textual Assessment
    ai_assessment: string;
    strengths: string[];
    concerns: string[];
    risks: string[];

    // Investment Implications
    investment_value?: {
        conservative: number;
        optimistic: number;
        current_stake: string;
    };

    recommendation: string;
    next_action: string;
    risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
    opportunities: string[];
    strategic_recommendations: string[];
    confidence_score: number;
}

export interface Deal {
    id: string; // Normalized to string/uuid for consistnecy
    company_id: number | string;
    companyName?: string; // Flattened for UI
    logo?: string;

    company?: Company;
    stage: 'inbox' | 'screening' | 'due_diligence' | 'investment_committee' | 'offer' | 'closed_won' | 'closed_lost';
    deal_lead?: string;
    probability?: number;
    amount: number;
    priority?: 'High' | 'Medium' | 'Low';

    expected_close_date?: string; // ISO
    closeDate?: string; // ISO raw

    created_at: string;
    last_contact?: string;
    notes?: string;
    ownerName?: string;
    ownerAvatar?: string;

    // Enriched
    tier?: number;
    score?: number;
    documentsCount?: number;
    is_syndicate?: boolean;
    syndicate_lead?: string;
    industry?: string[];
}

export interface MetricsState {
    totalInvested: string;
    currentValue: string;
    moic: string;
    netIrr: string;
    healthScore: number;
    activeCompanies: number;
}

export interface Task {
    id: string;
    title: string;
    type: 'call' | 'invite' | 'review' | 'email' | 'sign' | 'meeting' | 'todo';
    due_date: string;
    priority: 'urgent' | 'high' | 'medium' | 'low';
    status: 'pending' | 'completed' | 'dismissed';
    entity_id?: string;
    entity_type?: 'deal' | 'company' | 'syndicate';
    action_url?: string;
}
