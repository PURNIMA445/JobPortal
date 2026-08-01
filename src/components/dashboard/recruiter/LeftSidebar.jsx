"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LeafIcon, UsersIcon, BellIcon, SettingsIcon, BriefcaseIcon, PlusIcon
} from "@/components/dashboard/icons";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard/recruiter", icon: LeafIcon },
  { label: "Post a Job", href: "/dashboard/recruiter/jobs/create", icon: PlusIcon },
  { label: "Applicants", href: "/dashboard/recruiter/applicants", icon: UsersIcon },
  { label: "Notifications", href: "/dashboard/recruiter/notifications", icon: BellIcon },
  { label: "Company Profile", href: "/recruiter/setup", icon: BriefcaseIcon },
  { label: "Settings", href: "/dashboard/recruiter/settings", icon: SettingsIcon },
];

export default function LeftSidebar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border border-[#E5E5E0] rounded-2xl p-4 shadow-sm flex flex-col gap-1 sticky top-28">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              isActive
                ? "bg-[#F9F8F4] text-[#7C9070] font-medium border border-[#E5E5E0]"
                : "text-[#6B7264] hover:bg-[#F9F8F4] hover:text-[#1A1A1A] border border-transparent"
            }`}
          >
            <Icon className="w-5 h-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}