"use client";

import { motion } from "framer-motion";
import { BriefcaseIcon, DollarSignIcon, MapPinIcon } from "@/components/dashboard/icons";

export default function JobHeader({ job }) {
  if (!job) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 border border-[#E8E1D5] shadow-sm relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#7A8B6A]/5 rounded-bl-[100px] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FDFBF7] rounded-2xl border border-[#E8E1D5] flex items-center justify-center shadow-sm shrink-0">
            <span className="text-3xl font-serif text-[#7A8B6A]">
              {job.company?.name ? job.company.name.charAt(0).toUpperCase() : "C"}
            </span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2">
              {job.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{job.company?.name}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
              <span className="flex items-center gap-1.5 bg-[#FDFBF7] px-3 py-1.5 rounded-lg border border-[#E8E1D5]">
                <MapPinIcon className="w-4 h-4 text-[#A3AEA0]" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5 bg-[#FDFBF7] px-3 py-1.5 rounded-lg border border-[#E8E1D5]">
                <BriefcaseIcon className="w-4 h-4 text-[#A3AEA0]" />
                {job.jobType?.replace("_", " ")}
              </span>
              {job.salaryMin && job.salaryMax && (
                <span className="flex items-center gap-1.5 bg-[#EEF4EC] text-[#3D6B36] border border-[#C2D9BE] px-3 py-1.5 rounded-lg">
                  <span className="font-semibold text-sm">रू.</span>
                  {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider ${
            job.status === "OPEN" 
              ? "bg-[#EEF4EC] text-[#3D6B36] border border-[#C2D9BE]" 
              : "bg-[#F5F2EB] text-[#8C7A5D] border border-[#E8E1D5]"
          }`}>
            {job.status}
          </span>
          <span className="text-xs text-gray-400 mt-3 font-medium">
            Posted: {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
