import { useState, useEffect } from 'react';
import type { SplashScreenProps } from '../types';
import { RICH_BLACK } from '../theme';
import Wordmark from './Wordmark';

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => onFinish?.(), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: RICH_BLACK,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: phase >= 1 ? (phase >= 2 ? 0 : 1) : 0,
      transform: phase >= 2 ? "scale(1.03)" : phase >= 1 ? "scale(1)" : "scale(0.97)",
      transition: "opacity 0.8s ease, transform 0.8s ease",
      pointerEvents: phase >= 2 ? "none" : "auto",
    }}>
      <Wordmark size={30} showTagline={true} />
    </div>
  );
}
