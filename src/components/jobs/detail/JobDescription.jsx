"use client";

export default function JobDescription({ job }) {
  const renderDescription = (text) => {
    if (!text) return null;
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    let inListSection = false;

    return lines.map((line, idx) => {
      // Skip redundant "Job Description" header in the raw text
      if (line.toLowerCase() === "job description") return null;

      // Identify section headers (e.g., "Responsibilities:", "Requirements", "Benefits")
      const isHeader =
        line.endsWith(":") ||
        ["responsibilities", "requirements", "benefits", "required skills"].includes(
          line.toLowerCase()
        );

      if (isHeader) {
        inListSection = true; // Subsequent lines should be bullet points
        return (
          <h3
            key={idx}
            className="text-gray-900 font-serif font-medium text-lg mt-8 mb-4 flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-[#7A8B6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {line}
          </h3>
        );
      }

      // Remove existing manual bullets if any
      const cleanLine = line.replace(/^[-•*]\s*/, "");

      if (inListSection) {
        return (
          <div
            key={idx}
            className="flex items-start gap-3 mb-3 text-gray-600 group"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#7A8B6A]/50 group-hover:bg-[#7A8B6A] transition-colors mt-2.5 shrink-0"></div>
            <p className="leading-relaxed font-medium">{cleanLine}</p>
          </div>
        );
      } else {
        return (
          <p key={idx} className="text-gray-600 leading-relaxed mb-4 font-medium">
            {cleanLine}
          </p>
        );
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Description */}
      <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-serif font-medium text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] flex items-center justify-center border border-[#E8E1D5] shadow-sm">
            <svg
              className="w-5 h-5 text-[#7A8B6A]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          Job Overview
        </h2>
        <div>{renderDescription(job.description)}</div>
      </div>

      {/* Company Info */}
      <div className="bg-[#FDFBF7] border border-[#E8E1D5] rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#7A8B6A]/5 rounded-full blur-2xl group-hover:bg-[#7A8B6A]/10 transition-colors"></div>
        
        <h2 className="text-xl font-serif font-medium text-gray-900 mb-6 flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[#E8E1D5] shadow-sm">
            <svg
              className="w-5 h-5 text-[#7A8B6A]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          About {job.company.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative">
          <div className="bg-white rounded-2xl p-5 border border-[#E8E1D5] shadow-sm flex items-center gap-4 hover:border-[#7A8B6A]/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                Industry
              </p>
              <p className="text-gray-900 font-semibold">{job.company.industry}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E8E1D5] shadow-sm flex items-center gap-4 hover:border-[#7A8B6A]/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                Location
              </p>
              <p className="text-gray-900 font-semibold">{job.company.location}</p>
            </div>
          </div>
        </div>

        {job.company.websiteUrl && (
          <a
            href={job.company.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-3.5 bg-white border-2 border-[#E8E1D5] rounded-xl text-sm font-semibold text-gray-800 hover:text-[#7A8B6A] hover:border-[#7A8B6A] transition-all shadow-sm relative z-10"
          >
            Visit Company Website
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
