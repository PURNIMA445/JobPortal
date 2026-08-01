import React from "react";

export default function TopCandidateCard({ candidate }) {
  if (!candidate) return null;

  const score = candidate.score || 0;
  const matchedRequired = Array.isArray(candidate.matchedRequiredSkills) ? candidate.matchedRequiredSkills : [];
  const missingRequired = Array.isArray(candidate.missingRequiredSkills) ? candidate.missingRequiredSkills : [];

  // 1. Dynamic Recommendation States
  let stateTitle = "Weak Candidate";
  let stateClasses = "bg-[#FDF2E9] text-[#D35400] border-[#F5CBA7]";
  let icon = "🟠";

  if (score >= 85) {
    stateTitle = "Excellent Candidate Found";
    stateClasses = "bg-[#EEF4EC] text-[#3D6B36] border-[#3D6B36]/30";
    icon = "🟢";
  } else if (score >= 70) {
    stateTitle = "Strong Candidate Found";
    stateClasses = "bg-[#EEF4EC] text-[#3D6B36] border-[#D4EFDF]";
    icon = "🟢";
  } else if (score >= 50) {
    stateTitle = "Moderate Candidate";
    stateClasses = "bg-[#FEF9E7] text-[#B37B32] border-[#F9E79F]";
    icon = "🟡";
  }

  // 2. Hiring Decision mapping
  let decisionText = "Not Recommended";
  let decisionClasses = "bg-[#FADBD8] text-[#922B21] border-[#E6B0AA]";
  if (score >= 80) {
    decisionText = "Proceed to Interview";
    decisionClasses = "bg-[#EEF4EC] text-[#3D6B36] border-[#D4EFDF]";
  } else if (score >= 60) {
    decisionText = "Interview with Caution";
    decisionClasses = "bg-[#FEF9E7] text-[#B37B32] border-[#FCF3CF]";
  } else if (score >= 40) {
    decisionText = "Keep as Backup Candidate";
    decisionClasses = "bg-[#FDF2E9] text-[#D35400] border-[#F5CBA7]";
  }

  // 3. Hiring Risk Calculation
  let riskText = "Low Risk";
  let riskClasses = "bg-[#EEF4EC] text-[#3D6B36] border-[#D4EFDF]";
  let riskIcon = "🟢";
  const riskReasons = [];

  if (score < 50 || missingRequired.length >= 4) {
    riskText = "High Risk";
    riskClasses = "bg-[#FADBD8] text-[#922B21] border-[#E6B0AA]";
    riskIcon = "🔴";
    if (missingRequired.length >= 4) riskReasons.push(`Missing ${missingRequired.length} mandatory skills`);
    if (score < 50) riskReasons.push("Low semantic similarity score");
  } else if (score < 75 || missingRequired.length >= 2) {
    riskText = "Medium Risk";
    riskClasses = "bg-[#FEF9E7] text-[#B37B32] border-[#FCF3CF]";
    riskIcon = "🟡";
    if (missingRequired.length >= 2) riskReasons.push(`Missing ${missingRequired.length} required skills`);
    if (score < 75) riskReasons.push("Moderate match score");
  } else {
    riskReasons.push("Strong skills alignment and experience match");
  }

  // 4. Confidence Explanation
  let confidenceText = "Low Confidence";
  let confidenceReason = "Very few required skills matched.";
  if (matchedRequired.length >= 6) {
    confidenceText = "High Confidence";
    confidenceReason = "Matched most mandatory skills and experience requirements.";
  } else if (matchedRequired.length >= 3) {
    confidenceText = "Medium Confidence";
    confidenceReason = "Some required skills matched, moderate semantic coverage.";
  }

  // 5. Strengths and Potential Concerns
  const strengths = [];
  const concerns = [];

  if (matchedRequired.length > 0) {
    strengths.push(`Strong coverage of key skills: ${matchedRequired.slice(0, 3).join(", ")}`);
  }
  if (candidate.resumeYears >= 3) {
    strengths.push(`Solid industry experience (${candidate.resumeYears} years)`);
  }
  if (missingRequired.length > 0) {
    concerns.push(`Skill gap detected in: ${missingRequired.slice(0, 3).join(", ")}`);
  }
  if (score < 60) {
    concerns.push("Overall matching score indicates potential learning curve.");
  }

  // 6. Resume Completeness
  const resumeCompleteness = Math.min(
    100,
    60 + (matchedRequired.length * 5) + (candidate.resumeYears ? 10 : 0) + (candidate.explanation ? 10 : 0)
  );

  return (
    <div className="bg-gradient-to-br from-white to-[#FDFBF7] border-2 border-[#7A8B6A]/30 rounded-3xl p-6 shadow-md relative overflow-hidden mb-8">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#7A8B6A]" />

      {/* Dynamic Recommendation Status Banner */}
      <div className={`flex items-center gap-2 px-4 py-2 border rounded-2xl text-sm font-semibold mb-6 ${stateClasses}`}>
        <span>{icon}</span>
        <span>{stateTitle}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-[#1A1A1A]">
            {candidate.candidateName}
          </h2>
          {candidate.resumeYears != null && (
            <p className="text-sm text-[#6B7264] mt-1">
              Experience Comparison: <strong className="text-[#1A1A1A]">{candidate.resumeYears} Years</strong> (Estimated)
            </p>
          )}
        </div>

        {/* Compatibility / Score Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-[#6B7264] font-medium">Overall Match</div>
            <div className="text-sm font-bold text-[#1A1A1A]">{candidate.confidence || "Moderate"}</div>
          </div>
          <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 border-[#7A8B6A]/30 bg-[#EEF4EC] font-bold text-lg text-[#3D6B36] shadow-sm">
            <span>{score}%</span>
            <span className="text-[9px] uppercase font-normal tracking-tighter">Match</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: ATS Decision & Insights */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#6B7264] mb-1.5">
                Hiring Decision Support
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold border ${decisionClasses}`}>
                {decisionText}
              </span>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#6B7264] mb-1.5">
                Hiring Risk Rating
              </h3>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${riskClasses}`}>
                <span>{riskIcon}</span>
                <span>{riskText}</span>
              </span>
            </div>
          </div>

          {/* Risk Reasons List */}
          {riskText !== "Low Risk" && riskReasons.length > 0 && (
            <div className="bg-red-50/50 p-3 rounded-2xl border border-red-100/50 text-xs">
              <strong className="text-red-700 block mb-1">Risk Reasons:</strong>
              <ul className="list-disc pl-4 space-y-0.5 text-red-600">
                {riskReasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Confidence Indicator Explanation */}
          <div className="bg-[#F5F2EB]/30 p-3 rounded-2xl border border-[#E8E1D5]/50 text-xs">
            <strong className="text-[#1A1A1A] block mb-1">Recommendation Reliability: {confidenceText}</strong>
            <p className="text-[#6B7264]">{confidenceReason}</p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#6B7264] mb-1.5">
              Resume Completeness Score
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-full bg-[#F5F2EB] h-2 rounded-full overflow-hidden">
                <div className="bg-[#7A8B6A] h-full transition-all" style={{ width: `${resumeCompleteness}%` }} />
              </div>
              <span className="text-xs font-bold text-[#1A1A1A]">{resumeCompleteness}%</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#6B7264] mb-1.5">
              AI Recruiter Explanation
            </h3>
            <p className="text-sm text-[#1A1A1A] leading-relaxed bg-white/70 p-3 rounded-2xl border border-[#E8E1D5] shadow-sm">
              {candidate.match_explanation || candidate.explanation || "No explanation provided."}
            </p>
          </div>
        </div>

        {/* Right Column: Skills mapping & screening focuses */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#6B7264] mb-2">
              Matched Skills ({matchedRequired.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {matchedRequired.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[#EEF4EC] text-[#3D6B36] text-xs font-semibold rounded-lg border border-[#3D6B36]/10"
                >
                  ✓ {skill}
                </span>
              ))}
              {matchedRequired.length === 0 && (
                <span className="text-xs text-[#A3AEA0]">No matching required skills.</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#6B7264] mb-2">
              Missing Required Skills ({missingRequired.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {missingRequired.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[#FFF4E5] text-[#B37B32] text-xs font-semibold rounded-lg border border-[#B37B32]/10"
                >
                  {skill}
                </span>
              ))}
              {missingRequired.length === 0 && (
                <span className="text-xs text-[#3D6B36] font-semibold">✓ Meets all skill requirements</span>
              )}
            </div>
          </div>

          {/* Strengths and Concerns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#6B7264] mb-1.5">
                Top Strengths
              </h3>
              <ul className="text-xs text-[#3D6B36] space-y-1 bg-[#EEF4EC]/30 p-2.5 rounded-xl border border-[#D4EFDF]">
                {strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span>•</span>
                    <span>{str}</span>
                  </li>
                ))}
                {strengths.length === 0 && <li>None detected.</li>}
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#6B7264] mb-1.5">
                Potential Concerns
              </h3>
              <ul className="text-xs text-[#B37B32] space-y-1 bg-[#FFF4E5]/30 p-2.5 rounded-xl border border-[#FCF3CF]">
                {concerns.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span>•</span>
                    <span>{con}</span>
                  </li>
                ))}
                {concerns.length === 0 && <li>No concerns flagged.</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
