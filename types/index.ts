export type DealStage = 'inbox' | 'diligence' | 'negotiation' | 'committed' | 'passed';

export interface Deal {
    id: string;
    user_id: string;
    company_id: string;
    companyName: string; // Joined from companies table
    website?: string; // Joined from companies table
    logo?: string; // Joined from companies table
    stage: DealStage;
    amount: number;
    probability: number;
    priority: 'High' | 'Medium' | 'Low';
    nextSteps?: string;
    created_at: string;
    updated_at: string;
    // UI helper fields
    ownerName?: string;
    ownerAvatar?: string;
    closeDate?: string;
    lastContact?: string;
    industry?: string[];
    score?: number;
    tier?: string;
}

export interface Company {
    id: string;
    name: string;
    website: string;
    logo_url: string | null;
    description: string | null;
    sector: string | null;
    stage: string | null;
    region: string | null;
    founded_year: number | null;
    verification_status: string;
}
