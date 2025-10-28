import { apiClient } from "@/lib/api/api";
import { SectionSchema } from "@/lib/schema/section";

export const createSection = async (data: SectionSchema) => {
    try {
        const response = await apiClient.post('/api/v1/teacher/sections/create', data);
        return response.data;
    } catch (error) {
        console.error('Error creating section:', error);
        throw error;
    }
}