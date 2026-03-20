"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ─── types ─── */
type AppState = "intro" | "camera" | "captured" | "analysing" | "result";

interface AnalysisResult {
  score: number; // 0–100
  foamY: number; // normalised 0–1 where foam line was detected
  idealY: number; // normalised 0–1 where perfect split would be
  deviation: number; // pixels of deviation
  grade: string;
  message: string;
}

/* ─── helpers ─── */
function gradeFromScore(s: number): { grade: string; message: string } {
  if (s >= 95) return { grade: "S", message: "Perfection. Guinness would be proud." };
  if (s >= 85) return { grade: "A", message: "Stunning split! A thing of beauty." };
  if (s >= 70) return { grade: "B", message: "Great effort — nearly nailed it." };
  if (s >= 55) return { grade: "C", message: "Decent split. Room for improvement." };
  if (s >= 40) return { grade: "D", message: "Not quite there. Keep practising." };
  if (s >= 20) return { grade: "E", message: "Rough one. Have another go." };
  return { grade: "F", message: "Did you even try? Order another pint." };
}

function scoreColour(s: number): string {
  if (s >= 85) return "#22c55e";
  if (s >= 70) return "#84cc16";
  if (s >= 55) return "#f77614";
  if (s >= 40) return "#f59e0b";
  return "#ef4444";
}

/* ─── image analysis ─── */
function analyseImage(canvas: HTMLCanvasElement): AnalysisResult {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const w = canvas.width;
  const h = canvas.height;

  /*
   * Strategy:
   * 1. Scan a vertical strip down the centre of the image (middle 40%)
   * 2. For each row compute average brightness
   * 3. The foam line is where brightness drops sharply (cream foam → dark stout)
   *    We look from top → bottom for a bright→dark transition
   * 4. The ideal "split" position is roughly at 38% from top of glass
   *    (the G on a Guinness glass sits about 38-42% from the rim)
   */

  const stripLeft = Math.floor(w * 0.3);
  const stripRight = Math.floor(w * 0.7);
  const stripWidth = stripRight - stripLeft;

  // Compute average brightness per row
  const rowBrightness: number[] = [];
  for (let y = 0; y < h; y++) {
    const imgData = ctx.getImageData(stripLeft, y, stripWidth, 1).data;
    let totalBrightness = 0;
    for (let i = 0; i < imgData.length; i += 4) {
      totalBrightness += imgData[i] * 0.299 + imgData[i + 1] * 0.587 + imgData[i + 2] * 0.114;
    }
    rowBrightness.push(totalBrightness / (stripWidth));
  }

  // Smooth brightness values (moving average of 5 rows)
  const smoothed: number[] = [];
  const windowSize = Math.max(5, Math.floor(h * 0.01));
  for (let y = 0; y < h; y++) {
    let sum = 0;
    let count = 0;
    for (let dy = -windowSize; dy <= windowSize; dy++) {
      const idx = y + dy;
      if (idx >= 0 && idx < h) {
        sum += rowBrightness[idx];
        count++;
      }
    }
    smoothed.push(sum / count);
  }

  // Find the largest brightness drop (foam → stout transition)
  // Search in the middle 80% of the image vertically
  const searchTop = Math.floor(h * 0.1);
  const searchBottom = Math.floor(h * 0.9);

  let maxDrop = 0;
  let foamLineY = Math.floor(h * 0.4); // default fallback

  // Look for the biggest sustained drop in brightness
  const dropWindow = Math.max(3, Math.floor(h * 0.02));
  for (let y = searchTop; y < searchBottom - dropWindow; y++) {
    const drop = smoothed[y] - smoothed[y + dropWindow];
    if (drop > maxDrop) {
      maxDrop = drop;
      foamLineY = y + Math.floor(dropWindow / 2);
    }
  }

  // Also check if there's a dark→light transition (stout on top, foam below — inverted glass)
  let maxRise = 0;
  let riseY = foamLineY;
  for (let y = searchTop; y < searchBottom - dropWindow; y++) {
    const rise = smoothed[y + dropWindow] - smoothed[y];
    if (rise > maxRise) {
      maxRise = rise;
      riseY = y + Math.floor(dropWindow / 2);
    }
  }

  // If the rise is bigger than the drop, use that (image might be upside down / dark above foam)
  if (maxRise > maxDrop) {
    foamLineY = riseY;
  }

  // The ideal split position: the G sits at roughly 38% from top of glass
  // (when glass fills most of the frame)
  const idealY = 0.38;
  const foamYNormalised = foamLineY / h;

  // Calculate deviation (how far off from ideal)
  const deviation = Math.abs(foamYNormalised - idealY);

  // Score: 100 when perfect, dropping off as deviation increases
  // At 20% deviation → score ~0
  const maxDeviation = 0.20;
  const rawScore = Math.max(0, 1 - deviation / maxDeviation) * 100;
  const score = Math.round(rawScore);

  const { grade, message } = gradeFromScore(score);

  return {
    score,
    foamY: foamYNormalised,
    idealY,
    deviation,
    grade,
    message,
  };
}

