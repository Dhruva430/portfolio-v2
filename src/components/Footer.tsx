"use client";

import React from "react";

const socials = [
  { name: "Instagram", href: "#" },
  { name: "Behance",   href: "#" },
  { name: "Dribbble",  href: "#" },
  { name: "LinkedIn",  href: "#" },
];

const services = ["Photo Editing", "Video Editing", "Shorts", "Thumbnail Design"];

export default function Footer() {
  return (
    <footer className="relative w-full bg-black overflow-hidden border-t-2 border-red-600">

      {/* ── Marquee watermark — scrolls left to right ── */}
      <div className="relative select-none overflow-hidden border-b border-neutral-900 mt-4">
        <div className="flex animate-marquee-reverse">
          {[0, 1].map((n) => (
            <p
              key={n}
              className="whitespace-nowrap flex-shrink-0 text-[clamp(5rem,18vw,14rem)] font-black tracking-wider leading-none text-neutral-100 px-8"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              AM&nbsp;DESIGNS &nbsp;&nbsp;&nbsp; AM&nbsp;DESIGNS &nbsp;&nbsp;&nbsp; AM&nbsp;DESIGNS &nbsp;&nbsp;&nbsp;
            </p>
          ))}
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="w-full px-4 sm:px-8 md:px-16 py-10">

        {/* Top strip: tagline left, socials right */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <p className="text-[14px] text-red-500 tracking-[0.35em] font-bold uppercase mb-1">Creative Studio</p>
            <p className="text-[12px] text-neutral-400 tracking-[0.35em] uppercase mb-1">Est. 2026</p>
            <p className="text-sm text-neutral-300 max-w-sm tracking-wide leading-relaxed">
              Design and post-production studio helping creators and brands make their mark.
            </p>
          </div>

          {/* Socials */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-neutral-300 hover:text-white uppercase tracking-widest transition-colors duration-200"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        {/* Red rule */}
        <div className="w-full h-px bg-neutral-900 mb-8" />

        {/* Bottom bar: copyright left, services right */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
            © 2026 AM Designs · All Rights Reserved · India
          </p>

          {/* Service tags */}
          <div className="flex flex-wrap items-center gap-4">
            {services.map((s, i) => (
              <span key={s} className="flex items-center gap-4">
                {i > 0 && <span className="w-px h-3 bg-neutral-400" />}
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">{s}</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
