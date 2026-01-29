
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

        // 2. Active Due Diligence (Deals in 'due_diligence' stage)
        const { count: diligenceDeals, error: diligenceError } = await supabase
            .from('deals')
            .select('*', { count: 'exact', head: true })
            .eq('stage', 'due_diligence'); // Ensure this matches enum string in DB

        // 3. Market Cap Tracked (Sum of current_value of all investments)
        // Note: Supabase .select() doesn't do SUM easily without rpc, so we fetch & reduce (okay for small dataset)
        const { data: investments, error: investError } = await supabase
            .from('investments')
            .select('current_value');

        const marketCap = investments?.reduce((sum, item) => sum + (item.current_value || 0), 0) || 0;

        // 4. New Opportunities (Deals created in last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { count: newDeals, error: newDealsError } = await supabase
            .from('deals')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', sevenDaysAgo.toISOString());

        if (dealsError || diligenceError || investError || newDealsError) {
            console.error('Stats Error:', dealsError || diligenceError || investError || newDealsError);
            throw new Error('Failed to fetch stats');
        }

        return NextResponse.json({
            total_deal_flow: totalDeals || 0,
            active_diligence: diligenceDeals || 0,
            market_cap: marketCap,
            new_opportunities: newDeals || 0
        });

    } catch (error: any) {
        console.error('Dashboard Stats API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
