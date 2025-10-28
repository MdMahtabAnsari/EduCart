import { apiClient } from "@/lib/api/api";


export const getAllTags = async () => {
    try {
        const response = await apiClient.get('/api/v1/tags/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
    }
};
