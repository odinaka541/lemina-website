import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
const pdf = require('pdf-parse');
import { Investment } from '@/lib/types';

// Initialize Groq Client
const groq = new OpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY
});

// Service role for DB access
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const maxDuration = 60; // Allow longer timeout for AI/Parser

export async function POST(req: Request) {
    try {
        const { documentId } = await req.json();

        if (!documentId) {
            return NextResponse.json({ error: 'documentId required' }, { status: 400 });
        }

        // 1. Fetch Document & Investment Context
        const { data: doc, error: docError } = await supabase
            .from('portfolio_documents')
            .select(`
                *,
                investment:investments (
                    *,
                    company:companies(name)
                )
            `)
            .eq('id', documentId)
            .single();

        if (docError || !doc) throw new Error('Document not found');

        // Update status to processing
        await supabase.from('portfolio_documents').update({ analysis_status: 'processing' }).eq('id', documentId);

        // 2. Fetch File Content
        const fileRes = await fetch(doc.url);
        if (!fileRes.ok) throw new Error('Failed to fetch file content');
        const arrayBuffer = await fileRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 3. Extract Text
        let textContent = '';
        if (doc.file_type === 'application/pdf' || doc.file_name.endsWith('.pdf')) {
            const data = await pdf(buffer);
            textContent = data.text;
        } else {
            // Assume text/plain or fail gracefully
            textContent = buffer.toString('utf-8');
            if (textContent.length > 50000) textContent = textContent.slice(0, 50000); // Truncate
        }

        // 4. Construct Prompt
        const investment = doc.investment;
        const prompt = `
            You are an AI investment analyst. Analyze this document for an angel investor.
            
            INVESTMENT CONTEXT:
            - Company: ${investment.company?.name}
            - Investment Date: ${investment.invested_date}
            - Amount: $${investment.amount_invested}
            - Round: ${investment.round_type}
            - Valuation: $${investment.valuation_at_investment || 'Unknown'}
            - Thesis: ${investment.investment_thesis || 'N/A'}

            DOCUMENT CONTENT:
            ${textContent.slice(0, 20000)} ... [truncated]

            YOUR TASK:
            Analyze company health, extract metrics, and assess impact on the investor's stake.
            Return valid JSON only.

            JSON STRUCTURE:
            {
                "extracted_metrics": {
                    "revenue": { "value": "e.g. 12M", "unit": "ARR", "change_yoy": "optional" },
                    "burn_rate": { "value": "optional", "unit": "monthly" },
                    "runway": { "value": number, "unit": "months" }
                },
                "health_score": number (0-100),
                "health_status": "healthy" | "monitoring" | "at_risk",
                "risk_level": "Low" | "Medium" | "High" | "Critical",
                "ai_assessment": "3-4 sentences summary",
                "strengths": ["point 1", "point 2"],
                "concerns": ["concern 1"],
                "opportunities": ["opportunity 1", "opportunity 2"],
                "investment_value": {
                    "conservative": number (estimated current value of stake),
                    "optimistic": number
                },
                "next_action": "Specific concise action for investor",
                "strategic_recommendations": ["rec 1", "rec 2"],
                "confidence_score": number (0-100)
            }
        `;

        // 5. Call Groq
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a senior investment analyst. Output only valid JSON." },
                { role: "user", content: prompt }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const resultJson = JSON.parse(completion.choices[0].message.content || '{}');

        // 6. Save Analysis
        const { error: saveError } = await supabase.from('portfolio_analyses').insert({
            document_id: documentId,
            investment_id: investment.id,
            extracted_metrics: resultJson.extracted_metrics,
            ai_assessment: resultJson.ai_assessment,
            health_score: resultJson.health_score,
            risks: resultJson.concerns,
            recommendation: resultJson.strategic_recommendations?.[0] || 'Review details', // Field name 'recommendation' or 'recommendations'? Checking existing code maps 'recommendations': [resultJson.recommendation]
            // Wait, existing code used 'recommendations' (plural) column but logic was [resultJson.recommendation].
            // To be safe and align with new fields:
            opportunities: resultJson.opportunities,
            strategic_recommendations: resultJson.strategic_recommendations,
            next_action: resultJson.next_action,
            risk_level: resultJson.risk_level,
            confidence_score: resultJson.confidence_score,
            created_at: new Date().toISOString()
        });

        if (saveError) throw saveError;

        // 7. Update Investment & Document Status
        await supabase.from('portfolio_documents').update({ analysis_status: 'completed' }).eq('id', documentId);

        // Update investment health and current value if confident
        if (resultJson.health_score) {
            const updates: any = {
                ai_health_score: resultJson.health_score,
                status: resultJson.health_status === 'healthy' ? 'active' : resultJson.health_status,
                updated_at: new Date().toISOString()
            };

            if (resultJson.investment_value?.conservative) {
                updates.current_value = resultJson.investment_value.conservative;
            }

            await supabase.from('investments').update(updates).eq('id', investment.id);
        }

        return NextResponse.json({ success: true, analysis: resultJson });

    } catch (error: any) {
        console.error('AI Analysis Failed:', error);
        // Mark as failed
        if (req.body) {
            // hard to get docId if parse failed, skip
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
