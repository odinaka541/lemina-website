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
                    sector,
                    verification_tier,
                    confidence_score
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
        const {
            companyId, stage, amount, probability,
            deal_source, expected_close_date, is_syndicate,
            syndicate_lead, introduced_by, round_size, notes,
            priority // New field
        } = body;

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
                probability: probability || 0, // Default to 0 if not provided
                source: deal_source,
                priority: priority || 'Medium', // Default to Medium
                expected_close_date: expected_close_date,
                is_syndicate: is_syndicate,
                syndicate_lead: syndicate_lead,
                introduced_by: introduced_by,
                round_size: round_size,
                notes: notes,
                order_index: 0, // Default to top of list
                last_contact: new Date().toISOString(), // Use explicit now
                last_contact_type: notes ? 'note' : 'email' // Default type
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Log Activity
        // Fetch company name first for better log
        const { data: companyData } = await supabase
            .from('companies')
            .select('name')
            .eq('id', companyId)
            .single();

        const companyName = companyData?.name || `Company ${companyId}`;

        await supabase.from('activities').insert({
            type: 'investment',
            title: 'New Deal Added',
            description: `Added deal for ${companyName} to ${stage || 'Inbox'}`,
            entity_type: 'deal',
            entity_id: data.id
        });

        return NextResponse.json({ data });

    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const body = await request.json();
        const { id, updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing deal ID' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('deals')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err) {
        console.error('Error updating deal:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing deal ID' }, { status: 400 });
        }

        const { error } = await supabase
            .from('deals')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error deleting deal:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
