"use client";

import React from "react";

export default function FooterLore() {
  return (
    <section className="relative w-full bg-gradient-to-b from-black to-neutral-950 border-t border-neutral-900 py-14 md:py-16 px-4 sm:px-8 md:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Statement */}
        <div className="max-w-2xl">
          <span className="text-[10px] font-mono text-red-600 tracking-[0.35em] uppercase block mb-3">
            About
          </span>
          <h3
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Backend first,{" "}
            <span className="text-red-500">interface second.</span>
          </h3>
          <p className="mt-4 text-sm text-neutral-400 max-w-lg leading-relaxed">
            I build fast, reliable web apps with TypeScript, Golang, React, and
            Next.js. I enjoy system design and turning ideas into clean, working
            products end to end — most of what I write is server-side, but I
            ship the interface too, so the whole feature lands rather than half
            of it.
          </p>
        </div>

        {/* Experience */}
        <div className="mt-12 pt-10 border-t border-neutral-900 max-w-2xl">
          <span className="text-[10px] font-mono text-red-600 tracking-[0.35em] uppercase block mb-5">
            Experience
          </span>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6">
            <div>
              <h4
                className="text-lg md:text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Full Stack Developer ·{" "}
                <span className="text-red-500">HaulDrive</span>
              </h4>
              <p className="mt-1 text-[11px] font-mono text-neutral-500 tracking-[0.2em] uppercase">
                Remote — London, U.K.
              </p>
            </div>
            <span className="text-[11px] font-mono text-neutral-500 tracking-[0.2em] uppercase whitespace-nowrap">
              Dec 2025 — Apr 2026
            </span>
          </div>
          <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
            Redesigned both the frontend and backend of a fleet management
            platform, improving architecture, scalability, and maintainability.
            Built the Jobs module for creating, assigning, and tracking hauling
            work, added Operating Licenses management for compliance and vehicle
            authorization, and designed a central RBAC system for fine-grained
            access control across the platform.
          </p>
        </div>

      </div>
    </section>
  );
}