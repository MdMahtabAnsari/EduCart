import { apiClient } from "@/lib/api/api";
import { CourseSchemaFrontEnd } from "@/lib/schema/course";

export const createCourse = async (courseData: CourseSchemaFrontEnd) => {
    try {
        const response = await apiClient.post('/api/v1/teacher/courses/create', courseData);
        return response.data;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
};

export const getCourse = async (courseId: string) => {
    try {
        const response = await apiClient.get(`/api/v1/teacher/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching course:', error);
        throw error;
    }
};
