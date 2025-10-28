import { apiClient } from "@/lib/api/api";

export const getAllCategories = async () => {
    try {
        const response = await apiClient.get('/api/v1/categories/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};