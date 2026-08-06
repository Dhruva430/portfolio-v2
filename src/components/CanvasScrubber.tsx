"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CanvasScrubberProps {
  framePath: "main" | "eyes";
  totalFrames: number;
  className?: string;
  /** Multiplier of viewport height for the total scrub scroll distance (e.g. 1.2 = 1.2x screen height) */
  scrollMultiplier?: number;
  onProgress?: (progress: number) => void;
  children?: React.ReactNode;
  /** If true, all frames are fetched with high browser priority */
  priority?: boolean;
}

export default function CanvasScrubber({
  framePath,
  totalFrames = 66,
  className = "",
  scrollMultiplier = 1.25,
  onProgress,
  children,
  priority = false,
}: CanvasScrubberProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  // Preload frames
  useEffect(() => {
    let count = 0;
    const imgArray: HTMLImageElement[] = new Array(totalFrames);

    const onLoad = () => {
      count++;
      setLoadedCount(count);
    };

    // Load frame 1 first with high priority
    const firstImg = new Image();
    firstImg.fetchPriority = "high";
    firstImg.src = `/frames/${framePath}/001.webp`;
    firstImg.onload = () => {
      imgArray[0] = firstImg;
      onLoad();
    };
    imgArray[0] = firstImg;

    // Load remaining frames
    for (let i = 2; i <= totalFrames; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, "0");
      img.src = `/frames/${framePath}/${paddedIndex}.webp`;
      if (priority) img.fetchPriority = "high";
      img.onload = () => {
        imgArray[i - 1] = img;
        onLoad();
      };
      imgArray[i - 1] = img;
    }

    setImages(imgArray);
  }, [framePath, totalFrames, priority]);

  // Canvas render & GSAP ScrollTrigger
  useEffect(() => {
    if (
      loadedCount < totalFrames ||
      !canvasRef.current ||
      !containerRef.current ||
      !pinRef.current
    )
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let lastRenderedFrame = -1;

    const renderFrame = (rawIndex: number, force = false) => {
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.max(0, Math.round(rawIndex))
      );

      if (!force && frameIndex === lastRenderedFrame) return;
      lastRenderedFrame = frameIndex;

      const img = images[frameIndex];
      if (!img || !img.complete) return;

      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;

      const imgRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = canvasWidth / imgRatio;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawWidth = canvasHeight * imgRatio;
        offsetX =
          canvasHeight > canvasWidth
            ? (canvasWidth - drawWidth) * 0.27
            : (canvasWidth - drawWidth) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      renderFrame(lastRenderedFrame >= 0 ? lastRenderedFrame : 0, true);
    };

    updateCanvasSize();

    const scrollDistance = Math.round(window.innerHeight * scrollMultiplier);
    const playhead = { frame: 0 };

    const tween = gsap.to(playhead, {
      frame: totalFrames - 1,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${scrollDistance}`,
        pin: pinRef.current,
        pinSpacing: true,
        scrub: 0.15,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          onProgress?.(self.progress);
        },
      },
      onUpdate: () => {
        renderFrame(playhead.frame);
      },
    });

    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [loadedCount, totalFrames, images, scrollMultiplier, onProgress]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center"
      >
        {loadedCount < totalFrames && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50 text-neutral-400 font-mono text-xs tracking-widest">
            <span>LOADING // {framePath.toUpperCase()}</span>
            <span className="mt-2 text-red-500 font-bold">
              {Math.round((loadedCount / totalFrames) * 100)}%
            </span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full h-full block object-cover pointer-events-none select-none"
        />
        {children}
      </div>
    </div>
  );
}
