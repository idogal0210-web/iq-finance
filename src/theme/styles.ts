import React from 'react';

export const glassStyle: React.CSSProperties = {
  background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)",
  backdropFilter: "blur(40px) saturate(150%)",
  WebkitBackdropFilter: "blur(40px) saturate(150%)",
  border: "1px solid rgba(255,255,255,0.04)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 40px -8px rgba(0,0,0,0.5)",
};

export const glassHover: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 48px -8px rgba(0,0,0,0.6)",
};

export const smooth: React.CSSProperties = {
  transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
};

export const noiseUrl = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;
