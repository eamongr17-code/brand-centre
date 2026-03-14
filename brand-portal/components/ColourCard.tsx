"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Eye, Pencil, Trash2 } from "lucide-react";
import type { BrandColour } from "@/lib/types";
import { hexToRgb, hexToHsl, hexToCmyk, getContrastColor } from "@/lib/colour-utils";
import { useEditStore } from "@/lib/edit-store";

function ColourDetailModal({
  colour,
  onClose,
}: {
  colour: BrandColour;
  onClose: () => void;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const rgb = hexToRgb(colour.hex);
  const hsl = hexToHsl(colour.hex);
  const cmyk = hexToCmyk(colour.hex);
  const contrastColor = getContrastColor(colour.hex);

  const copy = (key: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const values = [
    { label: "HEX", value: colour.hex },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: `hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)` },
    { label: "CMYK", value: `C:${cmyk.c} M:${cmyk.m} Y:${cmyk.y} K:${cmyk.k}` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center [animation:fade-in_0.15s_ease-out_forwards]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-[#161616] border border-white/[0.06] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] w-full max-w-sm mx-4 overflow-hidden [animation:fade-up_0.2s_ease-out_forwards]">
        {/* Large swatch */}
        <div className="h-32 flex items-end p-4" style={{ backgroundColor: colour.hex }}>
          <span className="text-sm font-semibold" style={{ color: contrastColor }}>
            {colour.name}
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-sm text-[#686868]">{colour.hex}</span>
            <button onClick={onClose} className="text-[#555] hover:text-[#999] transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2">
            {values.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.04] rounded-lg px-3 py-2.5"
              >
                <span className="text-xs font-bold text-[#484848] w-10 shrink-0">{label}</span>
                <span className="flex-1 text-sm font-mono text-[#ececec] truncate">{value}</span>
                <button
                  onClick={() => copy(label, value)}
                  className="shrink-0 text-[#484848] hover:text-[#999] transition-colors"
                  title={`Copy ${label}`}
                >
                  {copiedKey === label ? (
                    <Check size={13} className="text-green-400" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ColourCard({ colour }: { colour: BrandColour }) {
  const { editMode, updateColour, deleteColour } = useEditStore();
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(colour.name);
  const [hex, setHex] = useState(colour.hex);
  const contrastColor = getContrastColor(colour.hex);

  useEffect(() => {
    if (!editing) {
      setName(colour.name);
      setHex(colour.hex);
    }
  }, [colour, editing]);

  const copyHex = () => {
    navigator.clipboard.writeText(colour.hex).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const save = () => {
    updateColour(colour.id, { name, hex });
    setEditing(false);
  };

  const cancel = () => {
    setName(colour.name);
    setHex(colour.hex);
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

  return (
    <>
      <div className="glass-card rounded-xl overflow-hidden relative group">
        {/* Swatch */}
        <button
          onClick={copyHex}
          className="w-full h-28 relative flex items-end p-3 transition-all duration-300 hover:brightness-110"
          style={{ backgroundColor: colour.hex }}
          title={`Click to copy ${colour.hex}`}
        >
          {copied && (
            <span
              className="absolute inset-0 flex items-center justify-center text-sm font-semibold [animation:fade-in_0.15s_ease-out_forwards]"
              style={{ color: contrastColor }}
            >
              Copied!
            </span>
          )}
        </button>

        {editMode && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(true)}
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

        <div className="p-4 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#ececec] truncate">{colour.name}</p>
            <button
              onClick={copyHex}
              className="text-xs font-mono text-[#555] hover:text-[#999] transition-colors"
            >
              {colour.hex}
            </button>
          </div>
          <button
            onClick={() => setShowDetails(true)}
            className="shrink-0 text-[#484848] hover:text-[#999] transition-colors"
            title="View colour details"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>

      {showDetails && (
        <ColourDetailModal colour={colour} onClose={() => setShowDetails(false)} />
      )}
    </>
  );
}
