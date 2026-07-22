import api from "./api";

export const getCategorySummary = async () => {
  const response = await api.get("/transactions/category-summary");
  return response.data;
};