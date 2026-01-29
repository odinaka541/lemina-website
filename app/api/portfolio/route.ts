
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Investment } from '@/lib/types';

// Service role to access all investments safely
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic'; // Ensure no caching of financial data

export async function GET() {
    try {
        // 1. Fetch investments with company details
        // 1. Fetch investments with company details
        const { data: investments, error } = await supabase
            .from('investments')
            .select(`
                *,
                company:companies(id, name, logo_url, industry, stage)
            `)
            .order('investment_date', { ascending: false });

        if (error) throw error;

        // 2. Calculate Aggregates
        let totalInvested = 0;
        let totalCurrentValue = 0;
        const sectorAllocation: Record<string, number> = {};
        const stageAllocation: Record<string, number> = {};

        const portfolioItems: Investment[] = investments.map((inv: any) => {
            const invested = parseFloat(inv.amount_invested);
            const current = parseFloat(inv.current_value) || 0; // Default to 0 if not set

            totalInvested += invested;
            totalCurrentValue += current;

            // Metrics per asset
            const moic = invested > 0 ? (current / invested).toFixed(2) + 'x' : '0.00x';
            const trend: 'up' | 'down' | 'flat' = current > invested ? 'up' : current < invested ? 'down' : 'flat';

            // Allocations
            const sector = inv.company?.industry || 'Unknown';
            sectorAllocation[sector] = (sectorAllocation[sector] || 0) + invested;

            const stage = inv.company?.stage || 'Unknown';
            stageAllocation[stage] = (stageAllocation[stage] || 0) + invested;

            return {
                id: inv.id,
                company_id: inv.company_id,
                company: inv.company,

                // Fields required by Investment interface (DB matching)
                amount_invested: invested,
                current_value: current,
                share_class: inv.share_class,
                investment_date: inv.investment_date,

                // Computed / View fields
                moic,
                trend,

                // Legacy / UI Helpers (Optional in type or intersection)
                // We'll cast to any or ideally expand the type if needed, but for now let's satisfy the interface
                investmentId: inv.id,
                name: inv.company?.name || 'Unknown Company',
                logo: inv.company?.logo_url,
                investedDate: new Date(inv.investment_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                amount: `$${(invested / 1000).toFixed(0)}k`,
                shareClass: inv.share_class, // CamelCase alias for UI
                ownership: inv.ownership_percentage ? `${(inv.ownership_percentage * 100).toFixed(2)}%` : '-',
                currentValue: `$${(current / 1000).toFixed(0)}k`, // String format for UI
            } as Investment & { [key: string]: any }; // Allow extra UI props
        });

        // 3. Overall Metrics
        const overallMOIC = totalInvested > 0 ? (totalCurrentValue / totalInvested).toFixed(2) + 'x' : '0.00x';

        // Simple IRR approx (real IRR requires cashstream array, out of scope for MVP)
        // We'll use a placeholder or simple gain % for now
        const gainPercent = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested * 100).toFixed(1) + '%' : '0%';

        // Format Allocations for Charts
        const formatAllocation = (alloc: Record<string, number>) =>
            Object.entries(alloc).map(([name, value], i) => ({
                name,
                value: Math.round(value), // Keep raw value for chart sizing
                color: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'][i % 5]
            })).sort((a, b) => b.value - a.value); // descending

        return NextResponse.json({
            stats: {
                totalInvested: `$${(totalInvested / 1000000).toFixed(2)}M`,
                currentValue: `$${(totalCurrentValue / 1000000).toFixed(2)}M`,
                moic: overallMOIC,
                irr: gainPercent // Labeling as IRR/Gain
            },
            sectors: formatAllocation(sectorAllocation),
            stages: formatAllocation(stageAllocation),
            investments: portfolioItems
        });

    } catch (error: any) {
        console.error('Portfolio API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
