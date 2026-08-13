"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { parseCV } from "@/lib/api";

export default function CandidateOnboardingPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };
  
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };
  
  const validateAndSetFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    setParsing(true);
    setError(null);
    
    try {
      const data = await parseCV(file);
      
      // Store projects in session storage to pass them (URL params can't hold big arrays easily)
      if (data.projects && data.projects.length > 0) {
        sessionStorage.setItem("parsedProjects", JSON.stringify(data.projects));
      }

      if (data.experiences && data.experiences.length > 0) {
        sessionStorage.setItem("parsedExperiences", JSON.stringify(data.experiences));
      }
      
      // Construct URL with extracted params
      const queryParams = new URLSearchParams();
      if (data.fullName) queryParams.append("fullName", data.fullName);
      if (data.phone) queryParams.append("phone", data.phone);
      if (data.location) queryParams.append("location", data.location);
      if (data.bio) queryParams.append("bio", data.bio);
      if (data.experienceYears) queryParams.append("experienceYears", data.experienceYears);
      if (data.skills && data.skills.length > 0) {
        queryParams.append("parsedSkillNames", data.skills.join(","));
      }
      
      // Add a flag indicating this came from the parser
      queryParams.append("fromParser", "true");
      
      router.push(`/profile/setup?${queryParams.toString()}`);
      
    } catch (err) {
      setError(err.message || "Failed to parse CV. Please fill your profile manually.");
      setParsing(false);
    }
  };

  const handleSkip = () => {
    router.push("/profile/setup");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center py-16 px-4 font-sans relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#7A8B6A]/10 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-[#7A8B6A]/5 p-8 md:p-12 border border-[#E8E1D5] relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#EEF4EC] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#C2D9BE]">
            <svg className="w-8 h-8 text-[#7A8B6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif font-medium text-[#1A1A1A] mb-3">
            Build your profile in seconds
          </h1>
          <p className="text-[#6B7264]">
            Upload your CV and we'll automatically extract your skills, experience, and projects to fill your profile.
          </p>
        </div>

        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !parsing && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            file ? 'border-[#7A8B6A] bg-[#EEF4EC]' : 'border-[#E8E1D5] hover:border-[#7A8B6A] hover:bg-[#FDFBF7]'
          } ${parsing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={parsing}
          />
          
          {file ? (
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-[#7A8B6A] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-gray-900">{file.name}</h3>
              <p className="text-sm text-[#7A8B6A] mt-1">Ready to parse</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-[#E8E1D5]">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Click to upload or drag & drop</h3>
              <p className="text-sm text-gray-500">PDF files only</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-rose-50 text-rose-700 text-sm font-medium rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleUpload}
            disabled={!file || parsing}
            className={`flex-1 py-4 rounded-xl font-medium transition-all shadow-md flex items-center justify-center gap-2 ${
              file && !parsing
                ? "bg-[#7A8B6A] hover:bg-[#687A5D] text-white shadow-[#7A8B6A]/20" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            {parsing ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </motion.div>
                Parsing CV...
              </>
            ) : (
              "Extract my profile"
            )}
          </button>
          
          <button 
            onClick={handleSkip}
            disabled={parsing}
            className="px-6 py-4 rounded-xl font-medium text-gray-600 bg-white border border-[#E8E1D5] hover:bg-[#F5F2EB] transition-colors"
          >
            Skip for now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