/* ─── guide overlay (SVG) ─── */
function GuideOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div className="relative" style={{ width: "60%", height: "75%" }}>
        {/* Glass outline */}
        <svg
          viewBox="0 0 120 200"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pint glass shape */}
          <path
            d="M25 10 L20 180 Q20 195 35 195 L85 195 Q100 195 100 180 L95 10 Z"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.5"
            fill="none"
          />
          {/* G target zone */}
          <line
            x1="30"
            y1="76"
            x2="90"
            y2="76"
            stroke="#f77614"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.8"
          />
          {/* G label */}
          <text
            x="60"
            y="70"
            textAnchor="middle"
            fill="#f77614"
            fontSize="10"
            fontWeight="bold"
            opacity="0.9"
          >
            SPLIT HERE
          </text>
        </svg>
      </div>
    </div>
  );
}

/* ─── score ring ─── */
function ScoreRing({
  score,
  grade,
  animate,
}: {
  score: number;
  grade: string;
  animate: boolean;
}) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colour = scoreColour(score);

  return (
    <div className="relative w-52 h-52 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        {/* Background ring */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="12"
        />
        {/* Score ring */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={colour}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? offset : circumference}
          style={{
            transition: animate ? "stroke-dashoffset 1.5s ease-out" : "none",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-5xl font-bold tabular-nums"
          style={{ color: colour }}
        >
          {animate ? score : 0}
        </span>
        <span className="text-xs text-[#8a8a8a] mt-1 tracking-widest uppercase">
          / 100
        </span>
        <span
          className="text-2xl font-bold mt-2"
          style={{ color: colour }}
        >
          {grade}
        </span>
      </div>
    </div>
  );
}

/* ─── result overlay on captured image ─── */
function ResultOverlayCanvas({
  imageSrc,
  result,
}: {
  imageSrc: string;
  result: AnalysisResult;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const foamPixelY = result.foamY * img.height;
      const idealPixelY = result.idealY * img.height;

      // Draw ideal line (green dashed)
      ctx.setLineDash([10, 6]);
      ctx.strokeStyle = "rgba(34,197,94,0.7)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, idealPixelY);
      ctx.lineTo(img.width, idealPixelY);
      ctx.stroke();

      // Draw detected foam line (orange solid)
      ctx.setLineDash([]);
      ctx.strokeStyle = "#f77614";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, foamPixelY);
      ctx.lineTo(img.width, foamPixelY);
      ctx.stroke();

      // Labels
      ctx.font = `bold ${Math.max(14, img.width * 0.03)}px sans-serif`;
      ctx.fillStyle = "#22c55e";
      ctx.fillText("IDEAL", 10, idealPixelY - 8);
      ctx.fillStyle = "#f77614";
      ctx.fillText("YOUR SPLIT", 10, foamPixelY - 8);
    };
    img.src = imageSrc;
  }, [imageSrc, result]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-2xl border border-white/[0.07]"
    />
  );
}

