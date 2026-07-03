import { cn } from "@/lib/utils";

const VARIANT_STYLES = {
  primary: cn(
    "text-white bg-[#7A8B6A]",
    "hover:bg-[#6c7d5c] active:brightness-95"
  ),
  secondary: cn(
    "text-[#7A8B6A] bg-white border border-[#7A8B6A]",
    "hover:bg-[#F5F2EB] active:brightness-95"
  ),
  danger: cn(
    "text-white bg-red-500",
    "hover:bg-red-600 active:brightness-95"
  ),
};

export default function Button({
  children,
  className = "",
  type = "button",
  disabled,
  onClick,
  variant = "primary",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "text-center text-sm font-semibold",
        "py-2.5 px-4 rounded-xl transition",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT_STYLES[variant] || VARIANT_STYLES.primary,
        className
      )}
    >
      {children}
    </button>
  );
}