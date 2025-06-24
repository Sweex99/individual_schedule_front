import apiClient from "../unitilies/axiosClient";

export const getTeacherTemplates = async () => {
  try {
    const response = await apiClient.get("/templates");
    return response.data;
  } catch (error) {
  }
};

export const saveTemplate = async (newTemplate: { title: string; text: string }) => {
  try {
    const response = await apiClient.post("/templates", newTemplate);
    return response.data;
  } catch (error) {
  }
};