/* ─── main page ─── */
export default function SplitTheGPage() {
  const [state, setState] = useState<AppState>("intro");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [animateScore, setAnimateScore] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── camera ── */
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 1920 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setState("camera");
    } catch {
      setCameraError(
        "Could not access camera. Please allow camera permissions or upload a photo instead."
      );
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const flipCamera = useCallback(() => {
    stopCamera();
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  }, [stopCamera]);

  // Restart camera when facing mode changes while in camera state
  useEffect(() => {
    if (state === "camera") {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  /* ── capture ── */
  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);

    setCapturedImage(canvas.toDataURL("image/jpeg", 0.9));
    stopCamera();
    setState("captured");
  }, [stopCamera]);

  /* ── file upload ── */
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        setCapturedImage(reader.result as string);
        stopCamera();
        setState("captured");
      };
      reader.readAsDataURL(file);
    },
    [stopCamera]
  );

  /* ── analyse ── */
  const analyse = useCallback(() => {
    if (!capturedImage) return;
    setState("analysing");

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const analysisResult = analyseImage(canvas);

      // Small delay for dramatic effect
      setTimeout(() => {
        setResult(analysisResult);
        setState("result");
        // Trigger animation after mount
        setTimeout(() => setAnimateScore(true), 100);
      }, 1500);
    };
    img.src = capturedImage;
  }, [capturedImage]);

  /* ── reset ── */
  const reset = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
    setAnimateScore(false);
    setCameraError(null);
    setState("intro");
  }, []);

  /* ── cleanup on unmount ── */
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="min-h-dvh bg-[#141414] text-[#f0f0f0] flex flex-col">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Split the G</h1>
        <p className="text-xs text-[#8a8a8a] mt-1">
          The Guinness pint challenge
        </p>
      </header>

      <main className="flex-1 flex flex-col px-4 pb-8">
        {/* ── INTRO ── */}
        {state === "intro" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-md mx-auto text-center">
            {/* Pint icon */}
            <div className="w-24 h-24 rounded-full bg-white/[0.05] border border-white/[0.07] flex items-center justify-center">
              <svg
                viewBox="0 0 48 48"
                className="w-12 h-12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 6L12 42C12 44 14 46 18 46H30C34 46 36 44 36 42L34 6H14Z"
                  fill="#1a1a1a"
                  stroke="#f77614"
                  strokeWidth="2"
                />
                <rect x="14" y="6" width="20" height="12" rx="1" fill="#fef3c7" opacity="0.9" />
                <line x1="12" y1="20" x2="36" y2="20" stroke="#f77614" strokeWidth="1.5" strokeDasharray="3 2" />
                <text x="24" y="34" textAnchor="middle" fill="#f77614" fontSize="10" fontWeight="bold">
                  G
                </text>
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">How it works</h2>
              <ol className="text-sm text-[#8a8a8a] space-y-2 text-left list-decimal list-inside">
                <li>Take your first sip of Guinness</li>
                <li>Snap a photo of the glass showing the foam line</li>
                <li>We&apos;ll analyse how well you split the G</li>
                <li>Get your score out of 100</li>
              </ol>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => startCamera()}
                className="w-full px-4 py-3 rounded-xl bg-[#f77614] text-white font-semibold text-sm hover:bg-[#e06810] transition-colors"
              >
                Open Camera
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.07] text-[#f0f0f0] text-sm hover:bg-white/[0.08] transition-colors"
              >
                Upload Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {cameraError && (
              <p className="text-xs text-red-400 mt-2">{cameraError}</p>
            )}
          </div>
        )}

        {/* ── CAMERA ── */}
        {state === "camera" && (
          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden bg-black mx-auto">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <GuideOverlay />
            </div>

            <p className="text-xs text-[#8a8a8a] text-center">
              Align your Guinness glass with the guide
            </p>

            <div className="flex gap-3 w-full max-w-md mx-auto">
              <button
                onClick={reset}
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.07] text-[#f0f0f0] text-sm hover:bg-white/[0.08] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={flipCamera}
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.07] text-[#f0f0f0] text-sm hover:bg-white/[0.08] transition-colors"
              >
                Flip
              </button>
              <button
                onClick={capture}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#f77614] text-white font-semibold text-sm hover:bg-[#e06810] transition-colors"
              >
                Capture
              </button>
            </div>
          </div>
        )}

        {/* ── CAPTURED (preview) ── */}
        {state === "captured" && capturedImage && (
          <div className="flex-1 flex flex-col items-center gap-4 max-w-md mx-auto">
            <div className="w-full rounded-2xl overflow-hidden border border-white/[0.07]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Captured Guinness pint"
                className="w-full"
              />
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={reset}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.07] text-[#f0f0f0] text-sm hover:bg-white/[0.08] transition-colors"
              >
                Retake
              </button>
              <button
                onClick={analyse}
                className="flex-1 px-4 py-3 rounded-xl bg-[#f77614] text-white font-semibold text-sm hover:bg-[#e06810] transition-colors"
              >
                Analyse My Split
              </button>
            </div>
          </div>
        )}

        {/* ── ANALYSING ── */}
        {state === "analysing" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 rounded-full border-4 border-white/[0.07] border-t-[#f77614] animate-spin" />
            <p className="text-sm text-[#8a8a8a] animate-pulse">
              Analysing your split...
            </p>
          </div>
        )}

        {/* ── RESULT ── */}
        {state === "result" && result && capturedImage && (
          <div className="flex-1 flex flex-col items-center gap-6 max-w-md mx-auto">
            <ScoreRing
              score={result.score}
              grade={result.grade}
              animate={animateScore}
            />

            <p className="text-sm text-[#8a8a8a] text-center italic">
              &ldquo;{result.message}&rdquo;
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/[0.07] text-center">
                <p className="text-xs text-[#8a8a8a] mb-1">Foam Position</p>
                <p className="text-lg font-bold">
                  {Math.round(result.foamY * 100)}%
                </p>
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/[0.07] text-center">
                <p className="text-xs text-[#8a8a8a] mb-1">Ideal Position</p>
                <p className="text-lg font-bold">
                  {Math.round(result.idealY * 100)}%
                </p>
              </div>
            </div>

            {/* Annotated image */}
            <ResultOverlayCanvas imageSrc={capturedImage} result={result} />

            {/* Legend */}
            <div className="flex gap-4 text-xs text-[#8a8a8a]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#22c55e] inline-block rounded" />
                Ideal split
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#f77614] inline-block rounded" />
                Your split
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full">
              <button
                onClick={reset}
                className="flex-1 px-4 py-3 rounded-xl bg-[#f77614] text-white font-semibold text-sm hover:bg-[#e06810] transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={async () => {
                  if (!capturedImage) return;
                  try {
                    const blob = await (await fetch(capturedImage)).blob();
                    const file = new File([blob], "split-the-g.jpg", {
                      type: "image/jpeg",
                    });
                    await navigator.share({
                      title: `I scored ${result.score}/100 on Split the G!`,
                      text: `Grade: ${result.grade} — "${result.message}"`,
                      files: [file],
                    });
                  } catch {
                    // share cancelled or unsupported
                  }
                }}
                className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.07] text-[#f0f0f0] text-sm hover:bg-white/[0.08] transition-colors"
              >
                Share
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-5 py-4 text-center text-[10px] text-[#505050]">
        Please drink responsibly. Not affiliated with Guinness or Diageo.
      </footer>
    </div>
  );
}
