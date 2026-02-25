import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a precise invoice data extraction engine.

Your task: Extract all structured data from the provided document and return ONLY a valid JSON object.

STRICT RULES:
- Return ONLY raw JSON. No markdown, no code fences, no explanation, no preamble.
- Use null for any field not found in the document.
- Do not infer or hallucinate values. Only extract what is explicitly present.
- Numbers must be numeric types (not strings). Dates must be ISO 8601 strings.

OUTPUT SCHEMA:
{
  "invoice_number": string | null,
  "invoice_date": string | null,
  "due_date": string | null,
  "vendor": {
    "name": string | null,
    "address": string | null,
    "email": string | null,
    "phone": string | null,
    "tax_id": string | null
  },
  "bill_to": {
    "name": string | null,
    "address": string | null,
    "email": string | null
  },
  "line_items": [
    {
      "description": string,
      "quantity": number,
      "unit_price": number,
      "total": number
    }
  ],
  "subtotal": number | null,
  "discount": number | null,
  "tax": {
    "rate": number | null,
    "amount": number | null
  },
  "total_amount": number | null,
  "currency": string | null,
  "payment_terms": string | null,
  "notes": string | null
}`;

export async function POST(req: Request) {
    try {
        const { documentText } = await req.json();

        if (!documentText) {
            return NextResponse.json({ error: true, message: "Missing documentText" }, { status: 400 });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                error: true,
                message: "Missing OPENAI_API_KEY. Please add your OPENAI_API_KEY to your .env.local file to enable the AI Invoice Parser."
            }, { status: 500 });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: documentText }
                ],
                temperature: 0,
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const content = data.choices[0].message.content;

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(content);
        } catch (e) {
            jsonResponse = { rawOutput: content, error: true, message: "Failed to parse OpenAI response as JSON" };
        }

        return NextResponse.json(jsonResponse);

    } catch (error: any) {
        console.error("AI Extraction Error:", error);
        return NextResponse.json({ error: true, message: error.message || "Failed to extract data" }, { status: 500 });
    }
}
