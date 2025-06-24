import apiClient from "../unitilies/axiosClient";

export const getNotifications = async () => {
  try {
    const response = await apiClient.get("/notifications");
    return response.data;
  } catch (error) {
  }
};

export const markNotificationAsRead = async (id: number) => {
  try {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
  }
};
