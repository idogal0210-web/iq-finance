import { useState, useEffect } from 'react';
import type { ProgressBarProps } from '../../types';

export default function ProgressBar({ ratio, glow = false, delay = "0s" }: ProgressBarProps) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const id = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(id); }, []);
  return (
    <div style={{ height: 3, width: "100%", borderRadius: 9999, overflow: "hidden", background: "rgba(255,255,255,0.04)" }}>
      <div style={{
        height: "100%", borderRadius: 9999,
        width: loaded ? `${Math.min(ratio, 1) * 100}%` : "0%",
        transition: `width 1.8s cubic-bezier(0.22,1,0.36,1) ${delay}`,
        background: glow ? "linear-gradient(90deg, #3f3f46, #e4e4e7)" : "#3f3f46",
        boxShadow: glow ? "0 0 8px rgba(255,255,255,0.2)" : "none",
      }} />
    </div>
  );
}
