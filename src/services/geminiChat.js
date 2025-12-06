const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const chatWithGemini = async (userMessage, history = []) => {
    if (!API_KEY) return "Error: Gemini API Key is missing. Please check .env file.";

    const modelsToTry = ["gemini-1.5-flash", "gemini-pro"];

    // Construct prompt with history context
    const contents = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    // Add current message
    contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
    });

    // Add System Instruction
    const systemInstruction = `You are 'Jansamvaad Sahayak', a helpful AI assistant for the Jansamvaad civic platform.
    Your goal is to help citizens file grievances, find their MLAs, and answer questions about the platform.
    Be polite, concise, and helpful.`;

    if (contents.length > 0) {
        contents[0].parts[0].text = systemInstruction + "\n\n" + contents[0].parts[0].text;
    }

    // Try models in sequence
    for (const model of modelsToTry) {
        try {
            console.log(`Chatbot attempting model: ${model}`);
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents })
            });

            if (response.ok) {
                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond to that.";
            }

            if (response.status === 404 || response.status === 503) {
                console.warn(`Chatbot: Model ${model} failed (${response.status}). Retrying...`);
                continue;
            }

            const err = await response.json();
            console.error("Gemini Chat Error:", err);
            return "Sorry, I'm encountering a technical issue.";

        } catch (error) {
            console.error(`Chatbot Network Error (${model}):`, error);
        }
    }

    return "Sorry, I am unable to connect to the AI service right now. Please try again later.";
};
