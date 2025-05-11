import React, { useState } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import {
  FaNewspaper,
  FaCalculator,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            href="/dashboard"
            className="text-xl font-bold flex items-center"
          >
            <FaNewspaper className="mr-2" /> News Dashboard
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className={`hover:text-blue-300 ${
                    router.pathname === "/dashboard" ? "text-blue-300" : ""
                  }`}
                >
                  News
                </Link>
                <Link
                  href="/payouts"
                  className={`hover:text-blue-300 ${
                    router.pathname === "/payouts" ? "text-blue-300" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <FaCalculator className="mr-1" /> Payouts
                  </div>
                </Link>
                <div className="flex items-center">
                  <FaUser className="mr-1" />
                  <span>{session.user.name || session.user.email}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link href="/login" className="hover:text-blue-300">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="block py-2 hover:text-blue-300"
                >
                  News
                </Link>
                <Link
                  href="/payouts"
                  className="block py-2 hover:text-blue-300"
                >
                  <div className="flex items-center">
                    <FaCalculator className="mr-1" /> Payouts
                  </div>
                </Link>
                <div className="py-2 flex items-center">
                  <FaUser className="mr-1" />
                  <span>{session.user.name || session.user.email}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="block w-full text-left py-2 text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 hover:text-blue-300">
                  Login
                </Link>
                <Link href="/signup" className="block py-2 hover:text-blue-300">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
