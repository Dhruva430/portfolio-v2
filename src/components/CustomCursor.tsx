"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef    = useRef<HTMLDivElement>(null);
  const dotRef       = useRef<HTMLDivElement>(null);
  const circleRef    = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot    = dotRef.current;
    const circle = circleRef.current;
    if (!cursor || !dot || !circle) return;

    // Kill system cursor everywhere — including pointer on links/buttons
    const styleEl = document.createElement("style");
    styleEl.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(styleEl);

    const onMouseMove = (e: MouseEvent) => {
      gsap.set(dot,    { x: e.clientX, y: e.clientY });
      gsap.to(cursor,  { x: e.clientX, y: e.clientY, duration: 0.18, ease: "power2.out" });
    };

    // Hover: fill circle solid red, shrink dot
    const onEnter = () => {
      gsap.to(cursor, { scale: 1.4, duration: 0.2, ease: "power2.out" });
      gsap.to(circle, { attr: { fill: "#dc2626", fillOpacity: 1 }, duration: 0.2 });
      gsap.to(dot,    { scale: 0, duration: 0.15 });
    };
    // Leave: revert to hollow ring
    const onLeave = () => {
      gsap.to(cursor, { scale: 1,   duration: 0.2, ease: "power2.out" });
      gsap.to(circle, { attr: { fill: "none", fillOpacity: 0 }, duration: 0.2 });
      gsap.to(dot,    { scale: 1,   duration: 0.15 });
    };

    // Click burst
    const onMouseDown = () => gsap.to(cursor, { scale: 0.75, duration: 0.1 });
    const onMouseUp   = () => gsap.to(cursor, { scale: 1,    duration: 0.15 });

    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mousedown",  onMouseDown);
    window.addEventListener("mouseup",    onMouseUp);

    const hoverTargets = document.querySelectorAll("a, button, [role='button']");
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      styleEl.remove();
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mousedown",  onMouseDown);
      window.removeEventListener("mouseup",    onMouseUp);
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Outer ring — lags behind */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle
            ref={circleRef}
            cx="16"
            cy="16"
            r="14"
            stroke="#dc2626"
            strokeWidth="1.5"
            fill="none"
            fillOpacity="0"
          />
        </svg>
      </div>

      {/* Center dot — instant */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
          <circle cx="3" cy="3" r="3" fill="#dc2626" />
        </svg>
      </div>
    </>
  );
}
