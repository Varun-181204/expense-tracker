import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPDF = (dashboard) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Expense Tracker Report", 14, 20);

  doc.setFontSize(12);

  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-IN")}`,
    14,
    30
  );

  autoTable(doc, {
    startY: 40,
    head: [["Field", "Value"]],
    body: [
      ["Total Income", `₹${dashboard.totalIncome.toLocaleString("en-IN")}`],
      ["Total Expense", `₹${dashboard.totalExpense.toLocaleString("en-IN")}`],
      ["Balance", `₹${dashboard.balance.toLocaleString("en-IN")}`],
      ["Transactions", dashboard.transactionCount],
    ],
  });

  doc.save("Expense_Report.pdf");
};