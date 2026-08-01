"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import LeftSidebar from "@/components/dashboard/recruiter/LeftSidebar";

export default function RecruiterDashboardLayout({ children }) {
  const pathname = usePathname();

  // Hide the layout sidebar on the main dashboard page so it can be integrated into the CSS grid
  const hideSidebar = pathname === "/dashboard/recruiter"; 

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20 text-[#1C1F1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {!hideSidebar && (
            <div className="w-[260px] shrink-0 hidden lg:block">
              <Suspense fallback={null}>
                <LeftSidebar />
              </Suspense>
            </div>
          )}
          <div className="flex-1 w-full min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}