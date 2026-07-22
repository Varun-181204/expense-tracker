import api from "./api";

export const getDashboard = async () => {
  const response = await api.get("/transactions/summary");
  return response.data;
};