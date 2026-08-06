"use client";

import React from "react";

export default function FooterLore() {
  const stats = [
    { value: "200+", label: "Projects Completed" },
    { value: "50+",  label: "Happy Clients" },
    { value: "2+",   label: "Years in Craft" },
    { value: "24h",  label: "Quick Turnaround" },
  ];

  return (
    <section className="relative w-full bg-gradient-to-b from-black to-neutral-950 border-t border-neutral-900 py-14 md:py-16 px-4 sm:px-8 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">

        {/* Statement */}
        <div className="max-w-xl">
          <span className="text-[10px] font-mono text-red-600 tracking-[0.35em] uppercase block mb-3">
            Our Studio
          </span>
          <h3
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Built on craft,{" "}
            <span className="text-red-500">driven by details.</span>
          </h3>
          <p className="mt-4 text-sm text-neutral-400 max-w-lg leading-relaxed">
            We are an independent creative studio focused on graphic design and post-production. We help creators, startups, and brands look their best with clean visuals, sharp video edits, and thoughtful identity design.
          </p>
        </div>

        {/* Stats: 2 in a row */}
        <div className="grid grid-cols-2 mt-8 gap-x-12 gap-y-12 flex-shrink-0">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p
                className="text-3xl md:text-4xl font-black text-red-500"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {stat.value}
              </p>
              <p className="text-[11px] font-mono text-neutral-300 tracking-[0.25em] uppercase mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}