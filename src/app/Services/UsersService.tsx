import apiClient from "../unitilies/axiosClient";

export const getTeachers = async (s: string) => {
  try {
    const response = await apiClient.get(`/teachers?search=${s}`);
    return response.data;
  } catch (error) {
  }
};

export const getUsers = async () => {
  try {
    const response = await apiClient.get(`/users`);
    return response.data;
  } catch (error) {
  }
};

export const updateUser = async (userId: number, data: any) => {
  try {
    const response = await apiClient.patch(`/users/${userId}`, data);
    return response.data;
  } catch (error) {
  }
};

