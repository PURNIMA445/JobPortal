import Footer from "@/components/layout/Footer";
import Navbar from "../components/layout/Header";
import { Suspense } from "react";
import './globals.css';
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Header */}
        <Suspense fallback={null}>
  <Navbar />
</Suspense>
        {/* Main content */}
        <main className="grow">
          {children}
        </main>

        {/* Static Footer */}
        <Footer />
        
      </body>
    </html>
  );
}