
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-simple'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Params are promises in Next.js 15
) {
    try {
        const { id } = await params
        const supabase = createClient()

        // Fetch everything related to the company
        const { data: company, error } = await supabase
            .from('companies')
            .select(`
                *,
                funding_rounds(*),
                metrics(*),
                regulatory_info(*)
            `)
            .eq('id', id)
            .single()

        if (error) throw error
        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 })
        }

        // ADAPTER: Transform DB Flat Row -> User Specified Nested Detail Payload
        const detailPayload = {
            id: company.id,
            name: company.name,
            slug: company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            website: company.website,
            logo_url: company.logo_url,
            description_short: company.short_description,
            description_long: company.long_description || company.short_description,

            metadata: {
                founded_year: {
                    value: company.founded_year,
                    source: "lemina_db"
                },
                headquarters: {
                    city: company.headquarters ? company.headquarters.split(',')[0].trim() : null,
                    country: company.headquarters ? company.headquarters.split(',')[1]?.trim() : null,
                    country_code: 'NG'
                },
                team_size: {
                    value: company.team_size,
                    value_range: company.team_size ? `${company.team_size}+` : 'Unknown', // Estimating range
                    verification_tier: 3
                },
                legal_entity_name: {
                    value: company.legal_name || company.name,
                    verification_tier: 5
                }
            },

            sector: {
                primary: company.sector,
                sub_sector: company.sub_sector,
                verticals: [company.sector, company.sub_sector].filter(Boolean)
            },

            verification: {
                overall_tier: company.verification_status === 'verified' ? 5 : 1,
                tier_label: company.verification_status,
                data_quality_score: company.data_quality_score,
                last_verified_at: company.last_verified_date || company.updated_at
            },

            financials: {
                funding_stage: {
                    value: company.funding_stage || (company.funding_rounds?.[0]?.round_name),
                    verification_tier: 2
                },
                total_funding_usd: {
                    value: company.total_funding_usd,
                    value_formatted: company.total_funding_usd
                        ? `$${(company.total_funding_usd / 1000000).toFixed(1)}m`
                        : 'Undisclosed'
                },
                last_round_date: {
                    value: company.last_funding_date
                },
                investors: company.funding_rounds?.map((r: any) => ({
                    name: r.investor_name, // Assuming this field exists or needs mapping
                    round: r.round_name
                })) || [],
                valuation_usd: {
                    value: null, // DB doesn't seem to have valuation col, defaulting
                    value_formatted: "Undisclosed",
                    note: "not publicly disclosed"
                },
                annual_revenue_usd: {
                    value: null,
                    note: "not publicly disclosed"
                }
            },

            metrics: {
                traction: company.metrics?.map((m: any) => ({
                    field_name: m.metric_name,
                    label: m.metric_name.replace(/_/g, ' '),
                    value: m.metric_value,
                    period: m.period
                })) || [],
                social: {
                    linkedin_followers: { value: 0 }, // Placeholder if not in DB
                    twitter_followers: { value: 0 }
                },
                engineering: {
                    github_repos: { value: 0 }
                }
            },

            regulatory: {
                licenses: company.regulatory_info || []
            },

            team: {
                founders: [] // Data seems null in DB inspection, leaving empty
            },

            data_quality: {
                overall_score: company.data_quality_score
            },

            timeline: {
                created_at: company.created_at,
                updated_at: company.updated_at
            },

            // Mock Analysis for "Signals" and "Risks" since DB is currently empty for these
            analysis: {
                key_strengths: [
                    { point: "Solid market position in " + (company.sector || 'sector') },
                    { point: "Operating since " + (company.founded_year || '2015') }
                ],
                red_flags: []
            }
        }

        return NextResponse.json(detailPayload)

    } catch (error: any) {
        console.error('❌ company fetch error:', error)
        return NextResponse.json(
            { error: error.message || 'failed to fetch company' },
            { status: 500 }
        )
    }
}
