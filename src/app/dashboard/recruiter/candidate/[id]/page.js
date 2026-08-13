"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getCandidateById } from "@/lib/services/candidate.service";
import { LoaderIcon } from "@/components/dashboard/icons";

export default function CandidateProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    getCandidateById(id)
      .then(data => {
        setCandidate(data);
        setError(null);
      })
      .catch(err => {
        console.error("Failed to fetch candidate:", err);
        setError("Candidate profile not found or you do not have permission to view it.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
          <LoaderIcon className="w-10 h-10 text-[#7A8B6A]" />
        </motion.div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FDFBF7]">
        <div className="w-16 h-16 bg-[#F9F8F4] rounded-full flex items-center justify-center mb-4 border border-[#E8E1D5]">
          <svg className="w-8 h-8 text-[#A3AEA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif text-[#1C1F1A] mb-2">Profile Not Found</h2>
        <p className="text-[#6B7264]">{error || "This candidate does not exist."}</p>
        <button 
          onClick={() => router.back()}
          className="mt-6 px-6 py-2 bg-white border border-[#E8E1D5] text-[#1C1F1A] rounded-xl font-medium hover:bg-[#F9F8F4] transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm font-medium text-gray-500 hover:text-[#1A1A1A] transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E1D5] overflow-hidden shadow-sm">
        {/* Header section */}
        <div className="p-8 md:p-10 border-b border-[#E8E1D5] bg-[#FDFBF7]">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-24 h-24 bg-[#7A8B6A] text-white rounded-full flex items-center justify-center font-serif text-4xl shadow-md shrink-0">
              {candidate.fullName ? candidate.fullName.charAt(0) : "C"}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-serif font-medium text-[#1A1A1A] mb-2">{candidate.fullName}</h1>
              <div className="flex flex-wrap gap-4 text-[#6B7264] text-sm">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#A3AEA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {candidate.location || "Remote"}
                </span>
                {candidate.experienceYears > 0 && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#A3AEA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {candidate.experienceYears}+ Years Experience
                  </span>
                )}
                {candidate.phone && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#A3AEA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {candidate.phone}
                  </span>
                )}
              </div>
            </div>
            {candidate.resumeUrl && (
              <a 
                href={`http://localhost:8080/api/files/${candidate.resumeUrl}`} 
                target="_blank" 
                rel="noreferrer"
              >
                <button className="px-6 py-3 bg-[#7A8B6A] hover:bg-[#687A5D] text-white rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Resume
                </button>
              </a>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-10 space-y-10">
          
          {/* Bio */}
          {candidate.bio && (
            <div>
              <h3 className="text-sm font-bold text-[#A3AEA0] uppercase tracking-widest mb-4">About</h3>
              <p className="text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">
                {candidate.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-[#A3AEA0] uppercase tracking-widest mb-4">Verified Skills</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map(skill => (
                  <span key={skill.id} className="px-4 py-2 bg-[#F9F8F4] text-[#1A1A1A] font-medium rounded-xl border border-[#E8E1D5]">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {candidate.projects && candidate.projects.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-[#A3AEA0] uppercase tracking-widest mb-4">Portfolio & Projects</h3>
              <div className="grid gap-6">
                {candidate.projects.map((project, idx) => (
                  <div key={project.id || idx} className="p-6 rounded-2xl border border-[#E8E1D5] bg-[#FDFBF7]">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-[#1A1A1A]">{project.title}</h4>
                      {project.projectUrl && (
                        <a href={project.projectUrl} target="_blank" rel="noreferrer" className="text-[#7A8B6A] hover:underline text-sm font-medium">
                          View Project
                        </a>
                      )}
                    </div>
                    <p className="text-[#6B7264] text-sm mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-white text-xs font-semibold text-[#6B7264] rounded border border-[#E8E1D5]">
                        {project.complexity}
                      </span>
                      {project.techStack && project.techStack.split(',').map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-[#EEF4EC] text-[#7A8B6A] text-xs font-semibold rounded border border-[#D5E5D0]">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
