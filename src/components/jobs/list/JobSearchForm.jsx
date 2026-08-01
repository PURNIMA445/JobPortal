"use client";

import React from "react";
import { motion } from "framer-motion";

function SearchIcon(props) {
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
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function JobSearchForm({
  keyword,
  setKeyword,
  location,
  setLocation,
  selectedJobType,
  setSelectedJobType,
  selectedExperience,
  setSelectedExperience,
  handleSearch,
}) {
  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto relative z-10 pb-8">
      {/* SEARCH BAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full bg-white rounded-3xl lg:rounded-full p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EBE8E0] flex flex-col lg:flex-row items-center gap-2 lg:gap-0"
      >
        <div className="flex-[1.5] flex items-center px-4 w-full lg:w-auto">
          <SearchIcon className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
          <input
            className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 py-2"
            placeholder="Job title, keywords, or company"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="hidden lg:block w-px h-8 bg-gray-200 mx-2 shrink-0"></div>
        <div className="w-full lg:hidden h-px bg-gray-100 my-1"></div>

        <div className="flex-1 flex items-center px-4 w-full lg:w-auto">
          <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
          <input
            className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 py-2"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="hidden lg:block w-px h-8 bg-gray-200 mx-2 shrink-0"></div>
        <div className="w-full lg:hidden h-px bg-gray-100 my-1"></div>

        <div className="flex-1 flex items-center px-4 w-full lg:w-auto relative group">
          <select
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
            className="w-full bg-transparent text-gray-700 py-2 focus:outline-none cursor-pointer appearance-none pr-8"
          >
            <option value="">Any Job Type</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="REMOTE">Remote</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none" />
        </div>

        <div className="hidden lg:block w-px h-8 bg-gray-200 mx-2 shrink-0"></div>
        <div className="w-full lg:hidden h-px bg-gray-100 my-1"></div>

        <div className="flex-1 flex items-center px-4 w-full lg:w-auto relative group">
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="w-full bg-transparent text-gray-700 py-2 focus:outline-none cursor-pointer appearance-none pr-8"
          >
            <option value="">Any Experience</option>
            <option value="JUNIOR">Junior</option>
            <option value="MID">Mid-Level</option>
            <option value="SENIOR">Senior</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none" />
        </div>

        <button
          onClick={handleSearch}
          className="w-full lg:w-auto bg-[#7D9976] hover:bg-[#6A8564] text-white px-8 py-3 rounded-full font-medium transition-colors lg:ml-2 mt-2 lg:mt-0"
        >
          Search
        </button>
      </motion.div>

      {/* POPULAR SEARCHES */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap items-center gap-3 mt-8"
      >
        <span className="font-semibold text-gray-800 text-sm mr-2">
          Popular Searches:
        </span>
        {["UI/UX Designer", "Software Engineer", "Data Analyst", "Product Manager"].map((tag) => (
          <button
            key={tag}
            onClick={() => {
                setKeyword(tag);
                // Optionally handleSearch() could be triggered here or in useEffect
            }}
            className="bg-[#FCF9F3] border border-[#EAE5D9] text-gray-700 hover:bg-[#F0EBDF] px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            {tag}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
