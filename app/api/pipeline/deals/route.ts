import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
    // For demo: Use service role to ensure data fetching works without auth
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { data: deals, error } = await supabase
            .from('deals')
            .select(`
                *,
                company:companies (
                    id,
                    name,
                    logo_url,
                    website,
                    sector
                )
            `)
            .order('order_index', { ascending: true }); // Ensure consistent order within columns

        if (error) {
            console.error('Error fetching deals:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data: deals });
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const body = await request.json();
        const { companyId, stage, amount, probability } = body;

        // Basic validation
        if (!companyId) {
            return NextResponse.json({ error: 'Missing companyId' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('deals')
            .insert({
                company_id: companyId,
                stage: stage || 'inbox',
                amount: amount,
                probability: probability,
                order_index: 0 // Default to top of list
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Log Activity
        await supabase.from('activities').insert({
            type: 'investment',
            title: 'New Deal Added',
            description: `Added deal for company ID ${companyId} to ${stage}`,
            entity_type: 'deal',
            entity_id: data.id
        });

        return NextResponse.json({ data });

    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
