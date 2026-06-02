import { cn } from "@/lib/utils";

export default function JobCard({
  title,
  company,
  location,
  type,
  salary,
  className = "",
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition",
        "hover:shadow-md hover:-translate-y-1",
        className
      )}
    >
      {/* Job Title */}
      <h2 className="text-lg font-semibold text-slate-800">
        {title}
      </h2>

      {/* Company */}
      <p className="mt-1 text-sm text-slate-500">
        {company}
      </p>

      {/* Details */}
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-slate-100 px-2 py-1">
          📍 {location}
        </span>

        <span className="rounded-full bg-slate-100 px-2 py-1">
          ⏱ {type}
        </span>

        <span className="rounded-full bg-slate-100 px-2 py-1">
          💰 {salary}
        </span>
      </div>
    </div>
  );
}