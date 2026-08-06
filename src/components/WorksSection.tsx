"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Data ──────────────────────────────────────────────────────────── */

interface ShortItem {
  id: string;
  title: string;
  description: string;
  embedId: string; // YouTube Shorts embed id (placeholder)
}

interface ImageItem {
  id: string;
  title: string;
  src: string;
  tags: string[];
}

const shorts: ShortItem[] = [
  {
    id: "s1",
    title: "Cinematic Montage — Dark Reverie",
    description:
      "A moody, fast-paced montage with heavy colour grading and sound design.",
    embedId: "dQw4w9WgXcQ",
  },
  {
    id: "s2",
    title: "Product Launch — Neon Series",
    description:
      "High-energy product reveal with 3D motion tracking and glitch transitions.",
    embedId: "dQw4w9WgXcQ",
  },
  {
    id: "s3",
    title: "Travel Vlog — Tokyo Nights",
    description:
      "Atmospheric travel edit with ambient sound design and seamless transitions.",
    embedId: "dQw4w9WgXcQ",
  },
  {
    id: "s4",
    title: "Music Video — Echoes",
    description:
      "Stylised music video edit with beat-synced cuts, light leaks, and grain overlays.",
    embedId: "dQw4w9WgXcQ",
  },
];

const thumbnails: ImageItem[] = [
  {
    id: "t1",
    title: "Epic Montage",
    src: "/works/thumbnails/thumb-1.png",
    tags: ["YouTube", "Gaming"],
  },
  {
    id: "t2",
    title: "Dark Edit",
    src: "/works/thumbnails/thumb-2.png",
    tags: ["Cinematic", "Moody"],
  },
  {
    id: "t3",
    title: "Cinematic Thumbnail",
    src: "/works/thumbnails/thumb-3.png",
    tags: ["Portrait", "Drama"],
  },
  {
    id: "t4",
    title: "After Dark",
    src: "/works/thumbnails/thumb-4.png",
    tags: ["Aesthetic", "Neon"],
  },
];

const motionGraphics: ImageItem[] = [
  {
    id: "m1",
    title: "Particle Storm",
    src: "/works/vfx/vfx-1.png",
    tags: ["Particles", "After Effects"],
  },
  {
    id: "m2",
    title: "Energy Surge",
    src: "/works/vfx/vfx-2.png",
    tags: ["Glow", "Compositing"],
  },
  {
    id: "m3",
    title: "Title Reveal",
    src: "/works/vfx/vfx-3.png",
    tags: ["3D", "Typography"],
  },
  {
    id: "m4",
    title: "Liquid Sim",
    src: "/works/vfx/vfx-4.png",
    tags: ["Simulation", "Abstract"],
  },
];

/* ── Drag-scroll hook ─────────────────────────────────────────────── */

function useDragScroll(ref: React.RefObject<HTMLDivElement | null>) {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      isDragging.current = true;
      ref.current.style.cursor = "grabbing";
      startX.current = e.pageX - ref.current.offsetLeft;
      scrollLeft.current = ref.current.scrollLeft;
    },
    [ref]
  );

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (ref.current) ref.current.style.cursor = "grab";
  }, [ref]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current || !ref.current) return;
      e.preventDefault();
      const x = e.pageX - ref.current.offsetLeft;
      const walk = (x - startX.current) * 1.8;
      ref.current.scrollLeft = scrollLeft.current - walk;
    },
    [ref]
  );

  return { onMouseDown, onMouseUp, onMouseLeave: onMouseUp, onMouseMove };
}

/* ── Sub-components ───────────────────────────────────────────────── */

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-end justify-between mb-6 md:mb-8 px-4 sm:px-6 lg:px-12">
      <h3
        className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wider"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {label}
      </h3>

      {/* Scroll hint */}
      <span className="hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-wider uppercase text-neutral-600">
        <span className="w-6 h-px bg-neutral-700" />
        Drag to scroll
        <svg
          className="w-4 h-4 text-neutral-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </span>
    </div>
  );
}

function ShortCard({ item }: { item: ShortItem }) {
  return (
    <div className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px] group">
      {/* 9:16 vertical embed for Shorts */}
      <div className="relative w-full rounded-xl overflow-hidden border border-white/[0.06] bg-neutral-950" style={{ aspectRatio: "9/16" }}>
        <iframe
          src={`https://www.youtube.com/embed/${item.embedId}?rel=0&modestbranding=1`}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
        {/* Border glow on hover */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 group-hover:ring-red-500/20 transition-all duration-500 pointer-events-none" />
      </div>

      {/* Meta */}
      <div className="mt-4 px-1">
        <h4
          className="text-sm sm:text-base font-semibold text-white group-hover:text-red-100 transition-colors duration-300 truncate"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {item.title}
        </h4>
        <p className="text-xs text-neutral-500 mt-1 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>
    </div>
  );
}

