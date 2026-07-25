import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const uploadProfileImage = async (formData) => {
  const response = await api.put(
    "/auth/profile/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};