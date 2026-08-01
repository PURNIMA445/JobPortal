"use client";

import React from "react";
import { motion } from "framer-motion";

export function CircularStamp() {
  return (
    <div className="absolute top-4 md:top-10 right-0 md:right-10 w-28 h-28 md:w-32 md:h-32 hidden sm:block">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-[spin_20s_linear_infinite]"
      >
        <path
          id="textPath"
          d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
          fill="transparent"
        />
        <text
          className="text-[8.5px] font-bold tracking-[0.18em]"
          fill="#C3A679"
        >
          <textPath href="#textPath" startOffset="0%">
            MEANINGFUL WORK • BETTER FUTURE •
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C3A679"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1 8.3C18 16 14 20 11 20z" />
          <path d="M11 20c2-5 3-7 6-10" />
        </svg>
      </div>
    </div>
  );
}

export function EnvelopeGraphic() {
  return (
    <div className="absolute top-0 right-0 w-100 h-75 overflow-hidden pointer-events-none hidden md:block opacity-90">
      <motion.div
        initial={{ opacity: 0, x: 100, y: -100 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-[-25%] right-[-15%] w-full h-full origin-top-right rotate-[-20deg]"
      >
        <svg
          viewBox="0 0 300 200"
          className="w-full h-full drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="20"
            width="260"
            height="160"
            fill="#F8F4EC"
            stroke="#E6DEC9"
            strokeWidth="1"
            rx="4"
          />
          <path
            d="M20 20 L150 110 L280 20"
            fill="#F2EBE0"
            stroke="#E6DEC9"
            strokeWidth="1"
          />

          <g transform="translate(20, 20)">
            <path d="M0 0 L20 0 L15 15 L-5 15 Z" fill="#D67C47" />
            <path d="M35 0 L55 0 L50 15 L30 15 Z" fill="#799471" />
            <path d="M70 0 L90 0 L85 15 L65 15 Z" fill="#D67C47" />
            <path d="M105 0 L125 0 L120 15 L100 15 Z" fill="#799471" />
            <path d="M140 0 L160 0 L155 15 L135 15 Z" fill="#D67C47" />
            <path d="M175 0 L195 0 L190 15 L170 15 Z" fill="#799471" />
            <path d="M210 0 L230 0 L225 15 L205 15 Z" fill="#D67C47" />
            <path d="M245 0 L265 0 L260 15 L240 15 Z" fill="#799471" />
          </g>

          <rect
            x="200"
            y="40"
            width="50"
            height="60"
            fill="#FCFBF8"
            stroke="#D3C5B0"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <path
            d="M215 80 Q225 55 235 80 T235 95"
            stroke="#799471"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="225"
            cy="65"
            r="12"
            stroke="#D67C47"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </motion.div>
    </div>
  );
}

export default function JobHeroBanner({ greeting, setKeyword }) {
  return (
    <>
      <EnvelopeGraphic />
      <div className="pt-24 pb-8 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl relative">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D67C47] text-3xl md:text-4xl mb-4"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            {greeting}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl text-[#111111] leading-[1.1] mb-12 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Find work that
            <br />
            feels like you.
          </motion.h1>

          <CircularStamp />
        </div>
      </div>
    </>
  );
}