function ThumbnailCard({ item }: { item: ImageItem }) {
  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[340px] md:w-[400px] group">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/[0.06] bg-neutral-950">
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          draggable={false}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <h4
            className="text-sm font-bold text-white truncate"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {item.title}
          </h4>
        </div>
        {/* Border glow */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 group-hover:ring-red-500/20 transition-all duration-500 pointer-events-none" />
      </div>

      {/* Tags */}
      <div className="mt-3 px-1 flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-neutral-800 text-neutral-500 group-hover:border-red-500/25 group-hover:text-red-400/70 transition-all duration-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function VFXCard({ item }: { item: ImageItem }) {
  return (
    <div className="flex-shrink-0 w-[300px] sm:w-[380px] md:w-[440px] group">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/[0.06] bg-neutral-950">
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          draggable={false}
        />
        {/* Play-style overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          <div className="w-14 h-14 rounded-full bg-red-600/80 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-red-900/30">
            <svg
              className="w-5 h-5 text-white ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Border glow */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 group-hover:ring-red-500/20 transition-all duration-500 pointer-events-none" />
      </div>

      <div className="mt-4 px-1">
        <h4
          className="text-sm sm:text-base font-semibold text-white group-hover:text-red-100 transition-colors duration-300 truncate"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {item.title}
        </h4>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-neutral-800 text-neutral-500 group-hover:border-red-500/25 group-hover:text-red-400/70 transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Carousel wrapper ─────────────────────────────────────────────── */

const Carousel = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    dragHandlers: ReturnType<typeof useDragScroll>;
  }
>(({ children, dragHandlers }, ref) => (
  <div
    ref={ref}
    className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-12 pb-4"
    style={{
      cursor: "grab",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      WebkitOverflowScrolling: "touch",
    }}
    {...dragHandlers}
  >
    {children}
    {/* Spacer at end for padding */}
    <div className="flex-shrink-0 w-4 md:w-12" aria-hidden />
  </div>
));
Carousel.displayName = "Carousel";

/* ── Main component ───────────────────────────────────────────────── */

export default function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subsectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const thumbsScrollRef = useRef<HTMLDivElement>(null);
  const shortsScrollRef = useRef<HTMLDivElement>(null);
  const vfxScrollRef = useRef<HTMLDivElement>(null);

  const thumbDrag = useDragScroll(thumbsScrollRef);
  const shortsDrag = useDragScroll(shortsScrollRef);
  const vfxDrag = useDragScroll(vfxScrollRef);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading entrance
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

      // Stagger each subsection
      subsectionRefs.current.forEach((sub, i) => {
        if (!sub) return;
        gsap.fromTo(
          sub,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: sub,
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

      <div className="relative z-10 w-full max-w-[1800px] mx-auto py-20 md:py-32">
        {/* ── Section heading ── */}
        <div
          ref={headingRef}
          className="mb-14 md:mb-20 px-4 sm:px-6 lg:px-12"
        >
          <span className="text-[10px] md:text-[11px] font-mono tracking-[0.35em] text-red-600 uppercase block mb-3">
            Portfolio
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
            <h2
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-normal text-white leading-none"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Our <span className="gradient-text">Works</span>
            </h2>
          </div>
          <div className="mt-6 md:mt-8 h-px w-12 md:w-16 bg-red-600" />
        </div>

        {/* ── 1. Thumbnails ── */}
        <div
          ref={(el) => {
            subsectionRefs.current[0] = el;
          }}
          className="mb-16 md:mb-24"
        >
          <SectionLabel label="Thumbnails" />
          <Carousel ref={thumbsScrollRef} dragHandlers={thumbDrag}>
            {thumbnails.map((t) => (
              <ThumbnailCard key={t.id} item={t} />
            ))}
          </Carousel>
        </div>

        {/* ── Divider ── */}
        <div className="px-4 sm:px-6 lg:px-12 mb-16 md:mb-24">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
        </div>

        {/* ── 2. Shorts ── */}
        <div
          ref={(el) => {
            subsectionRefs.current[1] = el;
          }}
          className="mb-16 md:mb-24"
        >
          <SectionLabel label="Shorts" />
          <Carousel ref={shortsScrollRef} dragHandlers={shortsDrag}>
            {shorts.map((s) => (
              <ShortCard key={s.id} item={s} />
            ))}
          </Carousel>
        </div>

        {/* ── Divider ── */}
        <div className="px-4 sm:px-6 lg:px-12 mb-16 md:mb-24">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
        </div>

        {/* ── 3. Motion Graphics / VFX ── */}
        <div
          ref={(el) => {
            subsectionRefs.current[2] = el;
          }}
        >
          <SectionLabel label="Motion Graphics / VFX" />
          <Carousel ref={vfxScrollRef} dragHandlers={vfxDrag}>
            {motionGraphics.map((m) => (
              <VFXCard key={m.id} item={m} />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
