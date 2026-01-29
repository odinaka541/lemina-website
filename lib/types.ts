export type ConfidenceTier = 'CAC Verified' | 'Direct Verified' | 'Third Party' | 'Estimated';

export interface VerificationData {
    overall_tier: number;
    data_quality_score: number;
    sources: string[];
    last_verified: string;
}

export interface Company {
    id: number;
    name: string;
    logo_url?: string;
    description?: string;
    industry?: string;
    stage?: string;
    founded_year?: number;
    website_url?: string;
    location?: string;
    employee_count?: number;

    // Financials (Optional - access control applied usually)
    total_funding?: number;
    last_valuation?: number;
    revenue_arr?: number;

    verification?: VerificationData;
}

export interface Investment {
    id: string; // Portfolio Investment UUID
    company_id: number;
    company?: Company; // Joined data

    amount_invested: number;
    current_value: number;
    share_class: string; // 'SAFE' | 'Series A' etc
    investment_date: string;
    ownership_percentage?: number;

    // Computed
    moic?: string;
    trend?: 'up' | 'down' | 'flat';
}

export interface AIAnalysis {
    executive_summary: string;
    key_strengths: Array<{
        category: string;
        point: string;
        confidence: 'High' | 'Medium' | 'Low';
    }>;
    red_flags: Array<{
        severity: 'Critical' | 'High' | 'Medium' | 'Low';
        flag: string;
        recommendation: string;
    }>;
    investment_recommendation: {
        verdict: 'Buy' | 'Watch' | 'Pass';
        confidence: number;
        reasoning: string;
    };
    generated_at?: string;
    model_used?: string;
}

export interface Deal {
    id: number;
    company_id: number;
    company?: Company;
    stage: 'Inbox' | 'Screening' | 'Due Diligence' | 'Investment Committee' | 'Offer' | 'Closed' | 'Passed';
    deal_lead?: string;
    probability: number;
    amount: number;
    expected_close_date?: string;
    created_at: string;
}

export interface PortfolioDocument {
    id: string;
    company_id?: number | null;
    title: string;
    url: string;
    type: 'Contract' | 'Report' | 'Deck' | 'Other';
    file_size?: string;
    created_at: string;
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
