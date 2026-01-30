
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Investment, MetricsState } from '@/lib/types';

// Service role to access all investments safely
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic'; // Ensure no caching of financial data

export async function GET() {
    try {
        // 1. Fetch investments with company details
        const { data: investments, error } = await supabase
            .from('investments')
            .select(`
                *,
                company:companies(id, name, logo_url, sector, funding_stage, verification_tier, confidence_score)
            `)
            .order('invested_date', { ascending: false });

        if (error) throw error;

        // 2. Calculate Aggregates
        let totalInvested = 0;
        let totalCurrentValue = 0;
        let totalHealthScore = 0;
        let activeCount = 0;
        const sectorAllocation: Record<string, number> = {};
        const stageAllocation: Record<string, number> = {};

        const portfolioItems: Investment[] = investments.map((inv: any) => {
            const invested = parseFloat(inv.amount_invested);
            const current = parseFloat(inv.current_value) || invested; // Fallback to invested if unknown

            // Metrics per asset
            const moic = invested > 0 ? parseFloat((current / invested).toFixed(2)) : 0;
            const trend: 'up' | 'down' | 'flat' = current > invested ? 'up' : current < invested ? 'down' : 'flat';
            const health = inv.ai_health_score || 0;

            // Aggregate Totals
            totalInvested += invested;
            totalCurrentValue += current;

            if (inv.status === 'active' || inv.status === 'monitoring') {
                activeCount++;
                if (health > 0) totalHealthScore += health;
            }

            // Allocations
            const sector = inv.company?.sector || 'Unknown';
            sectorAllocation[sector] = (sectorAllocation[sector] || 0) + invested;

            const stage = inv.company?.funding_stage || 'Unknown';
            stageAllocation[stage] = (stageAllocation[stage] || 0) + invested;

            return {
                id: inv.id,
                company_id: inv.company_id,
                company: inv.company,

                amount_invested: invested,
                current_value: current,
                round_type: inv.round_type,
                invested_date: inv.invested_date,
                ownership_percentage: inv.ownership_percentage,

                status: inv.status || 'active',
                ai_health_score: health,

                // Computed
                moic,
                trend,

                // Compatibility / UI Helpers
                investmentId: inv.id,
                name: inv.company?.name || 'Unknown',
                logo: inv.company?.logo_url,
                investedDate: new Date(inv.invested_date).toLocaleDateString(),
                amount: `$${(invested / 1000).toFixed(0)}k`,
                currentValueDisplay: `$${(current / 1000).toFixed(0)}k`
            } as any;
        });

        // 3. Overall Metrics
        const overallMOIC = totalInvested > 0 ? (totalCurrentValue / totalInvested).toFixed(2) + 'x' : '0.00x';
        const gainPercent = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested * 100).toFixed(1) + '%' : '0%';
        const avgHealth = activeCount > 0 ? Math.round(totalHealthScore / activeCount) : 0;

        // Format Allocations for Charts
        const formatAllocation = (alloc: Record<string, number>) =>
            Object.entries(alloc).map(([name, value], i) => ({
                name,
                value: Math.round(value),
                color: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'][i % 5]
            })).sort((a, b) => b.value - a.value);

        const stats: MetricsState = {
            totalInvested: `$${(totalInvested / 1000000).toFixed(2)}M`,
            currentValue: `$${(totalCurrentValue / 1000000).toFixed(2)}M`,
            moic: overallMOIC,
            netIrr: gainPercent,
            healthScore: avgHealth,
            activeCompanies: activeCount
        };

        return NextResponse.json({
            stats,
            sectors: formatAllocation(sectorAllocation),
            stages: formatAllocation(stageAllocation),
            investments: portfolioItems
        });

    } catch (error: any) {
        console.error('Portfolio API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
