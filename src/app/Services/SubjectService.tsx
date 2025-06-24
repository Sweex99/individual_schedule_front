import apiClient from "../unitilies/axiosClient";

export const getAllSubjects = async (inputValue: string | undefined, requestId: number | undefined) => {
  try {
    var link = "/subjects?"
    link += requestId !== undefined ? `request_id=${requestId}&` : ""
    link += inputValue !== undefined ? `search=${inputValue}` : "" 

    const response = await apiClient.get(link);
    return response.data;
  } catch (error) {
  }
};

export const updateSubject = async (subjectId: number, data: any) => {
  try {
    const response = await apiClient.patch(`/subjects/${subjectId}`, data);
    return response.data;
  } catch (error) {
  }
};

export const createSubject = async (data: any) => {
  try {
    const response = await apiClient.post("/subjects", data);
    return response.data;
  } catch (error) {
  }
};
