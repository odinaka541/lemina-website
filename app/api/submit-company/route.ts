import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-simple'

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    const supabase = createClient()

    // insert submission
    const { data, error } = await supabase
      .from('company_submissions')
      .insert({
        company_name: formData.companyName,
        website: formData.website,
        sector: formData.sector,
        description: formData.description,
        founded_year: formData.foundedYear,
        hq_city: formData.hqCity,
        team_size: formData.teamSize,
        stage: formData.stage,
        has_traction: formData.hasTraction,
        key_metric: formData.keyMetric || null,
        growth_rate: formData.growthRate || null,
        funding_status: formData.fundingStatus,
        total_funding: formData.totalFunding || null,
        investors: formData.investors || null,

        founder_name: formData.founderName,
        founder_role: formData.founderRole,
        founder_email: formData.founderEmail,
        founder_linkedin: formData.founderLinkedIn,
        founder_twitter: formData.founderTwitter || null,

        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Submission received'
    })

  } catch (error: any) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit' },
      { status: 500 }
    )
  }
}