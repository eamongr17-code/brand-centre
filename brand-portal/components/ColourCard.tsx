"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Info, Pencil, Trash2 } from "lucide-react";
import type { BrandColour } from "@/lib/types";
import { hexToRgb, hexToHsl, hexToCmyk, getContrastColor } from "@/lib/colour-utils";
import { useEditStore } from "@/lib/edit-store";

export default function ColourCard({ colour }: { colour: BrandColour }) {
  const { editMode, updateColour, deleteColour } = useEditStore();
  const [copied, setCopied] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(colour.name);
  const [hex, setHex] = useState(colour.hex);
  const [rgbOverride, setRgbOverride] = useState(colour.rgbOverride ?? "");
  const [hslOverride, setHslOverride] = useState(colour.hslOverride ?? "");
  const [cmykOverride, setCmykOverride] = useState(colour.cmykOverride ?? "");

  useEffect(() => {
    if (!editing) {
      setName(colour.name);
      setHex(colour.hex);
      setRgbOverride(colour.rgbOverride ?? "");
      setHslOverride(colour.hslOverride ?? "");
      setCmykOverride(colour.cmykOverride ?? "");
    }
  }, [colour, editing]);

  const copyHex = () => {
    navigator.clipboard.writeText(colour.hex).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const copyValue = (key: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const save = () => {
    updateColour(colour.id, {
      name,
      hex,
      rgbOverride: rgbOverride.trim() || undefined,
      hslOverride: hslOverride.trim() || undefined,
      cmykOverride: cmykOverride.trim() || undefined,
    });
    setEditing(false);
  };

  const cancel = () => {
    setName(colour.name);
    setHex(colour.hex);
    setRgbOverride(colour.rgbOverride ?? "");
    setHslOverride(colour.hslOverride ?? "");
    setCmykOverride(colour.cmykOverride ?? "");
    setEditing(false);
  };

  if (editing) {
    const previewHex = hex.match(/^#[0-9A-Fa-f]{3,6}$/) ? hex : colour.hex;
    return (
      <div className="border border-[#f77614] rounded-xl overflow-hidden bg-[#161616]">
        <div className="h-20 transition-colors" style={{ backgroundColor: previewHex }} />
        <div className="p-4 space-y-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15] transition-colors"
            placeholder="Colour name"
          />
          <input
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs font-mono text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15] transition-colors"
            placeholder="#000000"
          />
          <div className="grid grid-cols-[32px_1fr] gap-x-2 gap-y-1.5 items-center">
            <span className="text-[10px] font-bold text-[#484848]">RGB</span>
            <input
              value={rgbOverride}
              onChange={(e) => setRgbOverride(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs font-mono text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15] transition-colors"
              placeholder={`rgb(${hexToRgb(hex.match(/^#[0-9A-Fa-f]{3,6}$/) ? hex : "#000000").r}, ${hexToRgb(hex.match(/^#[0-9A-Fa-f]{3,6}$/) ? hex : "#000000").g}, ${hexToRgb(hex.match(/^#[0-9A-Fa-f]{3,6}$/) ? hex : "#000000").b})`}
            />
            <span className="text-[10px] font-bold text-[#484848]">HSL</span>
            <input
              value={hslOverride}
              onChange={(e) => setHslOverride(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs font-mono text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15] transition-colors"
              placeholder={(() => { const h = hexToHsl(hex.match(/^#[0-9A-Fa-f]{3,6}$/) ? hex : "#000000"); return `hsl(${h.h}°, ${h.s}%, ${h.l}%)`; })()}
            />
            <span className="text-[10px] font-bold text-[#484848]">CMYK</span>
            <input
              value={cmykOverride}
              onChange={(e) => setCmykOverride(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs font-mono text-[#ececec] placeholder-[#444] focus:outline-none focus:border-white/[0.15] transition-colors"
              placeholder={(() => { const c = hexToCmyk(hex.match(/^#[0-9A-Fa-f]{3,6}$/) ? hex : "#000000"); return `C:${c.c} M:${c.m} Y:${c.y} K:${c.k}`; })()}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={save}
              className="inline-flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              <Check size={11} /> Save
            </button>
            <button
              onClick={cancel}
              className="inline-flex items-center gap-1 text-xs border border-white/[0.08] text-[#ececec] px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              <X size={11} /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const rgb = hexToRgb(colour.hex);
  const hsl = hexToHsl(colour.hex);
  const cmyk = hexToCmyk(colour.hex);
  const values = [
    { label: "HEX", value: colour.hex },
    { label: "RGB", value: colour.rgbOverride || `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: colour.hslOverride || `hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)` },
    { label: "CMYK", value: colour.cmykOverride || `C:${cmyk.c} M:${cmyk.m} Y:${cmyk.y} K:${cmyk.k}` },
  ];

  return (
    <div className="glass-card rounded-xl relative overflow-hidden aspect-square group">
      {/* Layer 1 — Swatch */}
      <button
        onClick={copyHex}
        className="absolute inset-0 w-full transition-[filter] duration-300 group-hover:brightness-110"
        style={{ backgroundColor: colour.hex }}
        title={`Click to copy ${colour.hex}`}
      >
        {copied && (
          <span
            className="absolute inset-0 flex items-center justify-center text-sm font-semibold [animation:fade-in_0.15s_ease-out_forwards]"
            style={{ color: getContrastColor(colour.hex) }}
          >
            Copied!
          </span>
        )}
      </button>

      {/* Layer 2 — Edit overlays */}
      {editMode && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => { setInfoOpen(false); setEditing(true); }}
            className="bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-lg p-1.5 hover:bg-white/[0.08] transition-colors"
            title="Edit"
          >
            <Pencil size={12} className="text-[#ececec]" />
          </button>
          <button
            onClick={() => deleteColour(colour.id)}
            className="bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-lg p-1.5 hover:bg-red-500/20 text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {/* Layer 3 — Dark panel */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-[#161616] rounded-t-xl flex flex-col overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          infoOpen ? "h-[calc(100%-48px)]" : "h-[92px]"
        }`}
      >
        {/* Info section — visible when expanded */}
        <div className={`flex-1 overflow-y-auto px-4 pt-3 pb-2 flex flex-col gap-2 transition-opacity duration-200 ${
          infoOpen ? "opacity-100 delay-200" : "opacity-0 pointer-events-none"
        }`}>
          <div className="flex items-end justify-end">
            <button onClick={() => setInfoOpen(false)} className="shrink-0 text-[#555] hover:text-[#999] transition-colors">
              <X size={14} />
            </button>
          </div>
          <div className="space-y-1.5">
            {values.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.04] rounded-lg px-2.5 py-2"
              >
                <span className="text-[10px] font-bold text-[#484848] w-8 shrink-0">{label}</span>
                <span className="flex-1 text-xs font-mono text-[#ececec] truncate">{value}</span>
                <button
                  onClick={() => copyValue(label, value)}
                  className="shrink-0 text-[#484848] hover:text-[#999] transition-colors"
                  title={`Copy ${label}`}
                >
                  {copiedKey === label ? (
                    <Check size={11} className="text-green-400" />
                  ) : (
                    <Copy size={11} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Divider — only when info is open */}
        {infoOpen && <div className="mx-4 border-t border-white/[0.06] shrink-0" />}

        {/* Footer bar — always visible */}
        <div className="mt-auto px-4 pt-3 pb-4 shrink-0">
          <span className="font-semibold text-sm text-[#ececec] truncate block">{colour.name}</span>
          <div className="flex items-end justify-between gap-2 mt-1">
            <span className="text-xs font-mono text-[#555]">{colour.hex}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Info button */}
              <button
                onClick={() => setInfoOpen(v => !v)}
                className={`w-8 h-8 inline-flex items-center justify-center rounded-full border transition-colors ${
                  infoOpen ? "border-white/20 text-[#ececec]" : "border-white/[0.1] text-[#555] hover:text-[#ececec] hover:border-white/20"
                }`}
              >
                <Info size={13} />
              </button>
              {/* Copy hex button */}
              <button
                onClick={copyHex}
                className="w-10 h-10 inline-flex items-center justify-center bg-white text-black rounded-xl hover:bg-white/90 active:scale-95 transition-all"
                title={`Copy ${colour.hex}`}
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
