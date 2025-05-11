// contexts/AuthContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("user"); // Default role is 'user'

  // useEffect(() => {
  //   if (status === "loading") {
  //     setLoading(true);
  //     return;
  //   }

  //   if (session?.user) {
  //     setCurrentUser(session.user);

  //     // In a real application, you would fetch the user's role from your backend
  //     // For this example, we'll simulate an admin role for certain emails
  //     if (session.user.email === "admin@example.com") {
  //       setUserRole("admin");
  //     } else {
  //       setUserRole("user");
  //     }
  //   } else {
  //     setCurrentUser(null);
  //     setUserRole("user");
  //   }

  //   setLoading(false);
  // }, [session, status]);

  // Check if user has admin privileges
  const isAdmin = () => {
    return userRole === "admin";
  };

  const value = {
    currentUser,
    setCurrentUser,
    isLoggedIn,
    setIsLoggedIn,
    loading,
    userRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
