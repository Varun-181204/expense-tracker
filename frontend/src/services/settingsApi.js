import API from "./api";

export const changePassword = async (passwordData) => {

    const response = await API.put(
        "/auth/change-password",
        passwordData
    );

    return response.data;

};