"use client";

import { motion } from "framer-motion";

/**
 * Notification / activity sidebar panel.
 * Shows the 5 most recent recruiter notifications.
 *
 * Props:
 *   notifications — array of notification objects from the API
 */
export default function ActivitySidebar({ notifications }) {
  return (
    <div>
      <h2 className="font-serif text-2xl mb-4 text-[#1A1A1A]">Activity</h2>
      <div className="bg-white border border-[#E5E5E0] rounded-2xl p-6 shadow-sm">
        {notifications.length === 0 ? (
          <p className="text-[#6B7264] text-sm text-center py-4">No recent activity.</p>
        ) : (
          <div className="space-y-4">
            {notifications.slice(0, 5).map((n, idx) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-3 pb-4 border-b border-[#F4F5F2] last:border-0 last:pb-0"
              >
                <div className="mt-1.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#7C9070]" />
                </div>
                <p className="text-sm text-[#1A1A1A] leading-relaxed m-0">{n.message}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
