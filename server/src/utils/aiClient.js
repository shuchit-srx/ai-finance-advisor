import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;
if (process.env.GEMINI_API_KEY) {
    try {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    } catch (e) {
        console.warn("Failed to initialize Gemini client:", e?.message || e);
        genAI = null;
    }
}

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
        summaryText: `You spent approximately ₹${Math.round(total)} in the selected range. Top categories: ${top.join(", ") || "none"}.`,
        topCategories: top,
        cutSuggestions: top.length ? `Consider trimming ${top.slice(0, 2).join(", ")} and review subscriptions.` : `No clear suggestions.`,
        savingGoal: Math.round(total * 0.15),
    };
};

export const getSpendingAnalysis = async (transactions) => {
    if (!genAI) return fallback(transactions);

    const recent = transactions.slice(-60).map(t => ({
        date: t.date ? new Date(t.date).toISOString().split("T")[0] : "",
        description: t.description || "",
        amount: Number(t.amount || 0),
        category: t.category || "",
    }));

    const prompt = `
Given the following JSON array of user transactions, output a JSON object with keys:
{"summaryText": string, "topCategories": [string], "cutSuggestions": string, "savingGoal": number}
Transactions: ${JSON.stringify(recent, null, 2)}
Respond ONLY with valid JSON (no extra text).
`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-mini" }); // pick available model
        const result = await model.generateContent(prompt);
        const raw = (await result.response.text()).trim();
        const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return {
            summaryText: parsed.summaryText || "",
            topCategories: Array.isArray(parsed.topCategories) ? parsed.topCategories : [],
            cutSuggestions: parsed.cutSuggestions || "",
            savingGoal: typeof parsed.savingGoal === "number" ? parsed.savingGoal : 0,
        };
    } catch (err) {
        console.warn("Gemini parse/response error, falling back:", err?.message || err);
        return fallback(transactions);
    }
};

export default { getSpendingAnalysis };
