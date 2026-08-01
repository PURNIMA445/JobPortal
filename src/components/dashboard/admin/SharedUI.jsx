"use client";

import { motion } from "framer-motion";

export const StatCard = ({ label, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border border-[#E8E1D5] p-6 flex items-center gap-4 shadow-sm"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-[#1C1F1A]">{value ?? "0"}</p>
      <p className="text-sm text-[#6B7264]">{label}</p>
    </div>
  </motion.div>
);

export const Section = ({ title, children, action }) => (
  <div className="bg-white rounded-3xl border border-[#E8E1D5] overflow-hidden shadow-sm">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-[#E8E1D5] gap-3 bg-[#FAF8F5]">
      <h2 className="font-serif text-xl font-medium text-[#1C1F1A]">{title}</h2>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);
