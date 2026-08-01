// Map score to recruit-focused Hiring recommendation status with color code
export const getHiringBadge = (score) => {
  if (score >= 80) {
    return { text: "Proceed to Interview", classes: "bg-[#EEF4EC] text-[#3D6B36] border-[#D4EFDF]", bullet: "🟢" };
  }
  if (score >= 60) {
    return { text: "Interview with Caution", classes: "bg-[#FEF9E7] text-[#B37B32] border-[#FCF3CF]", bullet: "🟡" };
  }
  if (score >= 40) {
    return { text: "Keep as Backup", classes: "bg-[#FDF2E9] text-[#D35400] border-[#F5CBA7]", bullet: "🟠" };
  }
  return { text: "Not Recommended", classes: "bg-[#FADBD8] text-[#922B21] border-[#E6B0AA]", bullet: "🔴" };
};

export const getRiskBadge = (score, missingCount) => {
  if (score < 50 || missingCount >= 4) {
    return { text: "High Risk", classes: "bg-[#FADBD8] text-[#922B21] border-[#E6B0AA]", bullet: "🔴" };
  }
  if (score < 75 || missingCount >= 2) {
    return { text: "Medium Risk", classes: "bg-[#FEF9E7] text-[#B37B32] border-[#FCF3CF]", bullet: "🟡" };
  }
  return { text: "Low Risk", classes: "bg-[#EEF4EC] text-[#3D6B36] border-[#D4EFDF]", bullet: "🟢" };
};
