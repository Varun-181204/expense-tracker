import API from "./api";

export const getCategorySummary = async () => {

    const response = await API.get("/transactions/category-summary");

    return response.data;

};