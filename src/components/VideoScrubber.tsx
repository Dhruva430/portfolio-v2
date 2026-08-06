"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface VideoScrubberProps {
  src: string;
  className?: string;
  priority?: boolean;
}

export default function VideoScrubber({
  src,
  className = "",
  priority = false,
}: VideoScrubberProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Ensure metadata is loaded to calculate duration accurately
    const handleLoadedMetadata = () => {
      setIsLoaded(true);

      gsap.to(video, {
        currentTime: video.duration || 1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1, // Smooth dampening factor
        },
      });
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [src]);

  return (
    <div ref={containerRef} className={`relative h-[300vh] w-full ${className}`}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-950">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950 z-10">
            <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload={priority ? "auto" : "metadata"}
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      </div>
    </div>
  );
}