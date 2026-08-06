"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: "◆",
    title: "Photo Editing",
    description:
      "We polish your photos with clean retouching, natural skin textures, and custom color grading so they look high-end without feeling over-edited.",
    tags: ["Retouching", "Color Grading", "Compositing", "Restoration"],
  },
  {
    icon: "▶",
    title: "Video Editing",
    description:
      "Crisp, engaging cuts for your YouTube videos, promos, and long-form content. We handle the pacing, motion graphics, and sound design to keep your viewers watching.",
    tags: ["Long-form", "Motion Graphics", "Promos", "YouTube"],
  },
  {
    icon: "⚡",
    title: "Shorts",
    description:
      "Scroll-stopping short videos for Instagram Reels, YouTube Shorts, and TikTok. Built with quick cuts, clean captions, and strong hooks that hold attention.",
    tags: ["Reels", "YT Shorts", "TikTok", "Hook Writing"],
  },
  {
    icon: "▣",
    title: "Thumbnail Design",
    description:
      "Eye-catching, high-contrast thumbnails made to boost your click-through rates. We dial in the visual hierarchy, text placement, and colors to help your content stand out.",
    tags: ["YouTube", "A/B Testing", "CTR", "Branding"],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector(".services-title"),
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

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.15,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
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
      id="services"
      ref={sectionRef}
      className="relative w-full bg-[#0a0a0a] py-20 md:py-32 px-4 sm:px-6"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="services-title mb-12 md:mb-20">
          <span className="text-[10px] md:text-[12px] font-mono tracking-[0.3em] text-red-600 uppercase block mb-2">
            What We Do
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Our <span className="gradient-text">Services</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, i) => (
            <div
              key={service.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group relative p-5 md:p-8 rounded-2xl glass hover:border-red-500/20 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <span className="text-3xl text-red-500 block mb-6">
                  {service.icon}
                </span>
                <h3
                  className="text-xl font-bold text-white mb-3 tracking-tight"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {service.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-neutral-800 text-neutral-500 group-hover:border-red-500/30 group-hover:text-red-400/70 transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
