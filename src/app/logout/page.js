"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export function Logout() {
  const router = useRouter();

  // Logout function
  const logout = async () => {
    try {
      // Call the logout API
      await axios.post("/api/users/logout");

      // Clear any client-side state (if you're using React context or state management)
      // Example: dispatch({ type: 'LOGOUT' }); or setUser(null);

      // Show success message
      toast.success("Logged out successfully");

      // Redirect to login page
      router.push("/login");

      // Force a hard refresh to clear any client cache
      // This is optional but helps ensure clean state
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  return { logout };
}
