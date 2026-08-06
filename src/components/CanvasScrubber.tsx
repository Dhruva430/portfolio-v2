"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CanvasScrubberProps {
  framePath: "main" | "eyes";
  totalFrames: number;
  className?: string;
  /** Multiplier of viewport height for the frame-scrub distance (e.g. 1.2 = 1.2x screen height) */
  scrollMultiplier?: number;
  /**
   * Fraction of the pinned range reserved after the last frame. The final frame
   * holds through it while the canvas dissolves, so the pin releases into black
   * instead of cutting mid-image. Added on top of scrollMultiplier, which keeps
   * describing the frame-scrub distance alone.
   */
  tailHold?: number;
  onProgress?: (progress: number) => void;
  /**
   * Fired when the last frame is reached going forward — before the dissolve
   * tail, so a handler can take over the remaining scroll. Re-arms if the
   * viewer scrolls back below the last frame.
   */
  onComplete?: () => void;
  children?: React.ReactNode;
  /** If true, all frames are fetched with high browser priority */
  priority?: boolean;
}

export default function CanvasScrubber({
  framePath,
  totalFrames = 66,
  className = "",
  scrollMultiplier = 1.25,
  tailHold = 0.16,
  onProgress,
  onComplete,
  children,
  priority = false,
}: CanvasScrubberProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Frames live in a ref: the ScrollTrigger must not be torn down and rebuilt
  // every time another image lands.
  const imagesRef = useRef<HTMLImageElement[]>([]);
  // Set by the trigger effect so a late-arriving image can repaint the frame
  // currently under the playhead.
  const redrawRef = useRef<(() => void) | null>(null);
  // Held in a ref so an unstable callback identity can never rebuild the
  // ScrollTrigger — rebuilding it mid-scroll is what broke restored positions.
  const onCompleteRef = useRef(onComplete);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Preload frames
  useEffect(() => {
    const imgArray: HTMLImageElement[] = new Array(totalFrames);
    imagesRef.current = imgArray;

    let count = 0;
    let raf: number | null = null;
    let cancelled = false;

    // Batch progress into one state update per frame — 66 individual setStates
    // during load is a lot of wasted rendering.
    const flush = () => {
      raf = null;
      if (!cancelled) setLoadedCount(count);
    };

    const onSettled = () => {
      if (cancelled) return;
      count++;
      redrawRef.current?.();
      if (raf === null) raf = requestAnimationFrame(flush);
    };

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      // Frame 1 is what the viewer sees first, so it always jumps the queue.
      if (priority || i === 1) img.fetchPriority = "high";
      img.src = `/frames/${framePath}/${String(i).padStart(3, "0")}.webp`;
      imgArray[i - 1] = img;

      if (img.complete && img.naturalWidth > 0) {
        onSettled();
      } else {
        img.onload = onSettled;
        // Count errors too, otherwise one missing file pins the loader forever.
        img.onerror = onSettled;
      }
    }

    return () => {
      cancelled = true;
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [framePath, totalFrames, priority]);

  // Canvas render & GSAP ScrollTrigger. Built once on mount — NOT gated on
  // images being loaded. The pin has to reserve its scroll space immediately,
  // or every section below the hero shifts down when it appears and restored
  // scroll positions land wrong.
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !pinRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // What the playhead wants vs what is actually painted. They diverge while
    // an image is still decoding, and that gap is what lets a late arrival
    // repaint the correct frame instead of being dropped.
    let wantedFrame = 0;
    let lastRenderedFrame = -1;

    const renderFrame = (rawIndex: number, force = false) => {
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.max(0, Math.round(rawIndex))
      );
      wantedFrame = frameIndex;

      if (!force && frameIndex === lastRenderedFrame) return;

      const img = imagesRef.current[frameIndex];
      // Leave lastRenderedFrame untouched so this frame is retried once its
      // image decodes; the previous good frame stays on screen meanwhile.
      if (!img || !img.complete || img.naturalWidth === 0) return;
      lastRenderedFrame = frameIndex;

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

    redrawRef.current = () => renderFrame(wantedFrame, true);

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      renderFrame(wantedFrame, true);
    };

    updateCanvasSize();

    // Frames consume everything before the tail; the tail is pure dissolve.
    const frameSpan = Math.max(0.01, 1 - tailHold);

    // Grow the pin by the tail so frame pacing itself is unchanged by it.
    const scrollDistance = Math.round(
      (window.innerHeight * scrollMultiplier) / frameSpan
    );

    const applyOutro = (progress: number) => {
      const t = Math.min(1, Math.max(0, (progress - frameSpan) / tailHold));
      // ease-in — the frame stays crisp, then falls away quickly at the very end
      const eased = t * t * t;
      gsap.set(canvas, { opacity: 1 - eased, scale: 1 + eased * 0.08 });
    };

    // null until the first sync establishes a baseline, so a page that loads
    // already past the sequence does not immediately fire onComplete.
    let framesDone: boolean | null = null;

    // Single source of truth for "what should be on screen at this progress".
    const sync = (progress: number) => {
      onProgress?.(progress);
      renderFrame(Math.min(1, progress / frameSpan) * (totalFrames - 1));
      applyOutro(progress);

      // Fire the moment the final frame lands — not at the pin release — so
      // the dissolve tail plays out under the auto-advance rather than
      // waiting on the viewer to scroll through it.
      const done = progress >= frameSpan;
      if (framesDone === null) {
        framesDone = done;
      } else if (done !== framesDone) {
        framesDone = done;
        if (done) onCompleteRef.current?.();
      }
    };

    // scrub only smooths a linked animation, so the playhead is tweened rather
    // than read straight off the trigger — that is what eases the frame flips.
    const playhead = { progress: 0 };

    const tween = gsap.to(playhead, {
      progress: 1,
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
        // Boundary guards for fast flicks that skip the final onUpdate.
        onLeave: () => sync(1),
        onLeaveBack: () => sync(0),
        // After a resize/refresh the range moved — re-adopt the new progress
        // rather than keeping whatever frame happened to be drawn.
        onRefresh: (self) => sync(self.progress),
      },
      onUpdate: () => sync(playhead.progress),
    });

    window.addEventListener("resize", updateCanvasSize);
    ScrollTrigger.refresh();

    // Adopt the position the page actually loaded at. Without this the canvas
    // sits on frame 1 at full opacity until the next scroll event, which is
    // what made a mid-page refresh look broken on the way back up.
    sync(tween.scrollTrigger?.progress ?? 0);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      redrawRef.current = null;
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(canvas, { clearProps: "opacity,transform" });
    };
  }, [totalFrames, scrollMultiplier, tailHold, onProgress]);

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
          style={{ willChange: "opacity, transform", transformOrigin: "center" }}
        />
        {children}
      </div>
    </div>
  );
}
