"use client";

import { BellIcon, BriefcaseIcon, UsersIcon } from "@/components/dashboard/icons";
import ActivitySidebar from "@/components/dashboard/recruiter/ActivitySidebar";
import TeamManagement from "@/components/dashboard/recruiter/TeamManagement";

export default function RightSidebar({ totalJobs, activeJobs, notifications, profile }) {
  return (
    <div className="flex flex-col gap-6">

      {/* Job Overview */}
      <div className="bg-white border border-[#687A5D] rounded-2xl p-2 shadow-sm">
        <h3 className="font-serif text-lg font-medium text-[#1A1A1A] mb-">Job Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#687A5D]/50">
            <p className="text-2xl font-serif text-[#1A1A1A]">{totalJobs || 0}</p>
            <p className="text-xs text-[#6B7264] mt-1">Total Jobs</p>
          </div>
          <div className="bg-[#EEF4EC] p-4 rounded-2xl border border-[#687A5D]/50">
            <p className="text-2xl font-serif text-[#3D6B36]">{activeJobs || 0}</p>
            <p className="text-xs text-[#3D6B36] mt-1">Active Jobs</p>
          </div>
        </div>
      </div>

      {/* Notifications Card */}
      <div className="bg-[#7A8B6A] text-white border border-[#687A5D] rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute -right-3 -top-3 opacity-10">
          <BellIcon className="w-31 h-34 bg-black" />
        </div>
        <div className="relative z-10">
          <h3 className="font-serif text-lg font-medium mb-0.5">Notifications</h3>
          <p className="text-3xl font-serif mb-0.1">{notifications?.length || 0}</p>
          <p className="text-sm text-white">Recent Alerts</p>
        </div>
      </div>

      <TeamManagement profile={profile} />

      {/* Activity Feed */}
      <ActivitySidebar notifications={notifications} />

    </div>
  );
}
