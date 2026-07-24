import api from "./api";

export const getAnalytics = async () => {
  const response = await api.get("/transactions/analytics");
  return response.data;
};