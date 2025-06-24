import apiClient from "../unitilies/axiosClient";

export const getGroups = async () => {
  try {
    const response = await apiClient.get("/groups");
    return response.data;
  } catch (error) {
  }
};

export const updateGroup = async (groupId: number, data: any) => {
  try {
    const response = await apiClient.patch(`/groups/${groupId}`, data);
    return response.data;
  } catch (error) {
  }
};

export const createGroup = async ( data: any) => {
  try {
    const response = await apiClient.post("/groups", data);
    return response.data;
  } catch (error) {
  }
};


