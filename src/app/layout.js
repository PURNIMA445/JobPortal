import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Suspense } from "react";
import Providers from "@/context/Providers";
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
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
        </Providers>
      </body>
    </html>
  );
}