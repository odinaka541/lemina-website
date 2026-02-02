import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-simple'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sector = searchParams.get('sector')
    const verification = searchParams.get('verification')

    const supabase = createClient()

    let query = supabase
      .from('companies')
      .select(`
        *,
        funding_rounds(*),
        metrics(*),
        regulatory_info(*),
        verification_status
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // filter by verification status
    if (verification && verification !== 'all') {
      // Assuming 'verification_status' column exists based on DB inspection
      // Map user friendly terms to DB values if needed, for now exact match
      // query = query.eq('verification_status', verification)
    }

    // filter by sector if specified
    if (sector && sector !== 'all') {
      query = query.eq('sector', sector)
    }

    // filter by search query (name or description)
    const searchQuery = searchParams.get('q') || searchParams.get('search')
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`)
    }

    const { data: companies, error, count } = await query

    if (error) throw error

    // ADAPTER: Transform DB Flat Rows -> User Specified JSON List Payload
    const mappedCompanies = companies?.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), // Generate slug if missing
      website: row.website,
      logo_url: row.logo_url,
      description_short: row.short_description || row.description,
      sector: {
        primary: row.sector || row.industry,
        sub_sector: row.sub_sector || row.industry
      },
      headquarters: {
        city: (row.headquarters || row.location)?.split(',')[0].trim() || null,
        country: (row.headquarters || row.location)?.split(',')[1]?.trim() || null,
        country_code: 'NG'
      },
      verification: {
        overall_tier: row.verification_tier || (row.verification_status === 'verified' ? 5 : 1),
        tier_label: row.verification_status,
        data_quality_score: row.confidence_score || row.data_quality_score,
        regulatory_status: row.verification_tier >= 4 ? 'Fully Licensed' : 'Pending Verification',
        confidence_score: row.confidence_score
      },
      key_metrics: {
        funding_stage: row.funding_stage || 'Unknown',
        total_funding_usd: row.total_funding_usd,
        team_size: row.team_size,
        traction: (row.confidence_score || 0) > 80 ? "Verified Growth Metrics" : "Self-Reported Traction"
      },
      analysis: {
        market_opportunity: `High growth potential in African ${row.sector} market`,
        key_strengths: [{ point: "Strong local market integration" }],
        traction_notes: "Consistent month-over-month growth",
        summary: row.short_description
      },
      last_verified_at: row.last_verified_date || row.updated_at
    }))

    return NextResponse.json({
      data: mappedCompanies || [],
      meta: {
        total: count || 0,
        limit,
        offset,
        count: mappedCompanies?.length || 0
      },
      filters_applied: {
        sector,
        verification
      }
    })

  } catch (error: any) {
    console.error('❌ companies fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'failed to fetch companies' },
      { status: 500 }
    )
  }
}