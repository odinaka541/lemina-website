import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        console.log('Starting seed...');

        // 1. Clear existing data (optional, but good for clean slate)
        const { error: clearError } = await supabase.from('investments').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
        if (clearError) console.warn('Clear error:', clearError);

        const companies = [
            {
                name: 'PayStacker',
                short_description: 'API-first payments for rural Africa.',
                sector: 'Fintech',
                funding_stage: 'Series B',
                logo_url: '/logos/paystacker.png',
                headquarters: 'Lagos, Nigeria',
                website: 'https://paystacker.example.com',
                founded_year: 2020
            },
            {
                name: 'AgriFuture',
                short_description: 'Drone-mapping for maximizing crop yield.',
                sector: 'AgriTech',
                funding_stage: 'Series A',
                logo_url: '/logos/agrifuture.png',
                headquarters: 'Nairobi, Kenya',
                website: 'https://agrifuture.example.com',
                founded_year: 2021
            },
            {
                name: 'HealthBridge',
                short_description: 'Telemedicine connecting rural clinics to specialists.',
                sector: 'HealthTech',
                funding_stage: 'Seed',
                logo_url: '/logos/healthbridge.png',
                headquarters: 'Accra, Ghana',
                website: 'https://healthbridge.example.com',
                founded_year: 2023
            },
            {
                name: 'LogiTruck',
                short_description: 'Uber for freight logistics across West Africa.',
                sector: 'Logistics',
                funding_stage: 'Pre-Seed',
                logo_url: '/logos/logitruck.png',
                headquarters: 'Lagos, Nigeria',
                website: 'https://logitruck.example.com',
                founded_year: 2024
            }
        ];

        const insertedCompanies = [];
        let firstError = null;

        for (const company of companies) {
            // Check existence
            const { data: existing } = await supabase.from('companies').select('id').eq('name', company.name).single();

            if (existing) {
                insertedCompanies.push({ ...company, id: existing.id });
            } else {
                const { data, error } = await supabase.from('companies').insert(company).select().single();
                if (error) {
                    console.error(`Failed to insert ${company.name}:`, error);
                    if (!firstError) firstError = error;
                } else if (data) {
                    insertedCompanies.push(data);
                }
            }
        }

        if (insertedCompanies.length === 0) {
            return NextResponse.json({ error: "Failed to insert/find any companies", details: firstError }, { status: 500 });
        }

        // 3. Create Investments with varying health
        const investments = [
            // Strong Performer -> Company 0
            insertedCompanies.length > 0 ? {
                company_id: insertedCompanies[0].id,
                amount_invested: 150000,
                invested_date: '2022-03-15',
                round_type: 'Series A',
                current_value: 450000,
                ownership_percentage: 2.5,
                status: 'active',
                ai_health_score: 92,
                investment_thesis: 'Dominant market position and 20% MoM growth.'
            } : null,
            // Steady / Monitoring -> Company 1
            insertedCompanies.length > 1 ? {
                company_id: insertedCompanies[1].id,
                amount_invested: 100000,
                invested_date: '2023-01-10',
                round_type: 'Seed',
                current_value: 120000,
                ownership_percentage: 5.0,
                status: 'monitoring',
                ai_health_score: 65,
                investment_thesis: 'Strong tech but regulatory headwinds in Kenya.'
            } : null,
            // New / Unknown -> Company 2
            insertedCompanies.length > 2 ? {
                company_id: insertedCompanies[2].id,
                amount_invested: 50000,
                invested_date: '2024-06-01',
                round_type: 'SAFE',
                current_value: 50000,
                ownership_percentage: 0,
                status: 'active',
                ai_health_score: 85,
                investment_thesis: 'Unique distribution model for rural clinics.'
            } : null,
            // At Risk -> Company 3 (or 0 if not enough)
            insertedCompanies.length > 3 ? {
                company_id: insertedCompanies[3].id,
                amount_invested: 25000,
                invested_date: '2024-11-20',
                round_type: 'Pre-Seed',
                current_value: 15000,
                ownership_percentage: 1.5,
                status: 'at_risk',
                ai_health_score: 45,
                investment_thesis: 'High risk high reward logistics play.'
            } : null
        ].filter(Boolean);

        for (const inv of investments) {
            if (!inv) continue;

            const { data: invData, error: invError } = await supabase.from('investments').insert(inv).select().single();

            if (invError) {
                console.error("Inv Insert Error:", invError);
                continue;
            }

            // 4. Create Mock Analysis
            const comp = insertedCompanies.find(c => c.id === inv.company_id);
            if (comp && inv.ai_health_score > 90) {
                await createMockAnalysis(invData, comp, 92, 'healthy', 'Q3 2025 Financials');
            } else if (comp && inv.ai_health_score < 50) {
                await createMockAnalysis(invData, comp, 45, 'at_risk', 'Feb 2026 Update');
            }
        }

        return NextResponse.json({ success: true, message: "Database seeded with portfolio data" });

    } catch (error: any) {
        console.error('Seed Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function createMockAnalysis(investment: any, company: any, score: number, status: string, title: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create Document
    const { data: doc } = await supabase.from('portfolio_documents').insert({
        investment_id: investment.id,
        company_id: company.id,
        title: title,
        type: 'Report',
        url: '#', // Mock URL
        file_name: `${title.replace(/ /g, '_')}.pdf`,
        file_size: '2.5 MB',
        analysis_status: 'completed'
    }).select().single();

    if (!doc) return;

    // Create Analysis
    await supabase.from('portfolio_analyses').insert({
        document_id: doc.id,
        investment_id: investment.id,
        health_score: score,
        ai_assessment: status === 'healthy'
            ? `${company.name} continues to exceed expectations with strong unit economics and reduced CAC. Runway extends to 18 months.`
            : `${company.name} is facing significant liquidity challenges. Burn rate has increased by 40% QoQ without corresponding revenue growth.`,
        strengths: status === 'healthy' ? ['High Revenue Growth', 'Low Churn'] : ['Strong Tech Team'],
        risks: status === 'healthy' ? ['Competition intensifying'] : ['Low Runway', 'Regulatory delays'],
        recommendations: status === 'healthy' ? ['Follow-on in Series B'] : ['Request immediate board meeting', 'Review bridge round options'],
        // Master Spec Enriched Fields
        risk_level: status === 'healthy' ? 'Low' : 'Critical',
        next_action: status === 'healthy' ? 'Review Q3 deck' : 'Schedule call with Founder',
        opportunities: status === 'healthy' ? ['Expansion to East Africa', 'B2B Pivot guarantees revenue'] : ['Merger with Competitor X', 'Pivot to SaaS'],
        strategic_recommendations: status === 'healthy' ? ['Follow-on in Series B', 'Introduce to Partner X'] : ['Request immediate board meeting', 'Review bridge round options', 'Freeze hiring'],
        confidence_score: 95,
        extracted_metrics: {
            revenue: { value: status === 'healthy' ? '$12M' : '$500k', unit: 'ARR' },
            runway: { value: status === 'healthy' ? 18 : 3, unit: 'months' }
        }
    });
}
