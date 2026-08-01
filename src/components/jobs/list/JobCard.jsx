"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const bgColors = ["bg-[#E5ECE4]", "bg-[#FBEBE5]", "bg-[#FDF4D4]"];
const logoBgColors = [
  "bg-[#E3EFFF] text-[#3B82F6]",
  "bg-[#111111] text-white",
  "bg-[#FFC107] text-white",
];

function BookmarkIcon(props) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function MapPinIcon(props) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BrassTack() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 drop-shadow-md"
    >
      <circle
        cx="12"
        cy="10"
        r="5"
        fill="#D1C3AD"
        stroke="#B8A88E"
        strokeWidth="1"
      />
      <circle cx="10" cy="8" r="2" fill="#FFF" fillOpacity="0.6" />
      <path d="M12 15 L11.5 22 L12.5 22 Z" fill="#8C7C61" />
    </svg>
  );
}

export default function JobCard({ job, idx, isSaved, handleSave }) {
  const router = useRouter();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
      className={`relative p-2.5 rounded-3xl ${bgColors[idx % 3]} shadow-sm hover:-translate-y-1 transition-transform duration-300 cursor-pointer`}
      onClick={() => router.push(`/jobs/${job.id}`)}
    >
      <BrassTack />
      <div className="bg-white rounded-2xl p-6 h-full border border-white/50 shadow-sm relative flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${
              logoBgColors[idx % 3]
            }`}
          >
            {idx === 0 ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L2 21h20L12 3zm0 4.2L17.2 18H6.8L12 7.2z" />
              </svg>
            ) : job.company?.name ? (
              job.company.name.charAt(0)
            ) : (
              "W"
            )}
          </div>
          <button
            onClick={(e) => handleSave(e, job.id)}
            className={`p-2 rounded-full border transition-colors ${
              isSaved
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300 hover:border-black"
            }`}
          >
            <BookmarkIcon className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {job.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 font-medium">
          {job.company?.name || "Acme Inc."}
        </p>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-6 font-medium">
          <MapPinIcon className="w-4 h-4" />
          <span className="truncate">{job.location}</span>
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          <span className="bg-[#FDFBF7] border border-[#EAE5D9] text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
            {job.jobType
              ? job.jobType
                  .replace("_", "-")
                  .toLowerCase()
                  .replace(/\b\w/g, (l) => l.toUpperCase())
              : "Full-time"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
