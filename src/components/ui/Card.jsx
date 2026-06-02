import { cn } from "@/lib/utils";

export default function Card({ children, className = "", ...props }) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition",
        "hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}