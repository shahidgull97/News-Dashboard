import React, { useState, useEffect } from "react";
import { usePayoutContext } from "../contexts/PayoutContext";

export default function PayoutCalculator({ articleCounts }) {
  const { payoutRates, setPayoutRates, calculatePayout } = usePayoutContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showRateSettings, setShowRateSettings] = useState(false);
  const [tempRates, setTempRates] = useState({
    news: payoutRates.news,
    blog: payoutRates.blog,
  });

  useEffect(() => {
    // In a real app, you would check user role from the authentication
    // For this example, we'll simulate admin access
    setIsAdmin(true);
  }, []);

  const handleSaveRates = () => {
    setPayoutRates(tempRates);
    setShowRateSettings(false);
  };

  const articleTypeCount = {
    news: articleCounts.filter((a) => a.type === "article").length,
    blog: articleCounts.filter((a) => a.type === "liveblog").length,
  };

  const totalPayout = calculatePayout(articleTypeCount);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 mt-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-900">Payout Summary</h2>
        {isAdmin && (
          <button
            onClick={() => setShowRateSettings(!showRateSettings)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showRateSettings ? "Hide Rate Settings" : "Edit Rate Settings"}
          </button>
        )}
      </div>

      {showRateSettings && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium mb-3">Payout Rate Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                News Article Rate ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={tempRates.news}
                onChange={(e) =>
                  setTempRates({
                    ...tempRates,
                    news: parseFloat(e.target.value),
                  })
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blog Post Rate ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={tempRates.blog}
                onChange={(e) =>
                  setTempRates({
                    ...tempRates,
                    blog: parseFloat(e.target.value),
                  })
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleSaveRates}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Save Rates
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-300 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-gray-700">News Articles</h3>
          <div className="mt-2 flex justify-between">
            <div>
              <span className="text-2xl font-bold">
                {articleTypeCount.news}
              </span>
              <span className="text-sm text-gray-500 ml-1">articles</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold">
                ${(articleTypeCount.news * payoutRates.news).toFixed(2)}
              </span>
              <div className="text-xs text-gray-500">
                @${payoutRates.news}/article
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-300 p-4 rounded-lg border border-green-100">
          <h3 className="text-sm font-medium text-gray-700">Blog Posts</h3>
          <div className="mt-2 flex justify-between">
            <div>
              <span className="text-2xl font-bold">
                {articleTypeCount.blog}
              </span>
              <span className="text-sm text-gray-500 ml-1">posts</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold">
                ${(articleTypeCount.blog * payoutRates.blog).toFixed(2)}
              </span>
              <div className="text-xs text-gray-500">
                @${payoutRates.blog}/post
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-300 p-4 rounded-lg border border-purple-100">
          <h3 className="text-sm font-medium text-gray-700">Total Payout</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-purple-700">
              ${totalPayout.toFixed(2)}
            </span>
            <div className="text-xs text-gray-500 mt-1">
              {articleCounts.length} total items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
