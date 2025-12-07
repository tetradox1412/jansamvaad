const API_URL = '/api';

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
            let errorMessage = 'Failed to submit grievance';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                // If JSON parse fails, try text
                const text = await response.text();
                errorMessage = text || `Server Error: ${response.status}`;
            }
            throw new Error(errorMessage);
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
        return { active: 0, resolved: 0 }; // Fallback to avoid crashing UI if endpoint missing
    }
};

export const resolveGrievance = async (id) => {
    try {
        const response = await fetch(`${API_URL}/grievances/${id}/resolve`, {
            method: 'PATCH',
        });

        if (!response.ok) {
            throw new Error('Failed to resolve grievance');
        }

        return await response.json();
    } catch (error) {
        console.error("API Error (Resolve):", error);
        throw error;
    }
};
