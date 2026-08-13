"use client";

import Link from "next/link";

export default function GuestAuthButtons() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#7A8B6A] transition"
      >
        Login
      </Link>
      <Link
        href="/get-started"
        className="px-5 py-2.5 text-sm font-medium text-white bg-[#7A8B6A] hover:bg-[#6A7B5C] rounded-xl shadow-sm"
      >
        Sign Up
      </Link>
    </div>
  );
}
