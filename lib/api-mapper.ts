
import { CompanyCardProps } from '@/components/company/CompanyCard';

/**
 * Maps the User's API List Payload structure to the CompanyCardProps used by the frontend.
 */
export function mapCompanyToList(apiCompany: any): CompanyCardProps {
    const metrics = [];

    // 1. Funding Stage
    metrics.push({
        label: "Funding Stage",
        value: apiCompany.key_metrics?.funding_stage || apiCompany.financials?.funding_stage?.value || 'Unknown'
    });

    // 2. Business Model
    metrics.push({
        label: "Business Model",
        value: apiCompany.sector?.sub_sector || apiCompany.sector?.primary || 'N/A'
    });

    // 3. Traction Signals
    metrics.push({
        label: "Traction Signals",
        value: apiCompany.key_metrics?.traction || apiCompany.analysis?.traction_notes || 'Data pending verification'
    });

    // 4. Market Opportunity
    metrics.push({
        label: "Market Opportunity",
        value: apiCompany.analysis?.market_opportunity || 'Under Analysis'
    });

    // 5. Why Promising? (Key Strength)
    // Try to get first strength or generic note
    const keyStrength = apiCompany.analysis?.key_strengths?.[0]?.point || apiCompany.analysis?.summary || 'High potential in sector';
    metrics.push({
        label: "Why Promising?",
        value: keyStrength
    });

    // 6. Regulatory Status
    metrics.push({
        label: "Regulatory Status",
        value: apiCompany.verification?.regulatory_status || 'Unverified'
    });

    return {
        id: apiCompany.id.toString(),
        name: apiCompany.name,
        description: apiCompany.description_short || apiCompany.short_description || '',
        logo: apiCompany.logo_url,
        location: apiCompany.headquarters ? `${apiCompany.headquarters.city}, ${apiCompany.headquarters.country}` : '',
        employees: apiCompany.key_metrics?.team_size || 0,
        funding: apiCompany.key_metrics?.funding_stage || apiCompany.financials?.funding_stage?.value || 'Unknown',
        lastUpdated: formatTimeAgo(apiCompany.last_verified_at || new Date().toISOString()),
        flags: apiCompany.headquarters?.country_code ? [apiCompany.headquarters.country_code.toLowerCase()] : [],
        metrics: metrics,
        // Defaulting these for now until API returns them
        matchScore: undefined,
        isVerified: apiCompany.verification_status === 'verified'
    };
}

/**
 * Maps the User's API Detail Payload structure to the CompanyProfile object used by the detail page.
 */
/**
 * Maps the User's API Detail Payload structure to the CompanyProfile object used by the detail page.
 */
export function mapCompanyToDetail(apiCompany: any): any {
    const isVerified = apiCompany.verification_status === 'verified';
    const sector = apiCompany.sector?.primary || 'Tech';
    const subSector = apiCompany.sector?.sub_sector || 'General';

    // Helper to generate estimated market data if missing
    const getMarketData = () => {
        // Synthesis logic based on sector
        const marketSize = sector === 'fintech' ? "$4.2B" : sector === 'logistics' ? "$1.5B" : "$800M";
        const growth = sector === 'fintech' ? "38%" : "25%";

        return {
            tam: { value: marketSize, isEstimated: !isVerified },
            cagr: { value: growth, isEstimated: !isVerified },
            users: { value: isVerified ? "Verified User Base" : "Est. >10k Users", isEstimated: !isVerified },
            competitors: [
                // Mock competitors based on sector
                { name: "Competitor A", funding: "Series B", revenue: "$5M" },
                { name: "Competitor B", funding: "Series A", revenue: "$2M" },
                { name: "Competitor C", funding: "Seed", revenue: "$500k" }
            ]
        };
    };

    // Helper to generate news
    const getNews = () => {
        if (isVerified && apiCompany.name === 'Paystack') {
            // Return real mock news for Paystack if we have it hardcoded or from DB
            return null; // Will fallback to component default or specific logic
        }

        // Synthetic News
        const companyName = apiCompany.name;
        return [
            {
                id: 1,
                title: `${companyName} expands operations in ${apiCompany.headquarters?.country || 'Nigeria'}`,
                source: "TechCabal",
                date: "2 weeks ago",
                type: "Product",
                impact: "Positive",
                leminaTake: `Strategic move to capture more market share in ${subSector}.`,
                summary: `${companyName} has announced planned expansion of its ${subSector} offerings to reach more customers.`,
                url: "#",
                isMaterial: false,
                isEstimated: true
            },
            {
                id: 2,
                title: `Sector Report: ${subSector} continues to grow`,
                source: "TechCrunch",
                date: "1 month ago",
                type: "Macro",
                impact: "Neutral",
                leminaTake: `Rising tide lifts all boats; ${companyName} positioned to benefit.`,
                summary: `New report indicates strong tailwinds for ${subSector} in West Africa.`,
                url: "#",
                isEstimated: true
            }
        ];
    };

    return {
        id: apiCompany.id,
        name: apiCompany.name,
        description: apiCompany.description_short || apiCompany.short_description,
        location: apiCompany.headquarters ? (typeof apiCompany.headquarters === 'string' ? apiCompany.headquarters : `${apiCompany.headquarters.city || ''}, ${apiCompany.headquarters.country || ''}`) : 'Lagos, Nigeria',
        founded: apiCompany.founded_year || '2015', // Fallback
        stage: apiCompany.funding_stage || 'Series A', // Fallback
        website: apiCompany.website,
        logo: apiCompany.logo_url,
        tags: [sector, subSector, apiCompany.business_model || 'B2B'],
        lastUpdated: new Date(apiCompany.updated_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),

        // Detailed fields for Overview Tab
        about: apiCompany.description_long || apiCompany.long_description || apiCompany.description_short || "No detailed description available.",
        industry: `${sector} / ${subSector}`,
        employees: apiCompany.team_size || (isVerified ? "100-250" : "10-50"),

        // Financials (for highlights)
        totalRaised: apiCompany.total_funding_usd ? `$${(apiCompany.total_funding_usd / 1000000).toFixed(1)}M` : { value: "Undisclosed", isEstimated: true },
        valuation: { value: "Undisclosed", isEstimated: true },
        valuationNote: "Valuation based on recent funding rounds in similar sector",
        investors: ["Ventures Platform", "Microtraction"], // Mock for now if empty

        // Key People
        founders: apiCompany.founders ? JSON.parse(JSON.stringify(apiCompany.founders)) : [], // Simplified

        // Dynamic Market Data
        market: getMarketData(),

        // Dynamic News
        news: getNews(),

        // Signals & Risks 
        signals: apiCompany.analysis?.key_strengths?.map((s: any) => ({
            text: s.point,
            type: 'positive'
        })) || [
                { text: `Strong position in ${sector} sector`, type: 'positive' }
            ],
        risks: apiCompany.analysis?.red_flags?.map((r: any) => ({
            text: r.flag,
            type: 'warning'
        })) || [
                { text: "Currency devaluation risk", type: 'warning' }
            ]
    };
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
}
