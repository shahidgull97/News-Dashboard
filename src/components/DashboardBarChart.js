"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const initialData = [
  { name: "News", value: 0 },
  { name: "Sport", value: 0 },
  { name: "Education", value: 0 },
  { name: "Travel", value: 0 },
  { name: "Food", value: 0 },
  { name: "Business", value: 0 },
  { name: "Environment", value: 0 },
  { name: "Historical", value: 0 },
  { name: "Science", value: 0 },
  { name: "Technology", value: 0 },
  { name: "Arts", value: 0 },
  { name: "Features", value: 0 },
];

export default function DashboardBarChart({ articles }) {
  // Sample data - replace with your actual data
  const [data, setData] = useState(initialData);
  console.log("dashboard articles", articles);

  useEffect(() => {
    const updatedData = initialData.map((category) => {
      const count = articles.filter(
        (article) =>
          article.pillarName?.toLowerCase() === category.name.toLowerCase()
      ).length;

      return {
        ...category,
        value: count,
      };
    });

    setData(updatedData);
  }, [articles]);

  // Simulated data loading/refreshing
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [viewOption, setViewOption] = useState("monthly");
  const title = "Performance Metrics";
  // Filter data based on view option
  //   const getFilteredData = () => {
  //     switch (viewOption) {
  //       case "quarterly":
  //         return [
  //           {
  //             name: "Q1",
  //             value:
  //               data.slice(0, 3).reduce((sum, item) => sum + item.value, 0) / 3,
  //           },
  //           {
  //             name: "Q2",
  //             value:
  //               data.slice(3, 6).reduce((sum, item) => sum + item.value, 0) / 3,
  //           },
  //           {
  //             name: "Q3",
  //             value:
  //               data.slice(6, 9).reduce((sum, item) => sum + item.value, 0) / 3,
  //           },
  //           {
  //             name: "Q4",
  //             value:
  //               data.slice(9, 12).reduce((sum, item) => sum + item.value, 0) / 3,
  //           },
  //         ];
  //       case "halfYear":
  //         return [
  //           {
  //             name: "H1",
  //             value:
  //               data.slice(0, 6).reduce((sum, item) => sum + item.value, 0) / 6,
  //           },
  //           {
  //             name: "H2",
  //             value:
  //               data.slice(6, 12).reduce((sum, item) => sum + item.value, 0) / 6,
  //           },
  //         ];
  //       default:
  //         return data;
  //     }
  //   };

  const filteredData = data;

  // Handle bar hover
  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Simulate data refresh
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      const newData = data.map((item) => ({
        ...item,
        value: Math.floor(Math.random() * 5000) + 1000,
      }));
      setData(newData);
      setLoading(false);
    }, 800);
  };

  // Bar colors and gradients
  const getBarColor = (index) => {
    const isActive = activeIndex === index;
    const baseColors = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"];
    const color = baseColors[index % baseColors.length];
    return isActive ? "#60A5FA" : color; // Highlight on hover
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-md p-3 rounded-lg shadow-lg border border-indigo-100">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-indigo-600 font-semibold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "IND",
              minimumFractionDigits: 0,
            }).format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[65vh] mb-2.5 bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Performance metrics across time periods
          </p>
        </div>

        {/* Controls */}
        <div className="mt-3 md:mt-0 flex items-center space-x-2">
          <div className="flex rounded-lg overflow-hidden bg-gray-100 p-1">
            <button
              onClick={() => setViewOption("monthly")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                viewOption === "monthly"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setViewOption("quarterly")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                viewOption === "quarterly"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setViewOption("halfYear")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                viewOption === "halfYear"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Half Year
            </button>
          </div>

          <button
            onClick={refreshData}
            disabled={loading}
            className={`flex items-center justify-center p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 
                      transition text-indigo-600 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            barSize={
              viewOption === "monthly"
                ? 20
                : viewOption === "quarterly"
                ? 40
                : 60
            }
          >
            <defs>
              {Array.from({ length: 5 }).map((_, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`barGradient${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.8} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              width={40}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(224, 231, 255, 0.2)" }}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              animationDuration={1500}
            >
              {filteredData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#barGradient${index % 5})`}
                  filter={
                    activeIndex === index
                      ? "drop-shadow(0px 4px 6px rgba(79, 70, 229, 0.4))"
                      : "none"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Last updated: Today at {new Date().toLocaleTimeString()}
        </div>
        <div className="flex space-x-1">
          <div className="h-2 w-2 rounded-full bg-green-400"></div>
          <div className="text-xs text-gray-600 font-medium">Live Data</div>
        </div>
      </div>
    </div>
  );
}
