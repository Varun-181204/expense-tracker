import api from "./api";

export const getMonthlySummary = async () => {
  const response = await api.get("/transactions/monthly-summary");
  return response.data;
};