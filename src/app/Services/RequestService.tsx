import apiClient from "../unitilies/axiosClient";

export const SubmitRequest = async (data: FormData) => {
  try {
    const response = await apiClient.post("/requests", data);
    return response.data;
  } catch (error) {
  }
};

export const getActualRequest = async () => {
  try {
    const response = await apiClient.get("/requests/actual");
    return response.data;
  } catch (error) {
  }
};

export const getAllAdminRequests = async (state: string) => {
  try {
    const response = await apiClient.get(`/requests?state=${state}`);
    return response.data;
  } catch (error) {
  }
};

export const getAllTeacherRequests = async (state: string) => {
  try {
    const response = await apiClient.get(`/subjects_teachers?state=${state}`);
    return response.data;
  } catch (error) {
  }
}

export const getAllRequests = async () => {
  try {
    const response = await apiClient.get("/requests");
    return response.data;
  } catch (error) {
  }
};

export const setTeacherComment = async (subjectTeacherId: number, status: string, comment: string) => {
  var data = { state: status, comment: comment}
  try {
    const response = await apiClient.patch(`/subjects_teachers/${subjectTeacherId}`, data);
    return response.data;
  } catch (error) {
  }
};

export const SubmitTeacher = async (data: any) => {
  try {
    const response = await apiClient.post("/subjects_teachers", data);
    return response.data;
  } catch (error) {
  }
};

export const DeclineTeacher = async (id: number) => {
  try {
    const response = await apiClient.delete(`/subjects_teachers/${id}`);
    return response.data;
  } catch (error) {
  }
};

export const setStatus = async (requestId: number, data: string) => {
  var requestObject = { status: data }
  try {
    const response = await apiClient.patch(`/requests/update_status/${requestId}`, requestObject);
    return response.data;
  } catch (error) {
  }
};

export const getStatement = async (requestId: number) => {
  try {
    const response = await apiClient.get(`/requests/${requestId}/statement`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
  }
};

export const getBulkStatement = async (requestsIds: number[]) => {
  try {
    const response = await apiClient.get(`/requests/${requestsIds}/bulk_statement`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
  }
};

export const getRequestsList = async (requestsIds: number[]) => {
  try {
    const response = await apiClient.get(`/requests/${requestsIds}/requests_list_generate`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
  }
};
