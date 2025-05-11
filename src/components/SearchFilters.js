import React, { useEffect, useState } from "react";
import { Search, Calendar, Filter, X } from "lucide-react";

export default function SearchFilters({ onSearch, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [type, setType] = useState("all");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Predefined date ranges
  const dateRanges = [
    { label: "Today", value: "today" },
    { label: "Last 7 days", value: "7days" },
    { label: "Last 30 days", value: "30days" },
    { label: "This month", value: "thisMonth" },
    { label: "This year", value: "thisYear" },
  ];

  const handleSearch = () => {
    onSearch && onSearch(searchTerm);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    onFilterChange &&
      onFilterChange({
        type: newType,
        dateRange,
      });
  };

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    setShowDatePicker(false);
    onFilterChange &&
      onFilterChange({
        type,
        dateRange: newRange,
      });
  };
  useEffect(() => {
    // Save filters to localStorage whenever they change
    clearFilters();
  }, []);
  const clearFilters = () => {
    setSearchTerm("");
    setDateRange("");
    setType("all");
    onFilterChange &&
      onFilterChange({
        type: "all",
        dateRange: "",
      });
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-200 h-20 to-gray-200 p-2 md:p-3 rounded-xl shadow-lg">
      <div className="flex items-center justify-between gap-2 md:gap-4">
        {/* Search Input */}
        <div className="relative flex-grow max-w-xs">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-blue-300" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search..."
            className="w-full py-2 pl-10 pr-4 bg-indigo-950 bg-opacity-50 text-white placeholder-blue-300 
                      border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 
                      text-sm backdrop-filter backdrop-blur-sm"
          />
        </div>

        {/* Type Filter Segment Control */}
        <div className="flex items-center bg-indigo-950 bg-opacity-50 rounded-lg border border-blue-700 overflow-hidden">
          <button
            type="button"
            onClick={() => handleTypeChange("all")}
            className={`px-3 py-2 text-xs md:text-sm transition-colors ${
              type === "all"
                ? "bg-blue-600 text-white"
                : "text-blue-300 hover:bg-indigo-800"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("article")}
            className={`px-3 py-2 text-xs md:text-sm transition-colors ${
              type === "news"
                ? "bg-blue-600 text-white"
                : "text-blue-300 hover:bg-indigo-800"
            }`}
          >
            News
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("liveblog")}
            className={`px-3 py-2 text-xs md:text-sm transition-colors ${
              type === "blog"
                ? "bg-blue-600 text-white"
                : "text-blue-300 hover:bg-indigo-800"
            }`}
          >
            Blog
          </button>
        </div>

        {/* Date Range Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-950 bg-opacity-50 border border-blue-700 
                      rounded-lg text-blue-300 hover:bg-indigo-800 focus:outline-none text-xs md:text-sm"
          >
            <Calendar size={16} />
            <span className="hidden md:inline">
              {dateRange
                ? dateRanges.find((d) => d.value === dateRange)?.label
                : "Date"}
            </span>
          </button>

          {showDatePicker && (
            <div
              className="absolute right-0 mt-2 w-48 bg-indigo-900 border border-blue-700 rounded-lg shadow-lg 
                          z-10 overflow-hidden backdrop-filter backdrop-blur-md"
            >
              {dateRanges.map((range) => (
                <button
                  key={range.value}
                  type="button"
                  onClick={() => handleDateRangeChange(range.value)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-800 transition-colors ${
                    dateRange === range.value
                      ? "bg-blue-600 text-white"
                      : "text-blue-200"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow transition-colors
                    flex items-center justify-center"
        >
          <Search size={16} />
        </button>

        {/* Clear Filters Button - Only show when filters are applied */}
        {(type !== "all" || dateRange) && (
          <button
            type="button"
            onClick={clearFilters}
            className="p-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-red-300 rounded-lg
                     flex items-center justify-center transition-colors"
            title="Clear filters"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {(type !== "all" || dateRange) && (
        <div className="flex items-center mt-2 text-xs text-blue-300">
          <Filter size={12} className="mr-2" />
          <span>Filters:</span>
          {type !== "all" && (
            <span className="ml-2 px-2 py-0.5 bg-blue-800 bg-opacity-50 rounded-full">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          )}
          {dateRange && (
            <span className="ml-2 px-2 py-0.5 bg-blue-800 bg-opacity-50 rounded-full">
              {dateRanges.find((d) => d.value === dateRange)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
