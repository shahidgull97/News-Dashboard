// contexts/PayoutContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const PayoutContext = createContext();

// Custom hook to use payout context
export const usePayoutContext = () => {
  return useContext(PayoutContext);
};

// Default payout rates
const DEFAULT_RATES = {
  news: 15.0,
  blog: 25.0,
};

export function PayoutProvider({ children }) {
  const [payoutRates, setPayoutRates] = useState(DEFAULT_RATES);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved rates from localStorage on component mount
  useEffect(() => {
    setLoading(true);

    try {
      const savedRates = localStorage.getItem("payoutRates");
      const savedHistory = localStorage.getItem("payoutHistory");

      if (savedRates) {
        setPayoutRates(JSON.parse(savedRates));
      }

      if (savedHistory) {
        setPayoutHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error loading payout data from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save rates to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("payoutRates", JSON.stringify(payoutRates));
    }
  }, [payoutRates, loading]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("payoutHistory", JSON.stringify(payoutHistory));
    }
  }, [payoutHistory, loading]);

  // Calculate payout based on article counts and current rates
  const calculatePayout = (articleCounts) => {
    const newsPayout = (articleCounts.news || 0) * payoutRates.news;
    const blogPayout = (articleCounts.blog || 0) * payoutRates.blog;
    return newsPayout + blogPayout;
  };

  // Add a new payout record to history
  const addPayoutRecord = (record) => {
    const newRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      rates: { ...payoutRates }, // Store current rates with the record
    };

    setPayoutHistory((prevHistory) => [newRecord, ...prevHistory]);
    return newRecord;
  };

  // Reset rates to defaults
  const resetRates = () => {
    setPayoutRates(DEFAULT_RATES);
  };

  const value = {
    payoutRates,
    setPayoutRates,
    calculatePayout,
    payoutHistory,
    addPayoutRecord,
    resetRates,
    loading,
  };

  return (
    <PayoutContext.Provider value={value}>{children}</PayoutContext.Provider>
  );
}
