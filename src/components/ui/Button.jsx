import { cn } from "@/lib/utils";

export default function Button({
  children,
  className = "",
  type = "button",
  disabled,
  onClick,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "text-center text-sm font-semibold text-white",
        "bg-linear-to-r from-rose-400 to-pink-500",
        "py-2.5 px-4 rounded-xl transition",
        "hover:brightness-110 active:brightness-95",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}