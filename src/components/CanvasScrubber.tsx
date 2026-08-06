"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CanvasScrubberProps {
  framePath: "main" | "eyes";
  totalFrames: number;
  className?: string;
  /** Pixels of scroll required per frame — higher = longer hold */
  pixelsPerFrame?: number;
  onProgress?: (progress: number) => void;
  children?: React.ReactNode;
  /** If true, all frames are fetched with high browser priority */
  priority?: boolean;
}

export default function CanvasScrubber({
  framePath,
  totalFrames = 66,
  className = "",
  pixelsPerFrame = 50,
  onProgress,
  children,
  priority = false,
}: CanvasScrubberProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

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

  useEffect(() => {
    if (
      loadedCount < totalFrames ||
      !canvasRef.current ||
      !containerRef.current ||
      !pinRef.current
    )
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let currentFrame = -1;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (currentFrame >= 0) renderFrame(currentFrame);
    };

    const renderFrame = (index: number) => {
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.max(0, Math.round(index))
      );
      currentFrame = frameIndex;

      const img = images[frameIndex];
      if (!img) return;

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
        // Portrait (mobile): anchor left edge so right portion bleeds off-screen.
        // Landscape (desktop): keep classic center crop.
        offsetX = canvasHeight > canvasWidth
          ? (canvasWidth - drawWidth) * 0.27   // portrait: 25% into the overflow → less left
          : (canvasWidth - drawWidth) / 2;     // landscape: classic center crop
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    renderFrame(0);

    const scrollDistance = Math.max(
      window.innerHeight * 2.5,
      totalFrames * pixelsPerFrame
    );

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${scrollDistance}`,
      pin: pinRef.current,
      pinSpacing: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        onProgress?.(progress);
        renderFrame(progress * (totalFrames - 1));
      },
    });

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      trigger.kill();
    };
  }, [loadedCount, totalFrames, images, pixelsPerFrame, onProgress]);

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
