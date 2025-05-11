import React, { useState } from "react";
import {
  FaFilePdf,
  FaFileCsv,
  FaFileExcel,
  FaCloudDownloadAlt,
} from "react-icons/fa";
import {
  exportToPdf,
  exportToCsv,
  exportToGoogleSheets,
} from "../utils/exportUtils";

export default function ExportOptions({ data, filename = "payout-report" }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState(null);

  const handleExport = async (type) => {
    setIsExporting(true);
    setExportType(type);

    try {
      switch (type) {
        case "pdf":
          await exportToPdf(data, filename);
          break;
        case "csv":
          exportToCsv(data, filename);
          break;
        case "sheets":
          await exportToGoogleSheets(data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error exporting as ${type}:`, error);
      alert(`Failed to export as ${type}. Please try again.`);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Export Payout Report</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleExport("pdf")}
          disabled={isExporting}
          className={`flex items-center justify-center p-4 rounded-lg border border-gray-200 
            ${
              isExporting && exportType === "pdf"
                ? "bg-gray-100"
                : "hover:bg-gray-50"
            }`}
        >
          <FaFilePdf className="text-red-600 mr-2 text-xl" />
          <span className="font-medium">
            {isExporting && exportType === "pdf"
              ? "Exporting..."
              : "Export as PDF"}
          </span>
        </button>

        <button
          onClick={() => handleExport("csv")}
          disabled={isExporting}
          className={`flex items-center justify-center p-4 rounded-lg border border-gray-200 
            ${
              isExporting && exportType === "csv"
                ? "bg-gray-100"
                : "hover:bg-gray-50"
            }`}
        >
          <FaFileCsv className="text-green-600 mr-2 text-xl" />
          <span className="font-medium">
            {isExporting && exportType === "csv"
              ? "Exporting..."
              : "Export as CSV"}
          </span>
        </button>

        <button
          onClick={() => handleExport("sheets")}
          disabled={isExporting}
          className={`flex items-center justify-center p-4 rounded-lg border border-gray-200 
            ${
              isExporting && exportType === "sheets"
                ? "bg-gray-100"
                : "hover:bg-gray-50"
            }`}
        >
          <FaFileExcel className="text-blue-600 mr-2 text-xl" />
          <span className="font-medium">
            {isExporting && exportType === "sheets"
              ? "Exporting..."
              : "Export to Google Sheets"}
          </span>
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-500 flex items-center">
        <FaCloudDownloadAlt className="mr-1" />
        Data is exported as seen in the current view with applied filters
      </div>
    </div>
  );
}
