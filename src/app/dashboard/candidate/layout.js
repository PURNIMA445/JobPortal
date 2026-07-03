"use client";

import { usePathname } from "next/navigation";
import LeftSidebar from "@/components/dashboard/candidate/LeftSidebar";

export default function CandidateDashboardLayout({ children }) {
  const pathname = usePathname();

  const hideSidebar = pathname === "/dashboard/candidate"; // your page route

  return (
    <div style={{ display: "flex", gap: "24px" }}>
      {!hideSidebar && (
        <div>
          <LeftSidebar />
        </div>
      )}

      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}