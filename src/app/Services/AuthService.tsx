import apiClient from "../unitilies/axiosClient";

export const loginAPI = async () => {
  try {
    const data = await apiClient.get("/users/saml/sign_in");
    return data;
  } catch (error) {
  }
};

export const acceptUserAPI = async (
  token: string
) => {
  try {
    const data = await apiClient.get("/users/accepted", { headers: { "Authorization": `Bearer ${token}` }})
    return data;
  } catch (error) {
    console.log('Went something wront')
  }
};
