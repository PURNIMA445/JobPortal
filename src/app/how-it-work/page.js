"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Create Your Profile",
    description:
      "Sign up in minutes. Tell us your skills, experience, and what you're looking for. Candidates build portfolios; recruiters link their company.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    ),
    color: "bg-[#EEF4EC] text-[#7A8B6A] border-[#C2D9BE]",
  },
  {
    number: "02",
    title: "Get Matched Instantly",
    description:
      "Our AI-powered engine analyses your profile and automatically surfaces the most relevant jobs or top-matching candidates — no keyword guessing needed.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    ),
    color: "bg-[#FEF9EC] text-[#C8A96E] border-[#F0DDA0]",
  },
  {
    number: "03",
    title: "Apply with One Click",
    description:
      "Your profile is your resume. Apply to roles directly with your saved profile and a personal cover letter — no repetitive form filling.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
      />
    ),
    color: "bg-[#FEF2F2] text-[#D67373] border-[#FECACA]",
  },
  {
    number: "04",
    title: "Track Everything",
    description:
      "A real-time dashboard keeps you informed. Candidates track application statuses; recruiters manage their entire pipeline in one place.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    ),
    color: "bg-[#EEF4EC] text-[#7A8B6A] border-[#C2D9BE]",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1C1F1A] selection:bg-[#7A8B6A] selection:text-white">
      {/* ── Hero ── */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#7A8B6A]/8 rounded-bl-[160px] blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#C8A96E]/8 rounded-tr-[160px] blur-[80px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-5 py-2 rounded-full bg-white border border-[#E8E1D5] text-[#7A8B6A] font-medium text-xs tracking-wider uppercase mb-8 shadow-sm"
          >
            Simple & Transparent
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-medium text-[#1C1F1A] leading-[1.1] tracking-tight mb-6"
          >
            How it works
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#6B7264] max-w-2xl mx-auto leading-relaxed font-light"
          >
            From sign-up to hired — in four simple steps. No fluff, no gimmicks.
            Just a smarter way to connect talent with opportunity.
          </motion.p>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-[#E8E1D5] hidden md:block" />

          <div className="space-y-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-8 items-start"
              >
                {/* Icon badge */}
                <div
                  className={`w-16 h-16 shrink-0 rounded-2xl border flex items-center justify-center shadow-sm ${step.color}`}
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {step.icon}
                  </svg>
                </div>

                {/* Content */}
                <div className="pt-2">
                  <span className="text-xs font-bold tracking-widest text-[#A3AEA0] uppercase mb-1 block">
                    Step {step.number}
                  </span>
                  <h2 className="text-2xl font-serif font-medium text-[#1C1F1A] mb-3">
                    {step.title}
                  </h2>
                  <p className="text-[#6B7264] leading-relaxed max-w-xl">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#7A8B6A] py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-serif font-medium text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-[#E8E1D5] mb-10 text-lg">
            Join thousands of candidates and recruiters already using the platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/get-started">
              <button className="px-8 py-4 bg-white text-[#7A8B6A] font-semibold rounded-xl hover:bg-[#F5F2EB] transition-all shadow-md">
                Create Free Account
              </button>
            </Link>
            <Link href="/jobs">
              <button className="px-8 py-4 bg-[#6c7d5c] text-white font-semibold rounded-xl hover:bg-[#5c6d4c] transition-all border border-white/20">
                Browse Jobs
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}