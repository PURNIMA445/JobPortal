import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Suspense } from "react";
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Header */}
        <Suspense fallback={null}>
          <Header />
        </Suspense>

        {/* Main content */}
        <main className="grow">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}