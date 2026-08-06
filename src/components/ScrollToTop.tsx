"use client";

import React, { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleClick = () => {
    // Instantly scroll to top and reload the page as requested
    window.scrollTo({ top: 0, behavior: "instant" });
    window.location.reload();
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      aria-label="Reload to top"
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-red-600/90 text-white shadow-lg backdrop-blur-md border border-red-500/30 hover:bg-red-600 hover:scale-110 transition-all duration-300 group"
    >
      <svg
        className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
