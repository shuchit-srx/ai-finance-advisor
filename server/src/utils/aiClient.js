import { GoogleGenerativeAI } from "@google/generative-ai";

// Fallback logic (runs if AI fails or key is missing)
const fallback = (transactions) => {
    const total = transactions.reduce((s, t) => s + Math.abs(Number(t.amount || 0)), 0);
    const byCat = {};
    for (const t of transactions) {
        const c = (t.category || "others").toLowerCase();
        byCat[c] = (byCat[c] || 0) + Math.abs(Number(t.amount || 0));
    }
    const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 3).map(([c]) => c);
    
    return {
        summaryText: `You spent approximately ₹${Math.round(total)} recently. Top categories: ${top.join(", ") || "none"}.`,
        topCategories: top,
        cutSuggestions: top.length ? `Consider trimming ${top.slice(0, 2).join(", ")}.` : `No clear suggestions.`,
        savingGoal: Math.round(total * 0.15),
    };
};

export const getSpendingAnalysis = async (transactions, userQuery = "") => {
    // 1. Initialize Client INSIDE the function to ensure env vars are ready
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("⚠️ GEMINI_API_KEY is missing. Using fallback.");
        return fallback(transactions);
    }

    let genAI;
    try {
        genAI = new GoogleGenerativeAI(apiKey);
    } catch (e) {
        console.error("Failed to initialize Gemini client:", e);
        return fallback(transactions);
    }

    // 2. Prepare Data (Limit to last 100 to save tokens)
    const recent = transactions.slice(-100).map(t => ({
        date: t.date ? new Date(t.date).toISOString().split("T")[0] : "Unknown Date",
        description: t.description || "No desc",
        amount: Number(t.amount || 0),
        category: t.category || "Uncategorized",
    }));

    const systemInstruction = `
    You are a friendly and astute financial advisor. 
    You have access to the user's recent transaction history (JSON array).
    
    Your Goal:
    1. Analyze the provided transactions.
    2. Address the USER QUERY specifically in the "summaryText" field.
       - If the user asks "How much spent on food?", calculate it and answer directly.
       - If the query is empty or generic (e.g., "analyze"), provide a helpful overview of spending habits.
    3. Populate the other JSON fields ("topCategories", "cutSuggestions", "savingGoal") based on the overall data, regardless of the query.
    
    Data:
    ${JSON.stringify(recent)}
    
    User Query: "${userQuery || "Please provide a general analysis of my spending."}"
    
    Output Format:
    Respond ONLY with a raw JSON object (no markdown, no backticks) with these keys:
    {
      "summaryText": "string (The direct answer to the user query)",
      "topCategories": ["string", "string", "string"],
      "cutSuggestions": "string (Actionable advice)",
      "savingGoal": number (Recommended saving amount)
    }
    `;

    try {
        // 3. Use the correct model name
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", // Corrected from 2.5-flash
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(systemInstruction);
        const raw = result.response.text();
        const cleaned = raw.replace(/```json|```/gi, "").trim();
        const parsed = JSON.parse(cleaned);

        return {
            summaryText: parsed.summaryText || "Analysis complete.",
            topCategories: Array.isArray(parsed.topCategories) ? parsed.topCategories : [],
            cutSuggestions: parsed.cutSuggestions || "Review your recent expenses.",
            savingGoal: typeof parsed.savingGoal === "number" ? parsed.savingGoal : 0,
        };
    } catch (err) {
        console.warn("Gemini parse/response error, falling back:", err?.message || err);
        return fallback(transactions);
    }
};

export default { getSpendingAnalysis };