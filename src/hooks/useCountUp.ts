import { useState, useEffect } from 'react';

const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

export function useCountUp(target: number, duration = 2000, start = 125000): number {
  const [value, setValue] = useState(start);
  useEffect(() => {
    let startTs: number | null = null;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      setValue(Math.floor(easeOutQuart(p) * (target - start) + start));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}
