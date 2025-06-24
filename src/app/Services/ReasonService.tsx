import apiClient from "../unitilies/axiosClient";

export const getReasons = async () => {
  try {
    const response = await apiClient.get("/reasons");
    return response.data;
  } catch (error) {
  }
};

export const updateReason = async (reasonId: number, data: any) => {
  try {
    const response = await apiClient.patch(`/reasons/${reasonId}`, data);
    return response.data;
  } catch (error) {
  }
};

export const createReason = async ( data: any) => {
  try {
    const response = await apiClient.post("/reasons", data);
    return response.data;
  } catch (error) {
  }
};

