import api from "./api";

// Get Current Budget
export const getBudget = async () => {
  const response = await api.get("/budget");
  return response.data;
};

// Set / Update Budget
export const setBudget = async (budgetData) => {
  const response = await api.post("/budget", budgetData);
  return response.data;
};