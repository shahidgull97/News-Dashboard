import "./globals.css";
import { Inter } from "next/font/google";
// import AuthProvider from "@/components/AuthProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

import { PayoutProvider } from "@/contexts/PayoutContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "News Dashboard",
  description: "A responsive dashboard with news and payout features",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PayoutProvider>
          <AuthProvider>
            {children}

            <ToastContainer position="bottom-right" />
          </AuthProvider>
        </PayoutProvider>
      </body>
    </html>
  );
}
