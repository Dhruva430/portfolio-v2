"use client";

import React, { useEffect, useRef, useState } from "react";

interface FramePlayerProps {
  framePath: string;
  totalFrames: number;
  fps?: number;
  width?: number;
  height?: number;
}

export default function FramePlayer({
  framePath,
  totalFrames,
  fps = 24,
  width = 800,
  height = 450,
}: FramePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, "0");
      img.src = `/frames/${framePath}/${paddedIndex}.jpg`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setLoaded(true);
        }
      };

      imgArray.push(img);
    }

    setImages(imgArray);
  }, [framePath, totalFrames]);

  useEffect(() => {
    if (!loaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let frameIndex = 0;
    let lastTime = performance.now();
    const interval = 1000 / fps;
    let animationFrameId: number;

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);

      const delta = currentTime - lastTime;
      if (delta > interval) {
        lastTime = currentTime - (delta % interval);

        if (ctx && images[frameIndex]) {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(images[frameIndex], 0, 0, width, height);
        }

        frameIndex = (frameIndex + 1) % totalFrames;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [loaded, images, fps, totalFrames, width, height]);

  return (
    <div className="relative flex flex-col items-center justify-center bg-black border border-neutral-800 rounded-lg overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-neutral-400 text-sm">
          Preloading {totalFrames} frames...
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block max-w-full h-auto"
      />
    </div>
  );
}