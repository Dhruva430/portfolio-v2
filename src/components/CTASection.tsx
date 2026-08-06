"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector(".cta-content"),
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full py-24 md:py-40 px-4 sm:px-6"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-red-950/10 to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.08)_0%,_transparent_70%)]" />

      <div className="cta-content relative max-w-3xl mx-auto text-center">
        <span className="text-[12px] font-mono tracking-[0.3em] text-red-500 uppercase block mb-4">
          Let&apos;s Work Together
        </span>
        <h2
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Got an idea in mind?
          <br />
          Let&apos;s make it <span className="gradient-text">happen</span>.
        </h2>
        <p className="text-neutral-400 text-sm md:text-base lg:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Whether you need a fresh brand identity, photo retouching, or fast-paced video edits for your channel, we&apos;d love to work together.
        </p>
        <a
          href="mailto:hello@amdesigns.com"
          className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-red-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all duration-300 hover:-translate-y-0.5"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Get in Touch
          <span className="text-sm">→</span>
        </a>
      </div>
    </section>
  );
}
