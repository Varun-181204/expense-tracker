// Format amount into localized currency
export const formatCurrency = (amount, currency = "₹") => {
  const num = Number(amount) || 0;
  return `${currency}${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Format ISO date string into readable Date (e.g., "12 Oct 2026")
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Format Date object into YYYY-MM-DD for HTML date inputs
export const formatDateInput = (date = new Date()) => {
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  const year = d.getFullYear();
  return [year, month, day].join("-");
};

// Format month and year label (e.g., "October 2026")
export const formatMonthYear = (month, year) => {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
};
