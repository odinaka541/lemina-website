
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        // 1. Total Deal Flow (Count of all deals)
        const { count: totalDeals, error: dealsError } = await supabase
            .from('deals')
            .select('*', { count: 'exact', head: true });

        // 2. Active Due Diligence (All Open Deals: inbox, diligence, negotiation, committed)
        // User requested: "Active Diligence = Value of open deals". Interpreting as Count of Non-Passed/Non-Done deals.
        const { count: activeDeals, error: activeError } = await supabase
            .from('deals')
            .select('*', { count: 'exact', head: true })
            .neq('stage', 'passed')
            .neq('stage', 'done'); // Exclude 'done' as well per request

        // 3. Market Cap Tracked (Sum of current_value of all investments)
        // Note: Supabase .select() doesn't do SUM easily without rpc, so we fetch & reduce (okay for small dataset)
        const { data: investments, error: investError } = await supabase
            .from('investments')
            .select('current_value');

        const marketCap = investments?.reduce((sum, item) => sum + (item.current_value || 0), 0) || 0;

        // 4. New Opportunities (Total Companies in DB)
        const { count: totalCompanies, error: companiesError } = await supabase
            .from('companies')
            .select('*', { count: 'exact', head: true });

        if (dealsError || activeError || investError || companiesError) {
            console.error('Stats Error:', dealsError || activeError || investError || companiesError);
            throw new Error('Failed to fetch stats');
        }

        return NextResponse.json({
            total_deal_flow: totalDeals || 0,
            active_diligence: activeDeals || 0,
            market_cap: marketCap,
            new_opportunities: totalCompanies || 0
        });

    } catch (error: any) {
        console.error('Dashboard Stats API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
