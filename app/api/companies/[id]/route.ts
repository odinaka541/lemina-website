import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-simple';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const supabase = createClient();

    // Fetch Real Data
    const { data: companyRow, error } = await supabase
        .from('companies')
        .select(`
            *,
            funding_rounds(*),
            metrics(*),
            regulatory_info(*),
            founders(*),
            news(*),
            company_documents(*)
        `)
        .eq('id', id)
        .single();

    if (error || !companyRow) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Construct Response Object (Adapter)
    const company = {
        id: companyRow.id,
        name: companyRow.name,
        description: companyRow.description,
        sector: companyRow.sector || companyRow.industry,
        sub_sector: companyRow.sub_sector || companyRow.industry,
        country: (companyRow.location || "").split(',')[1]?.trim() || "Nigeria",
        city: (companyRow.location || "").split(',')[0]?.trim() || "Lagos",
        location: companyRow.location,
        status: "Active", // Default
        founded_year: companyRow.founded_year,
        website: companyRow.website,
        logo_url: companyRow.logo_url,
        verification_tier: companyRow.verification_tier || 1,
        employees_range: companyRow.team_size ? `${companyRow.team_size}` : "N/A",

        // Funding
        funding_stage: companyRow.funding_stage || "Seed",
        funding_amount: companyRow.total_funding_usd || 0,
        funding_date: companyRow.last_funding_date || "N/A",
        investors: [], // Placeholder for now

        // Legal
        registration_number: companyRow.regulatory_info?.[0]?.registration_number || "Pending",
        registration_status: companyRow.regulatory_info?.[0]?.status || "Active",
        registration_date: companyRow.created_at,

        // Founders
        founders: companyRow.founders || [],

        // Documents
        documents: companyRow.company_documents || [],

        // News
        news: companyRow.news || [],

        // Metadata
        metadata: {
            headquarters: {
                city: (companyRow.location || "").split(',')[0]?.trim(),
                country: (companyRow.location || "").split(',')[1]?.trim()
            }
        }
    };

    // Generic Analysis based on description
    const ai_analysis = {
        investment_memo: `
### Executive Summary
${companyRow.name} is operating in the ${companyRow.industry || 'Tech'} sector. ${companyRow.description}

### Market Opportunity
Targeting the growing African market with a focus on ${companyRow.location || 'regional expansion'}. 

### Analysis
**Strengths:**
*   **Sector Focus:** Well positioned in ${companyRow.sector}.
*   **Traction:** ${companyRow.confidence_score > 80 ? "Strong verified metrics." : "Early stage potential."}

**Recommendation:**
${companyRow.confidence_score > 80 ? "Proceed to diligence." : "Monitor for further traction signals."}
        `,
        quick_summary: {
            facts: { founded: companyRow.founded_year, location: companyRow.location, sector: companyRow.sector, status: "Active" },
            market: { tam: "$2B (Est)", growth: "15%", competition: "Moderate" },
            investment: { stage: companyRow.funding_stage, raised: companyRow.total_funding_usd ? `$${(companyRow.total_funding_usd / 1000000).toFixed(1)}M` : "N/A", last_round: "2023" }
        },
        signals: [
            companyRow.verification_tier > 3 ? "Highly Verified" : "Self-Reported Data",
            "Operating in high-growth sector",
            "Local HQ presence"
        ],
        risks: [
            "Market volatility",
            "Regulatory changes"
        ]
    };

    const market = {
        tam: 500000000,
        growth_rate: 12,
        competitor_count: 5,
        tailwinds: ["Digitization of services", "Youth population growth"],
        headwinds: ["Infrastructure challenges", "FX Volatility"],
        competitors: []
    };

    return NextResponse.json({ company, market, ai_analysis });
}
