import * as XLSX from "xlsx";

export const exportExcel = (dashboard) => {

  const report = [
    {
      Income: dashboard.totalIncome,
      Expense: dashboard.totalExpense,
      Balance: dashboard.balance,
      Transactions: dashboard.transactionCount,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(report);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Report"
  );

  XLSX.writeFile(
    workbook,
    "Expense_Report.xlsx"
  );
};