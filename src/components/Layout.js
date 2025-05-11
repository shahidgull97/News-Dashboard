"use client";
import React from "react";
import Navbar from "./Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthPage =
    router.pathname === "/login" || router.pathname === "/signup";

  // If on auth page or loading, just render children
  if (isAuthPage || status === "loading") {
    return <>{children}</>;
  }

  // If not authenticated and not on auth page, redirect to login
  if (!session && !isAuthPage) {
    router.push("/login");
    return (
      <div className="flex justify-center items-center min-h-screen">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© {new Date().getFullYear()} News Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}
