const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Helper to clean JSON
const cleanJSON = (text) => {
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

const callGemini = async (prompt) => {
    if (!API_KEY) return { error: "Missing API Key in .env" };

    const modelsToTry = ["gemini-1.5-flash", "gemini-pro"];

    for (const model of modelsToTry) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                return { text: text || null };
            }

            // If 404 (Model not found) or 503 (Overloaded), try next model
            if (response.status === 404 || response.status === 503) {
                console.warn(`Model ${model} failed with ${response.status}. Trying fallback...`);
                continue;
            }

            // For other errors (400, 403), fail immediately
            const err = await response.json();
            const errMsg = err.error?.message || response.statusText;
            console.error("Gemini API Error:", errMsg);
            return { error: `API Error (${model}): ${errMsg}` };

        } catch (error) {
            console.error(`Network Error with ${model}:`, error);
            // Verify if we should continue or return generic network error
            if (model === modelsToTry[modelsToTry.length - 1]) {
                return { error: `Network Error: ${error.message}` };
            }
        }
    }

    return { error: "All AI models failed. Please check API Key or Quota." };
};

export const getConstituencyDetails = async (pincode) => {
    const prompt = `You are an Indian election data expert. Given a PIN Code, identify the primary Assembly Constituency (MLA) and Parliamentary Constituency (MP) for that area.
    Return ONLY a JSON object: { "area": "City/Locality Name", "mla": "Current MLA Name (Party)", "mp": "Current MP Name (Party)" }.
    If the PIN covers multiple areas, pick the most prominent one.
    If the PIN is invalid or non-Indian, return { "area": "Unknown", "mla": "Unknown", "mp": "Unknown" }.
    PIN Code: ${pincode}`;

    const result = await callGemini(prompt);

    if (result.error) {
        return { error: result.error };
    }

    if (!result.text) {
        return { area: "Manual Entry Required", mla: "Not Found", mp: "Not Found" };
    }

    try {
        return JSON.parse(cleanJSON(result.text));
    } catch (e) {
        return { area: "Manual Entry Required", mla: "Not Found", mp: "Not Found" };
    }
};

export const validateComplaint = async (text) => {
    const prompt = `You are an AI assistant for a civic grievance platform 'Jansamvaad'. 
    Your job is to validate if a user's input is a legitimate grievance or suggestion.
    Return ONLY a JSON object: { "isValid": boolean, "category": string, "feedback": string }.
    Categories: Infrastructure, Health, Education, Water, Electricity, Sanitation, Other.
    Complaint: ${text}`;

    const result = await callGemini(prompt);

    // Fallback if AI fails
    if (result.error || !result.text) {
        return { isValid: true, category: "Uncategorized", feedback: "AI unavailable." };
    }

    try {
        return JSON.parse(cleanJSON(result.text));
    } catch (e) {
        return { isValid: true, category: "Uncategorized", feedback: "AI unavailable." };
    }
};

export const generateDraftResponse = async (grievanceText, category) => {
    const prompt = `You are an assistant to an MLA/MP. Draft a polite, professional response (under 100 words) to this grievance:
    Category: ${category}
    Grievance: ${grievanceText}`;

    const result = await callGemini(prompt);
    return result.text || "Thank you for the feedback. We are looking into it.";
};
