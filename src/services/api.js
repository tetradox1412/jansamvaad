const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const submitGrievance = async (grievanceData) => {
    try {
        const response = await fetch(`${API_URL}/grievances`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(grievanceData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit grievance');
        }

        return await response.json();
    } catch (error) {
        console.error("API Error (Submit):", error);
        throw error;
    }
};

export const getGrievances = async (filters = {}) => {
    try {
        // Construct query string
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams ? `${API_URL}/grievances?${queryParams}` : `${API_URL}/grievances`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch grievances');
        }

        return await response.json();
    } catch (error) {
        console.error("API Error (Get):", error);
        throw error;
    }
};
export const getStats = async (pincode) => {
    try {
        const response = await fetch(`${API_URL}/stats/${pincode}`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        return await response.json();
    } catch (error) {
        // console.error("API Error (Stats):", error); // Optional: ensure this endpoint exists
        return { active: 0, resolved: 0 }; // Fallback to avoid crashing UI if endpoint missing
    }
};
