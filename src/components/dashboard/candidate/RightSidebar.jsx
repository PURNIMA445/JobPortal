"use client";

import { CheckCircleIcon, BookmarkIcon, BellIcon } from "@/components/dashboard/icons";

export default function RightSidebar({ stats, savedJobsCount, unreadCount, profileChecklist }) {

  const checklist = profileChecklist || [];

  return (
    <div className="flex flex-col gap-6">

      {/* Application Overview */}
      <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 shadow-sm">
        <h3 className="font-serif text-lg font-medium text-[#1A1A1A] mb-4">Application Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#E8E1D5]/50">
            <p className="text-2xl font-serif text-[#1A1A1A]">{stats?.applications || 0}</p>
            <p className="text-xs text-[#6B7264] mt-1">Total Applied</p>
          </div>
          <div className="bg-[#FFF4E5] p-4 rounded-2xl border border-[#F0D8BA]/50">
            <p className="text-2xl font-serif text-[#B37B32]">{stats?.underReview || 0}</p>
            <p className="text-xs text-[#B37B32] mt-1">Under Review</p>
          </div>
          <div className="bg-[#F1F4F0] p-4 rounded-2xl border border-[#DCE4DA]/50">
            <p className="text-2xl font-serif text-[#5C7356]">{stats?.shortlisted || 0}</p>
            <p className="text-xs text-[#5C7356] mt-1">Shortlisted</p>
          </div>
          <div className="bg-[#FFF0F0] p-4 rounded-2xl border border-[#FAD4D4]/50">
            <p className="text-2xl font-serif text-[#D67373]">{stats?.rejected || 0}</p>
            <p className="text-xs text-[#D67373] mt-1">Rejected</p>
          </div>
        </div>
      </div>

      {/* Profile Strength */}
      <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 shadow-sm">
        <h3 className="font-serif text-lg font-medium text-[#1A1A1A] mb-4">Profile Strength</h3>
        <div className="space-y-3 mb-6">
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {item.done ? (
                <CheckCircleIcon className="w-5 h-5 text-[#7A8B6A]" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[#E8E1D5]" />
              )}
              <span className={`text-sm ${item.done ? "text-[#1A1A1A]" : "text-[#6B7264]"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <button className="w-full py-2.5 bg-white border border-[#E8E1D5] hover:bg-[#FDFBF7] text-[#1A1A1A] text-sm font-medium rounded-xl transition-colors shadow-sm">
          Improve Profile
        </button>
      </div>

      {/* Saved Jobs */}
      <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookmarkIcon className="w-6 h-6 text-[#7A8B6A]" />
          <div>
            <p className="text-2xl font-serif text-[#1A1A1A]">{savedJobsCount || 0}</p>
            <p className="text-xs text-[#6B7264]">Saved Jobs</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#7A8B6A] text-white border border-[#687A5D] rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-10">
          <BellIcon className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <h3 className="font-serif text-lg font-medium mb-2">Notifications</h3>
          <p className="text-3xl font-serif mb-1">{unreadCount || 0}</p>
          <p className="text-sm text-white/80">unread</p>
        </div>
      </div>

    </div>
  );
}