"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let lastScrollY = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        gsap.to(nav, { y: -100, duration: 0.4, ease: "power2.out" });
      } else {
        gsap.to(nav, { y: 0, duration: 0.4, ease: "power2.out" });
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
    >
      <div className="w-full px-8 py-4 flex items-center justify-between">

        {/* ── LEFT: Nav links ── */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="relative text-[13px] font-medium text-neutral-400 hover:text-white transition-colors duration-200 tracking-wide uppercase group"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-red-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* ── RIGHT: CTA (rectangle) + mobile toggle ── */}
        <div className="flex items-center gap-4">
          <a
            href="#contact"
            onClick={(e) => handleClick(e, "#contact")}
            className="hidden md:inline-flex px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest bg-red-600 text-white hover:bg-red-500 transition-colors duration-200 hover:shadow-[0_0_20px_rgba(220,38,38,0.35)]"
          >
            Get in Touch
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-px bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-1" : ""}`} />
            <span className={`w-5 h-px bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-0.5" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 px-8 py-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="text-base font-medium text-neutral-300 hover:text-red-400 transition-colors uppercase tracking-wider"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleClick(e, "#contact")}
            className="mt-2 inline-flex justify-center px-6 py-3 text-sm font-bold uppercase tracking-widest bg-red-600 text-white hover:bg-red-500 transition-all"
          >
            Get in Touch
          </a>
        </div>
      )}
    </nav>
  );
}
