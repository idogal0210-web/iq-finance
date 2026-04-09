import type { GrowthTraceProps } from '../../types';
import { EMERALD } from '../../theme';
import { GROWTH_POINTS } from '../../data/mockData';

export default function GrowthTrace({ width = 420, height = 64 }: GrowthTraceProps) {
  const min = Math.min(...GROWTH_POINTS);
  const max = Math.max(...GROWTH_POINTS);
  const pad = 6;
  const d = GROWTH_POINTS.map((v, i) => {
    const x = pad + (i / (GROWTH_POINTS.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / (max - min)) * (height - pad * 2);
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const lastX = (width - 6).toFixed(1);
  const lastY = (pad + ((GROWTH_POINTS[GROWTH_POINTS.length - 1] - min) / (max - min)) * (height - pad * 2));
  const dotY = (height - pad - (lastY - pad)).toFixed(1);
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="traceGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3f3f46" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#71717a" stopOpacity="0.7" />
          <stop offset="100%" stopColor={EMERALD} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="url(#traceGrad)" strokeWidth="0.8"
        strokeDasharray="3 3" strokeLinecap="round" />
      <circle cx={lastX} cy={dotY} r="2.5" fill={EMERALD} opacity="0.9"
        style={{ filter: `drop-shadow(0 0 4px ${EMERALD})` }} />
    </svg>
  );
}
