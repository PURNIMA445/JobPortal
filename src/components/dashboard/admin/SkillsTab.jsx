"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SKILL_CATEGORIES = [
  "Frontend", "Backend", "Database", "DevOps", "Cloud",
  "Mobile", "AI/ML", "Data", "Design", "Management", "General"
];

export default function SkillsTab() {
  const [skills, setSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [addingSkill, setAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", category: "General" });
  const [skillMsg, setSkillMsg] = useState(null);

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    setLoading(true);
    try {
      const { adminGetSkills } = await import("@/lib/services/admin.service");
      const data = await adminGetSkills();
      setSkills(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSkill(e) {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    setAddingSkill(true);
    setSkillMsg(null);
    try {
      const { adminCreateSkill } = await import("@/lib/services/admin.service");
      const created = await adminCreateSkill(newSkill.name.trim(), newSkill.category);
      setSkills((prev) => [...prev, created]);
      setNewSkill({ name: "", category: "General" });
      setSkillMsg({ type: "success", text: `"${created.name}" added successfully!` });
    } catch (e) {
      setSkillMsg({ type: "error", text: e.message });
    } finally {
      setAddingSkill(false);
    }
  }

  async function handleDeleteSkill(id) {
    setDeletingId(id);
    try {
      const { adminDeleteSkill } = await import("@/lib/services/admin.service");
      await adminDeleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  }
  if (loading) {
    return <div className="py-12 text-center text-[#6B7264]">Loading skills...</div>;
  }

  const filteredSkills = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
      (s.category || "").toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Create Platform Skill */}
      <div className="bg-white rounded-3xl border border-[#E8E1D5] overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-[#E8E1D5] gap-3 bg-[#FAF8F5]">
          <h2 className="font-serif text-xl font-medium text-[#1C1F1A]">Create Platform Skill</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Skill name (e.g. React, Spring Boot...)"
              value={newSkill.name}
              onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#1C1F1A] outline-none focus:border-[#7A8B6A] focus:ring-2 focus:ring-[#7A8B6A]/10 transition-all"
            />
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value }))}
              className="px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#1C1F1A] outline-none focus:border-[#7A8B6A] transition-all"
            >
              {SKILL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button
              type="submit"
              disabled={addingSkill || !newSkill.name.trim()}
              className="px-6 py-2.5 bg-[#7A8B6A] hover:bg-[#687A5D] text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {addingSkill ? "Adding..." : "+ Create Skill"}
            </button>
          </form>
          <AnimatePresence>
            {skillMsg && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`text-sm mt-3 font-medium ${skillMsg.type === "success" ? "text-[#5C7356]" : "text-[#DC2626]"}`}
              >
                {skillMsg.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* All Skills List */}
      <div className="bg-white rounded-3xl border border-[#E8E1D5] overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-[#E8E1D5] gap-3 bg-[#FAF8F5]">
          <h2 className="font-serif text-xl font-medium text-[#1C1F1A]">All Skills ({filteredSkills.length})</h2>
          <input
            type="text"
            placeholder="Filter skills..."
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            className="px-4 py-2 text-sm rounded-xl border border-[#E8E1D5] outline-none focus:border-[#7A8B6A] bg-[#FDFBF7] w-64"
          />
        </div>
        <div className="p-6">
          {filteredSkills.length === 0 ? (
            <p className="text-[#6B7264] text-sm text-center py-8">No skills matches found. Add a skill to database using the controller above.</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(
                filteredSkills.reduce((acc, skill) => {
                  const cat = skill.category || "General";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(skill);
                  return acc;
                }, {})
              ).sort(([a], [b]) => a.localeCompare(b)).map(([category, catSkills]) => (
                <div key={category}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#6B7264] mb-3 border-b border-[#E8E1D5] pb-1">{category}</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {catSkills.map((skill) => (
                      <div key={skill.id} className="flex items-center gap-2.5 bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl px-3 py-2">
                        <span className="text-sm font-medium text-[#1C1F1A]">{skill.name}</span>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          disabled={deletingId === skill.id}
                          className="text-[#DC2626] hover:text-[#B91C1C] transition-colors disabled:opacity-40 ml-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
