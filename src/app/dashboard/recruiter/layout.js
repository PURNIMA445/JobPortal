import { Suspense } from "react";
import LeftSidebar from "@/components/dashboard/recruiter/LeftSidebar";

export default function RecruiterDashboardLayout({ children }) {
  return (
    <div style={{ display: "flex", gap: "24px" }}>
      <div style={{ width: "260px" }}>
        <Suspense fallback={null}>
          <LeftSidebar />
        </Suspense>
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}