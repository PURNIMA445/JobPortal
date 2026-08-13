"use client";

import { motion } from "framer-motion";
import { StatCard } from "./SharedUI";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export function OverviewTab({ stats }) {
  // Data for User Distribution (Donut Chart)
  const userDistributionData = [
    { name: "Candidates", value: stats?.candidates || 0, color: "#7A8B6A" },
    { name: "Recruiters", value: stats?.recruiters || 0, color: "#C8A96E" }
  ];

  // Data for System Activity (Bar Chart)
  const activityData = [
    { name: "Jobs", count: stats?.totalJobs || 0 },
    { name: "Applications", count: stats?.totalApplications || 0 },
    { name: "Companies", count: stats?.totalCompanies || 0 },
    { name: "Skills", count: stats?.totalSkills || 0 }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {/* Top Row Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Users" value={stats?.totalUsers} color="bg-white border border-[#E8E1D5]"
          icon={<svg className="w-6 h-6 text-[#7A8B6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard label="Total Jobs" value={stats?.totalJobs} color="bg-white border border-[#E8E1D5]"
          icon={<svg className="w-6 h-6 text-[#7A8B6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
        <StatCard label="Applications" value={stats?.totalApplications} color="bg-white border border-[#E8E1D5]"
          icon={<svg className="w-6 h-6 text-[#C8A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
        />
        <StatCard label="Companies" value={stats?.totalCompanies} color="bg-white border border-[#E8E1D5]"
          icon={<svg className="w-6 h-6 text-[#C8A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
        />
      </div>

      {/* Middle Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* User Distribution Donut Chart */}
        <div className="bg-white border border-[#E8E1D5] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-serif font-semibold text-[#1C1F1A] mb-6">User Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E8E1D5', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#1C1F1A', fontWeight: 500 }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Activity Bar Chart */}
        <div className="bg-white border border-[#E8E1D5] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-serif font-semibold text-[#1C1F1A] mb-6">Platform Activity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E1D5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7264', fontSize: 13 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7264', fontSize: 13 }} />
                <Tooltip 
                  cursor={{ fill: '#F5F2EB' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E8E1D5', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="count" fill="#7A8B6A" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
export default OverviewTab;
