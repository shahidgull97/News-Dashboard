"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Home,
  BarChart3,
  Users,
  Settings,
  Bell,
  Database,
  Layers,
  ChevronLeft,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

import { useRouter } from "next/navigation";

// Main Sidebar Component
export default function DashboardSidebar({ setAnalytics }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();
  // Handle responsive collapse based on screen size
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("fetching user data");

    fetch("/api/users/currentuser")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        console.log("user data is ", data);
      });
  }, []);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you would add/remove a class to the document
    // or use Next.js theme functionality
  };

  // Menu items data
  const menuItems = [
    { id: "dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { id: "analytics", icon: <BarChart3 size={20} />, label: "News" },
    // { id: "users", icon: <Users size={20} />, label: "Users" },
    // { id: "databases", icon: <Database size={20} />, label: "Databases" },
    // { id: "projects", icon: <Layers size={20} />, label: "Projects" },
  ];

  // Bottom menu items
  const bottomMenuItems = [
    { id: "logout", icon: <LogOut size={20} />, label: "Logout" },
  ];

  // Container classes for dynamic styling
  const containerClasses = `
    relative flex flex-col h-screen
    ${collapsed ? "w-16 md:w-20" : "w-64"}
    transition-all duration-300 ease-in-out
    bg-gradient-to-b from-blue-900 to-indigo-900
    text-white shadow-xl
  `;

  // Glass effect card classes
  const glassCardClasses = `
    mx-2 md:mx-4 my-3 md:my-4 p-2 md:p-4 rounded-xl
    bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg
    border border-white border-opacity-20
    shadow-lg
  `;

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
  console.log("user is ", user);

  return (
    <div className={containerClasses}>
      {/* Collapse Toggle Button - Hidden on mobile screens */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-12 bg-indigo-500 text-white p-1 rounded-full shadow-lg hidden md:block"
      >
        <ChevronLeft
          size={16}
          className={`transform transition-transform ${
            collapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Logo and Time Section */}
      <div className={`${glassCardClasses}  `}>
        <div className="flex items-center justify-between mb-2">
          {!collapsed && (
            <div className="flex items-center text-blue-900 ">
              <div className="h-6 w-6 md:h-8 md:w-8 rounded-md bg-indigo-500 flex items-center justify-center">
                <span className="font-bold text-sm md:text-lg">N</span>
              </div>
              <span className="ml-2 font-bold text-sm md:text-lg">
                NextDash
              </span>
            </div>
          )}
          {collapsed && (
            <div className="h-6 w-6 md:h-8 md:w-8 mx-auto rounded-md bg-indigo-500 flex items-center justify-center">
              <span className="font-bold text-sm md:text-lg">N</span>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="flex justify-between items-center text-xs md:text-sm text-blue-900">
            <span className="truncate">{currentTime.toLocaleDateString()}</span>
            <span>{formattedTime}</span>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className={`${glassCardClasses} flex items-center`}>
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
          <span className="font-bold text-blue-900">JD</span>
        </div>
        {!collapsed && (
          <div className="ml-3">
            <div className="font-semibold text-blue-900">{user?.name}</div>
            <div className="text-xs text-blue-900">{user?.role}</div>
          </div>
        )}
      </div>

      {/* Main Menu */}
      <nav className="flex-grow mt-6 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setActiveItem(item.id),
                    item.id == "dashboard"
                      ? setAnalytics(false)
                      : setAnalytics(true);
                }}
                className={`
                  flex items-center w-full px-3 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    activeItem === item.id
                      ? "bg-white opacity-90 text-blue-900"
                      : "text-blue-200 hover:bg-white hover:bg-opacity-10"
                  }
                `}
              >
                <span
                  className={`${activeItem === item.id ? "text-blue-900" : ""}`}
                >
                  {item.icon}
                </span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className="mt-auto mb-6 px-3">
        {/* Dark Mode Toggle */}
        <div className="mb-4 px-3">
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-full p-2 rounded-lg 
                      bg-white bg-opacity-10 hover:bg-opacity-20
                      transition-all duration-200"
          >
            {!collapsed ? (
              <div className="flex items-center">
                {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                <span className="ml-2">
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </span>
              </div>
            ) : darkMode ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </button>
        </div>

        {/* Bottom Menu Items */}
        <ul className="space-y-2">
          {bottomMenuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setActiveItem(item.id), logout();
                }}
                className={`
                  flex items-center w-full px-3 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    activeItem === item.id
                      ? "bg-white opacity-90 text-blue-900"
                      : "text-blue-200 hover:bg-white hover:bg-opacity-10"
                  }
                `}
              >
                <span>{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
