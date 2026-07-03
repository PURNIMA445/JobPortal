"use client";

import { motion } from "framer-motion";

/**
 * Right-column sidebar for the Candidate Dashboard.
 * Shows: My Skills panel + Recent Alerts panel (only if notifications exist).
 *
 * Props:
 *   skills        — profile.skills array
 *   notifications — array of notification objects
 */
export default function CandidateSidebar({ skills, notifications }) {
  return (
    <div className="space-y-8">

      {/* ── My Skills ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E5E5E0] rounded-2xl p-6 shadow-sm">
        <h3 className="font-serif text-xl mb-4 text-[#1A1A1A]">My Skills</h3>
        {skills?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="px-4 py-1.5 text-sm rounded-full bg-[#F9F8F4] text-[#6B7264] border border-[#E5E5E0]"
              >
                {skill.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[#6B7264] text-sm">No skills added yet.</p>
        )}
      </div>

      {/* ── Recent Alerts (only rendered if there are notifications) ── */}
      {notifications.length > 0 && (
        <div className="bg-white border border-[#E5E5E0] rounded-2xl p-6 shadow-sm">
          <h3 className="font-serif text-xl mb-4 text-[#1A1A1A]">Recent Alerts</h3>
          <div className="space-y-4">
            {notifications.slice(0, 5).map((n, idx) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`pb-4 border-b border-[#F4F5F2] last:border-0 last:pb-0 flex gap-3 ${
                  n.isRead ? "opacity-60" : "opacity-100"
                }`}
              >
                <div className="mt-1 shrink-0">
                  <div className={`w-2 h-2 rounded-full ${n.isRead ? "bg-[#E5E5E0]" : "bg-[#7C9070]"}`} />
                </div>
                <div>
                  <p className="text-sm text-[#1A1A1A] leading-relaxed m-0">{n.message}</p>
                  <span className="text-xs text-[#A3AEA0] mt-1 block">
                    {new Date(n.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
