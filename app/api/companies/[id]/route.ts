import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;

    // Simulate different data depth based on ID (for testing)
    // Default to "Rich Data" (Stears example)
    const company = {
        id: id,
        name: "Stears",
        description: "Stears is a financial intelligence company providing data and insights for African markets. They help businesses and investors make better decisions through rigorous analysis and on-the-ground intelligence.",
        sector: "Fintech",
        sub_sector: "Market Intelligence",
        country: "Nigeria",
        city: "Lagos",
        location: "Lagos, Nigeria",
        status: "Active",
        founded_year: 2017,
        website: "https://stears.co",
        logo_url: "/logos/stears.png", // Mock path
        verification_tier: 4,
        employees_range: "10-50",

        // Funding (Rich Data)
        funding_stage: "Series A",
        funding_amount: 3300000,
        funding_date: "2023-01-01",
        investors: ["MaC Venture Capital", "Serena Ventures", "Omidyar Group", "Luminate"],

        // Legal
        registration_number: "RC142567",
        registration_status: "Active",
        registration_date: "2017-08-15",

        // Founders
        founders: [
            {
                name: "Preston Ideh",
                title: "Co-founder & CEO",
                photo_url: "",
                background: "Ex-Corporate Finance, LSE Alum"
            },
            {
                name: "Abdul Abdulrahim",
                title: "Co-founder & COO",
                photo_url: "",
                background: "Ex-Data Scientist, Oxford Alum"
            },
            {
                name: "Michael Famoroti",
                title: "Co-founder & Chief Economist",
                photo_url: "",
                background: "Ex-KPMG, PhD Economics"
            }
        ],

        // Documents
        documents: [
            {
                id: "d1",
                title: "Market Expansion Deck 2024",
                file_type: "pdf",
                file_size: 4500000,
                uploaded_at: "2024-03-15",
                ai_analyzed: true
            },
            {
                id: "d2",
                title: "Q4 2023 Financials",
                file_type: "xlsx",
                file_size: 1200000,
                uploaded_at: "2024-01-20",
                ai_analyzed: true
            }
        ],

        // News
        news: [
            {
                id: "n1",
                title: "Stears raises $3.3M seed round led by MaC Venture Capital",
                source: "TechCrunch",
                category: "Funding",
                sentiment: "Positive",
                published_at: "2022-10-18"
            },
            {
                id: "n2",
                title: "Bloomberg for Africa? Stears pivots to intelligence",
                source: "TechCabal",
                category: "Product",
                sentiment: "Neutral",
                published_at: "2023-11-05"
            }
        ],

        // Metadata for UI logic
        metadata: {
            headquarters: { city: "Lagos", country: "Nigeria" }
        }
    };

    const market = {
        tam: 2000000000,
        growth_rate: 15,
        competitor_count: 12,
        tailwinds: [
            "Growing demand for FX data in Nigeria",
            "Increasing institutional investment in Africa",
            "Data fragmentation creates opportunity for aggregators"
        ],
        headwinds: [
            "Currency devaluation impacts subscription costs",
            "Difficulty in verifying private market data"
        ],
        competitors: [
            { name: "TechCabal Insights", stage: "Seed", last_round: "2020", status: "Active" },
            { name: "SBM Intelligence", stage: "Bootstrapped", last_round: "N/A", status: "Active" },
            { name: "Briter Bridges", stage: "Seed", last_round: "2021", status: "Active" }
        ]
    };

    const ai_analysis = {
        investment_memo: `
### Executive Summary
Stears represents a classic "Bloomberg for Africa" play, capitalizing on the opacity of African financial markets. With $3.3M in funding and top-tier investors like Serena Ventures, they have the capital to execute. The pivot from consumer media to B2B intelligence is strategic, targeting higher LTV checks from institutional investors and corporates.

### Market Opportunity
The market for financial data in Africa is fragmented but growing. While the TAM ($2B) is smaller than global markets, the "Winner Take Most" dynamic in data infrastructure suggests high upside if they become the standard.

### Company Analysis
**Strengths:**
*   **Strong Team:** Founders have deep domain expertise (Economics, Law, Data Science).
*   **Brand Authority:** Widely cited by global media (FT, Bloomberg, CNN).
*   **Proprietary Data:** They are building unique datasets (e.g., intense election forecasting models) that others lack.

**Unknowns:**
*   **CAC Efficiency:** B2B enterprise sales cycles in Africa can be long.
*   **Churn:** Are subscribers sticking around after the election cycle hype?

### Investment Considerations
*   **Valuation:** Pricing data infrastructure in Africa is tricky.
*   **Exit:** Likely acquisition targets include global players like Bloomberg, Refinitiv, or S&P looking for African footprint.

**Recommendation:**
Monitor churn rates closely in Q3/Q4. If retention holds >90%, they are a strong Series A candidate.
        `,
        quick_summary: {
            facts: { founded: 2017, location: "Lagos", sector: "Fintech", status: "Active" },
            market: { tam: "$2B", growth: "15%", competition: "Moderate" },
            investment: { stage: "Series A", raised: "$3.3M", last_round: "2023" }
        },
        signals: [
            "Operating for 7+ years (proven longevity)",
            "Backed by Serena Ventures (strong signal)",
            "Tier 4 Verified (Founder verified)"
        ],
        risks: [
            "Niche market size compared to payments/lending",
            "Heavy tough competition from global incumbents"
        ]
    };

    return NextResponse.json({ company, market, ai_analysis });
}
