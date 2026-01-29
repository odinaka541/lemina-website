
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { generateCompanyAnalysis } from '@/lib/ai/openai-service';

// Service role required to read/write insights table securely
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const { companyId } = await request.json();

        if (!companyId) {
            return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
        }

        // 1. Check Cache (Freshness: 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: cached } = await supabase
            .from('company_insights')
            .select('*')
            .eq('company_id', companyId)
            .gt('created_at', thirtyDaysAgo.toISOString())
            .single();

        if (cached) {
            return NextResponse.json({
                data: cached.analysis_json,
                from_cache: true,
                generated_at: cached.created_at
            });
        }

        // 2. Fetch Full Company Data
        const { data: company, error: fetchError } = await supabase
            .from('companies')
            .select('*')
            .eq('id', companyId)
            .single();

        if (fetchError || !company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        // 3. Generate Analysis (Expensive Call)
        const analysis = await generateCompanyAnalysis(company);

        // 4. Cache Result
        await supabase
            .from('company_insights')
            .upsert({
                company_id: companyId,
                analysis_json: analysis,
                model_used: 'llama-3.3-70b-versatile'
            }, { onConflict: 'company_id' });

        return NextResponse.json({
            data: analysis,
            from_cache: false,
            generated_at: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('AI API Error:', error);
        // Return 500 but with detail so Client can show Toast
        return NextResponse.json({
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
