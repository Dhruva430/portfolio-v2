"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "AM Designs gave our brand a whole new level of polish. Super easy to work with and always on point with revisions.",
    name: "Priya Sharma",
    role: "Founder, Bloom Studio",
  },
  {
    quote: "The turnaround on our reels was crazy fast, and the edits immediately bumped up our engagement.",
    name: "Rahul Verma",
    role: "Content Creator",
  },
  {
    quote: "Whenever we need crisp graphics or photo retouches on a tight deadline, they're the first team we message.",
    name: "Ananya Patel",
    role: "Marketing Head, Voxel",
  },
  {
    quote: "They really understand modern aesthetic trends without overcomplicating things. Everything looks sharp and deliberate.",
    name: "Karan Singh",
    role: "CEO, Drift Media",
  },
  {
    quote: "Handing over our social content editing freed up so much time for us, and the visual quality is leagues ahead.",
    name: "Meera Joshi",
    role: "Brand Manager, Aura",
  },
  {
    quote: "From the first draft to final export, the communication is effortless and the output is consistently high quality.",
    name: "Arjun Nair",
    role: "Director, Pixel Works",
  },
];

const row1 = testimonials.slice(0, 3);
const row2 = testimonials.slice(3, 6);

function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="flex-shrink-0 w-[400px] p-8 rounded-2xl glass mx-3 hover:border-red-500/20 transition-all duration-300">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-red-500 text-2xl leading-none">&ldquo;</span>
      </div>
      <p className="text-sm text-neutral-300 leading-relaxed mb-6">{quote}</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold text-xs">
          {name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-[11px] text-neutral-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector(".testimonials-title"),
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative w-full bg-[#0a0a0a] py-20 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 md:mb-16">
        <div className="testimonials-title">
          <span className="text-[10px] md:text-[12px] font-mono tracking-[0.3em] text-red-600 uppercase block mb-2">
            Client Feedback
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            What People <span className="gradient-text">Say</span>
          </h2>
        </div>
      </div>

      <div className="marquee-container mb-6">
        <div className="flex animate-marquee">
          {[...row1, ...row1, ...row1, ...row1].map((t, i) => (
            <TestimonialCard key={`r1-${i}`} {...t} />
          ))}
        </div>
      </div>

      <div className="marquee-container">
        <div className="flex animate-marquee-reverse">
          {[...row2, ...row2, ...row2, ...row2].map((t, i) => (
            <TestimonialCard key={`r2-${i}`} {...t} />
          ))}
        </div>
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
