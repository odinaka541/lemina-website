
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

export interface AIAnalysisResult {
    executive_summary: string;
    key_strengths: Array<{
        category: string;
        point: string;
        confidence: 'High' | 'Medium' | 'Low';
    }>;
    red_flags: Array<{
        severity: 'Critical' | 'High' | 'Medium' | 'Low';
        flag: string;
        recommendation: string;
    }>;
    investment_recommendation: {
        verdict: 'Buy' | 'Watch' | 'Pass';
        confidence: number; // 0-100
        reasoning: string;
    };
    processing_time_ms?: number;
}

export async function generateCompanyAnalysis(companyData: any): Promise<AIAnalysisResult> {
    const startTime = Date.now();

    const systemPrompt = `You are an expert VC analyst specializing in African startups. 
    Analyze the provided company data and return a JSON object with the following structure:
    {
        "executive_summary": "2-3 sentences max",
        "key_strengths": [{"category": "Market/Team/Product", "point": "...", "confidence": "High/Medium/Low"}],
        "red_flags": [{"severity": "Critical/High/Medium/Low", "flag": "...", "recommendation": "..."}],
        "investment_recommendation": {"verdict": "Buy/Watch/Pass", "confidence": 0-100, "reasoning": "..."}
    }
    Strictly enforce this JSON structure. Do not hallucinate data not present in the input context.
    If data is missing, note it as a risk.`;

    try {
        const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Analyze this company: ${JSON.stringify(companyData)}` }
            ],
            temperature: 0.3, // Low temperature for analytical consistency
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("Empty response from AI");

        const result = JSON.parse(content) as AIAnalysisResult;
        result.processing_time_ms = Date.now() - startTime;

        return result;

    } catch (error) {
        console.error("AI Analysis Failed:", error);
        throw error;
    }
}
