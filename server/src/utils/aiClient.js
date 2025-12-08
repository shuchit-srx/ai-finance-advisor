import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getSpendingAnalysis = async (transactions) => {
    // Limit to recent N transactions to keep prompt size sane
    const recent = transactions.slice(-60).map((t) => ({
        date: t.date.toISOString().split("T")[0],
        description: t.description,
        amount: t.amount,
        category: t.category,
    }));

    const prompt = `
You are a precise personal finance analysis system.

Given the following JSON array of user transactions, analyse the user's spending.

Transactions:
${JSON.stringify(recent, null, 2)}

You MUST respond ONLY with a valid JSON object in this exact shape:

{
  "summaryText": "2-3 sentences summarizing the spending pattern",
  "topCategories": ["category1", "category2", "category3"],
  "cutSuggestions": "short paragraph suggesting where to reduce spending",
  "savingGoal": 12345.67
}

Rules:
- Do NOT include any extra keys.
- Do NOT include any explanations or commentary outside the JSON.
- "savingGoal" must be a number (no currency symbols).`;

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    // Clean common formatting like ```json ... ```
    const cleaned = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    try {
        const parsed = JSON.parse(cleaned);

        // Minimal sanity checks in case the model gets "creative"
        return {
            summaryText: parsed.summaryText || "",
            topCategories: Array.isArray(parsed.topCategories)
                ? parsed.topCategories
                : [],
            cutSuggestions: parsed.cutSuggestions || "",
            savingGoal:
                typeof parsed.savingGoal === "number" && !Number.isNaN(parsed.savingGoal)
                    ? parsed.savingGoal
                    : 0,
        };
    } catch (err) {
        console.error("Failed to parse Gemini response:", rawText);
        throw new Error("AI returned invalid JSON");
    }
};
