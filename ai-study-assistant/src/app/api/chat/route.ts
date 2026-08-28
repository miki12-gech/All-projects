import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, context } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    // AIው እንዲከተለው የምንሰጠው ጥብቅ መመሪያ
    const systemInstruction = `You are a professional Academic Assistant. 
    Your primary goal is to help students understand their study materials.

    STRICT RULES:
    1. LANGUAGE MATCH: You MUST respond in the same language as the user. If the user asks in English, answer in English. If the user asks in Amharic, answer in natural, fluent Amharic.
    2. CONTEXT FIRST: If a DOCUMENT CONTEXT is provided below, use it as your primary source of truth.
    3. NO HALLUCINATION: Do not invent names, dates, or facts. If the information is not in the document, say "I couldn't find this specific detail in the uploaded document."
    4. STRUCTURE: Use headings, bold text, and bullet points for clarity.

    DOCUMENT CONTEXT:
    ${context ? context : "No document provided. Answer based on your general knowledge but prioritize accuracy."}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.1, // ዝቅተኛ ቁጥር AIው በትክክለኛው መረጃ ላይ ብቻ እንዲያተኩር ያደርገዋል
        max_tokens: 2048,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return NextResponse.json({ message: data.choices[0].message.content });
  } catch (error: any) {
    console.error("Chat API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}