"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * lucide dropped brand marks, so there is no Github icon to import. This is
 * the official Octicons mark (MIT), sized and stroked to sit next to the
 * lucide icons without looking like it came from somewhere else.
 */
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

/* ── Data ─────────────────────────────────────────────────────────── */

type Discipline = "Backend" | "Full Stack" | "Frontend" | "Shopify";

interface Project {
  id: string;
  title: string;
  /** One line: the problem and what changed because of the work. */
  outcome: string;
  discipline: Discipline;
  stack: string[];
  year: string;
  repo?: string;
  live?: string;
  /** Rendered as a small badge — e.g. work-in-progress entries. */
  status?: string;
}

const projects: Project[] = [
  {
    id: "01",
    title: "HaulDrive — Fleet Management",
    outcome:
      "Fleet platform tracking vehicles and drivers in real time, with dispatch and route scheduling. Go (Gin) REST APIs over PostgreSQL, Redis caching live location updates to cut read latency.",
    discipline: "Full Stack",
    stack: ["Golang", "Gin", "Next.js", "PostgreSQL", "Redis", "Docker"],
    year: "2025–2026",
    live: "https://hauldrive.com/",
  },
  {
    id: "02",
    title: "Finalist",
    outcome:
      "Configurable scrim management platform serving gaming communities through Discord, with automatic slot assignment, substitutions, and waitlists.",
    discipline: "Backend",
    stack: ["Golang", "Gin", "DiscordJS", "PostgreSQL", "Redis", "AWS S3"],
    year: "2026",
    repo: "https://github.com/finalistbot/",
    live: "https://finalist.live",
  },
  {
    id: "03",
    title: "Chai-lang",
    outcome:
      "A programming language built from scratch in Go — lexer, parser, and code generator — compiling to WebAssembly so code runs client-side in the browser.",
    discipline: "Backend",
    stack: ["Golang", "WebAssembly", "React", "Tailwind CSS"],
    year: "2025",
    repo: "https://github.com/chai-lang/chai-lang",
  },
  {
    id: "04",
    title: "sm-go-next",
    outcome:
      "Social platform with real-time messaging and live content updates over Socket.IO, in a monorepo with end-to-end TypeScript safety across frontend and backend.",
    discipline: "Full Stack",
    stack: ["Golang", "Next.js", "Socket.IO", "Drizzle", "Cloudinary"],
    year: "2025",
    repo: "https://github.com/dhruva430/sm-go-next",
    status: "In Progress",
  },
  {
    id: "05",
    title: "Shrinkr",
    outcome:
      "URL shortener with custom back-halves, QR generation, and link analytics — Stripe for payments and React Charts for traffic visualisation.",
    discipline: "Full Stack",
    stack: ["Golang", "Next.js", "PostgreSQL", "Zod", "Stripe", "Docker"],
    year: "2025",
    repo: "https://github.com/Dhruva430/url_shortner",
  },
];

/* ── Card ─────────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  cardRef,
}: {
  project: Project;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col h-full p-6 md:p-8 bg-black/40 border border-neutral-900 rounded-xl transition-colors duration-500 hover:border-red-900/60"
    >
      {/* Index + discipline */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] font-mono tracking-[0.3em] text-neutral-600">
          {project.id}
        </span>
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-red-600 border border-red-900/40 rounded-full px-3 py-1">
          {project.discipline}
        </span>
      </div>

      <h3
        className="text-xl md:text-2xl font-bold text-white leading-snug group-hover:text-red-50 transition-colors duration-300"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {project.title}
      </h3>

      <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
        {project.outcome}
      </p>

      {/* Stack chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="text-[10px] font-mono tracking-wider uppercase text-neutral-400 bg-neutral-900/60 border border-neutral-800 rounded px-2 py-1"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Footer: year + links, pinned to the bottom so cards line up */}
      <div className="mt-auto pt-6 flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-600">
          {project.year}
        </span>

        <div className="flex items-center gap-4">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} — view repository on GitHub`}
              title="View repository"
              className="text-neutral-400 hover:text-white transition-colors duration-200 hover:-translate-y-0.5 transform-gpu"
            >
              <GithubIcon className="w-7 h-7" />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} — open live site`}
              title="Open live site"
              className="text-neutral-400 hover:text-white transition-colors duration-200 hover:-translate-y-0.5 transform-gpu"
            >
              <ExternalLink className="w-7 h-7" strokeWidth={1.75} />
            </a>
          )}
        </div>
      </div>

      {project.status && (
        <span className="absolute top-0 right-6 -translate-y-1/2 text-[9px] font-mono tracking-[0.2em] uppercase text-amber-500/90 bg-[#0a0a0a] border border-amber-900/50 rounded px-2 py-0.5">
          {project.status}
        </span>
      )}
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */

export default function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            // Stagger within a row rather than by absolute index, so the
            // third card down does not wait on the first row's delay.
            delay: (i % 3) * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative w-full bg-[#0a0a0a] overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(220,38,38,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(220,38,38,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[1800px] mx-auto py-20 md:py-32 px-4 sm:px-6 lg:px-12">
        {/* ── Section heading ── */}
        <div ref={headingRef} className="mb-14 md:mb-20">
          <span className="text-[10px] md:text-[11px] font-mono tracking-[0.35em] text-red-600 uppercase block mb-3">
            Selected Work
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
            <h2
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-normal text-white leading-none"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              My <span className="gradient-text">Work</span>
            </h2>
            <p className="text-sm text-neutral-400 max-w-xs font-mono tracking-wide leading-relaxed">
              Backend systems, full stack builds, interfaces, and Shopify
              storefronts.
            </p>
          </div>
          <div className="mt-6 md:mt-8 h-px w-12 md:w-16 bg-red-600" />
        </div>

        {/* ── Project grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              cardRef={(el) => {
                cardsRef.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
