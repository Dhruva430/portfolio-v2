"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Download, Send } from "lucide-react";
import {
  CONTACT_FORM_FIELDS,
  CONTACT_FORM_URL,
  GITHUB_URL,
  LINKEDIN_URL,
  MAIL_ADDRESS,
  RESUME_FILENAME,
  RESUME_URL,
} from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

type Status = "idle" | "sending" | "success" | "error";

const socials = [
  { name: "GitHub", href: GITHUB_URL },
  { name: "LinkedIn", href: LINKEDIN_URL },
  { name: "Email", href: `mailto:${MAIL_ADDRESS}` },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector(".contact-content"),
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
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

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const body = new FormData();
    body.append(CONTACT_FORM_FIELDS.name, form.name);
    body.append(CONTACT_FORM_FIELDS.email, form.email);
    body.append(CONTACT_FORM_FIELDS.subject, form.subject);
    body.append(CONTACT_FORM_FIELDS.message, form.message);

    try {
      // Google Forms doesn't send CORS headers, so we fire-and-forget.
      await fetch(CONTACT_FORM_URL, { method: "POST", mode: "no-cors", body });
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-600 focus:bg-white/[0.05] transition-colors duration-200";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 px-4 sm:px-6"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-red-950/10 to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.08)_0%,_transparent_70%)]" />

      <div className="contact-content relative max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* ── Left: pitch, resume, socials ── */}
          <div>
            <span className="text-[12px] font-mono tracking-[0.3em] text-red-500 uppercase block mb-4">
              Let&apos;s Work Together
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Got something to build?
              <br />
              Let&apos;s <span className="gradient-text">ship</span> it.
            </h2>
            <p className="text-neutral-400 text-sm md:text-base mb-8 max-w-md leading-relaxed">
              Whether it is an API that needs to hold up under load, a full stack
              build, a frontend rewrite, or a custom Shopify storefront — I would
              like to hear about it.
            </p>

            {/* Resume download */}
            <a
              href={RESUME_URL}
              download={RESUME_FILENAME}
              className="inline-flex items-center gap-3 px-7 py-3.5 border border-red-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-600 hover:shadow-[0_0_25px_rgba(220,38,38,0.35)] transition-all duration-300"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>

            {/* Direct email + socials */}
            <div className="mt-10 space-y-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${MAIL_ADDRESS}`}
                  className="text-sm text-neutral-200 hover:text-red-400 transition-colors"
                >
                  {MAIL_ADDRESS}
                </a>
              </div>
              <div className="flex items-center gap-5">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-[12px] text-neutral-400 hover:text-white uppercase tracking-widest transition-colors duration-200"
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: contact form ── */}
          <form onSubmit={onSubmit} className="glass p-6 sm:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  placeholder="youremail@xyz.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2"
              >
                Subject
              </label>
              <input
                id="subject"
                required
                value={form.subject}
                onChange={update("subject")}
                placeholder="Subject of your message"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={update("message")}
                placeholder="Tell me about your project, idea, or just say hello..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {status === "sending" ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>

            {status === "success" && (
              <p className="text-sm text-green-400 text-center" role="status">
                Message sent — thanks, I&apos;ll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-400 text-center" role="status">
                Something went wrong. Please email me directly instead.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
