import api from "./api";

export const getBudgetSummary = async (month, year) => {
  const params = {};
  if (month) params.month = month;
  if (year) params.year = year;
  const response = await api.get("/budget", { params });
  return response.data;
};

export const setOverallBudget = async (data) => {
  const response = await api.post("/budget", data);
  return response.data;
};

export const setCategoryBudget = async (data) => {
  const response = await api.post("/budget/category", data);
  return response.data;
};

export const deleteBudget = async (id) => {
  const response = await api.delete(`/budget/${id}`);
  return response.data;
};
