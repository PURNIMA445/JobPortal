"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LeafIcon, FileTextIcon, BookmarkIcon, BriefcaseIcon,
  MessageSquareIcon, BellIcon, SettingsIcon, UsersIcon
} from "@/components/dashboard/icons";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard/candidate", icon: LeafIcon },
  { label: "My Applications", href: "/dashboard/candidate/applications", icon: FileTextIcon },
  { label: "Saved Jobs", href: "/dashboard/candidate/saved", icon: BookmarkIcon },
  { label: "Recommended Jobs", href: "/dashboard/candidate/recommended", icon: BriefcaseIcon },
  { label: "Notifications", href: "/dashboard/candidate/notifications", icon: BellIcon },
  { label: "Profile", href: "/profile/setup", icon: UsersIcon },
  { label: "Settings", href: "/dashboard/candidate/settings", icon: SettingsIcon },
];

export default function LeftSidebar({ profileCompletion = 0 }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-8 sticky top-28">
      {/* Navigation Menu */}
      <nav className="bg-white border border-[#E8E1D5] rounded-3xl p-4 shadow-sm flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive 
                  ? "bg-[#FDFBF7] text-[#7A8B6A] font-medium border border-[#E8E1D5]" 
                  : "text-[#6B7264] hover:bg-[#FDFBF7] hover:text-[#1A1A1A] border border-transparent"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Profile Completion Card */}
      <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 shadow-sm">
        <h4 className="font-serif font-medium text-[#1A1A1A] mb-4">Profile Completion</h4>
        
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-[#6B7264]">Progress</span>
          <span className="font-bold text-[#7A8B6A]">{profileCompletion}%</span>
        </div>
        
        <div className="h-2 w-full bg-[#F4F5F2] rounded-full overflow-hidden mb-6">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${profileCompletion}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-[#7A8B6A] rounded-full"
          />
        </div>
        
        <button className="w-full py-2.5 bg-white border border-[#E8E1D5] hover:bg-[#FDFBF7] text-[#1A1A1A] text-sm font-medium rounded-xl transition-colors shadow-sm">
          Complete Profile
        </button>
      </div>
    </div>
  );
}
