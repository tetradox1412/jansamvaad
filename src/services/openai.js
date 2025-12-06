const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Helper to sanitize JSON
const parseJSON = (text) => {
    try {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("JSON Parse Error", e);
        return null;
    }
};

export const getConstituencyDetails = async (pincode) => {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are an Indian election data expert. Given a PIN Code, identify the primary Assembly Constituency (MLA) and Parliamentary Constituency (MP) for that area.
              Return a JSON object: { "area": "City/Locality Name", "mla": "Current MLA Name (Party)", "mp": "Current MP Name (Party)" }.
              If the PIN covers multiple areas, pick the most prominent one.
              If the PIN is invalid or non-Indian, return { "area": "Unknown", "mla": "Unknown", "mp": "Unknown" }.`
                    },
                    { role: "user", content: `PIN Code: ${pincode}` }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const content = data.choices[0].message.content;
        const result = parseJSON(content);

        return result || { area: "Unknown", mla: "Unknown", mp: "Unknown" };
    } catch (error) {
        console.error("OpenAI Constituency Lookup Error:", error);
        return { area: "Manual Entry Required", mla: "Not Found", mp: "Not Found" };
    }
};

export const validateComplaint = async (text) => {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are an AI assistant for a civic grievance platform 'Jansamvaad'. 
              Your job is to validate if a user's input is a legitimate grievance or suggestion.
              Return a JSON object: { "isValid": boolean, "category": string, "feedback": string }.`
                    },
                    { role: "user", content: text }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const result = parseJSON(data.choices[0].message.content);
        return result || { isValid: true, category: "Uncategorized", feedback: "AI unavailable." };
    } catch (error) {
        console.error("OpenAI Validation Error:", error);
        return { isValid: true, category: "Uncategorized", feedback: "AI validation unavailable." };
    }
};

export const generateDraftResponse = async (grievanceText, category) => {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are an assistant to an MLA/MP. Draft a polite response (under 100 words).`
                    },
                    {
                        role: "user",
                        content: `Category: ${category}\nGrievance: ${grievanceText}`
                    }
                ]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI Drafting Error:", error);
        return "Thank you for bringing this to our attention. We are looking into it.";
    }
};

export const chatWithAI = async (userMessage, history = []) => {
    try {
        const messages = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));

        messages.push({ role: "user", content: userMessage });
        messages.unshift({
            role: "system",
            content: `You are 'Jansamvaad Sahayak', a helpful AI assistant for the Jansamvaad civic platform.
            
            **Platform Overview:**
            Jansamvaad connects citizens with their MLAs/MPs to resolve civic issues efficiently.
            
            **How it works (Citizen Guide):**
            1. **Identify Representative:** Enter your PIN Code, and the system automatically finds your MLA and MP.
            2. **File Grievance:** Describe your issue (e.g., water, roads), select a category, and optionally upload a photo.
            3. **Submit:** Your complaint is securely stored and sent directly to your representative's office.
            4. **Resolution:** The authorities review your issue and take action.
            
            **Guidelines:**
            - specific technical details (like databases, cloud providers, or internal admin dashboards) are confidential. 
            - Focus ONLY on the citizen's experience: filing, tracking, and resolving.
            - If asked about data, assure them it is secure and accessible only by their elected representatives.
            - Be polite, concise, and helpful.`
        });

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: messages
            })
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "I'm having trouble thinking of a response.";
    } catch (error) {
        console.error("OpenAI Chat Error:", error);
        return "Sorry, I am unable to connect to the AI service right now. Please try again later.";
    }
};
