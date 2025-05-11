// utils/exportUtils.js
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import Papa from "papaparse";

// Helper function to format date
const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch (e) {
    return "Invalid date";
  }
};

// Export data to PDF
export const exportToPdf = async (data, filename = "payout-report") => {
  // Create new PDF document
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text("Payout Report", 14, 22);

  // Add generation date
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), "MMM dd, yyyy HH:mm")}`, 14, 30);

  // Prepare table data
  const tableData = data.map((item) => [
    item.title || "N/A",
    item.author || "N/A",
    item.type || "N/A",
    formatDate(item.publishedAt),
    item.type === "news"
      ? `$${item.payoutRate?.news || 15}.00`
      : `$${item.payoutRate?.blog || 25}.00`,
  ]);

  // Calculate payout data
  const newsCount = data.filter((item) => item.type === "news").length;
  const blogCount = data.filter((item) => item.type === "blog").length;
  const newsRate = data[0]?.payoutRate?.news || 15;
  const blogRate = data[0]?.payoutRate?.blog || 25;
  const totalPayout = newsCount * newsRate + blogCount * blogRate;

  // Create table
  doc.autoTable({
    head: [["Title", "Author", "Type", "Date", "Rate"]],
    body: tableData,
    startY: 40,
    theme: "grid",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 133, 244] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  // Add summary after table
  const finalY = doc.previousAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text("Summary", 14, finalY);

  doc.setFontSize(10);
  doc.text(
    `News Articles: ${newsCount} × $${newsRate}.00 = $${
      newsCount * newsRate
    }.00`,
    14,
    finalY + 8
  );
  doc.text(
    `Blog Posts: ${blogCount} × $${blogRate}.00 = $${blogCount * blogRate}.00`,
    14,
    finalY + 16
  );

  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text(`Total Payout: $${totalPayout.toFixed(2)}`, 14, finalY + 28);

  // Save PDF
  doc.save(`${filename}.pdf`);

  return true;
};

// Export data to CSV
export const exportToCsv = (data, filename = "payout-report") => {
  // Prepare data for CSV format
  const csvData = data.map((item) => ({
    Title: item.title || "N/A",
    Description: item.description || "N/A",
    Author: item.author || "N/A",
    Source: item.source?.name || "N/A",
    Type: item.type || "N/A",
    Date: formatDate(item.publishedAt),
    Rate:
      item.type === "news"
        ? `$${item.payoutRate?.news || 15}.00`
        : `$${item.payoutRate?.blog || 25}.00`,
  }));

  // Convert data to CSV string
  const csv = Papa.unparse(csvData);

  // Create blob and download link
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Create temporary download link
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);

  // Trigger download and clean up
  link.click();
  document.body.removeChild(link);

  return true;
};

// Export to Google Sheets (this would typically require OAuth2 authentication)
// This is a simplified mock implementation
export const exportToGoogleSheets = async (data) => {
  // In a real implementation, you would:
  // 1. Use the Google Sheets API client library
  // 2. Authenticate with OAuth2
  // 3. Create or open a spreadsheet
  // 4. Write data to the spreadsheet

  // For this example, we'll just simulate a delay and return success
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Output to console for demonstration
  console.log("Data that would be exported to Google Sheets:", data);

  alert(
    "Export to Google Sheets completed successfully! (Note: This is a simulated export for demonstration purposes)"
  );

  return true;
};

// Helper function to add payout rates to articles
export const addPayoutRatesToData = (articles, payoutRates) => {
  return articles.map((article) => ({
    ...article,
    payoutRate: payoutRates,
  }));
};
