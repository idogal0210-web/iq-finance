import { Plus, Link2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { WalletsScreenProps } from '../../types';
import { RICH_BLACK, EMERALD_OUTER, noiseUrl, smooth } from '../../theme';
import { translations } from '../../i18n/translations';
import { getAssets, getCards } from '../../data/mockData';
import Reveal from '../ui/Reveal';
import GrowthTrace from './GrowthTrace';
import AssetCard from './AssetCard';
import BrushedMetalCard from './BrushedMetalCard';

const gradientText = {
  background: "linear-gradient(180deg, #FFFFFF 0%, #71717a 100%)",
  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  textTransform: "none" as const,
};

export default function WalletsScreen({ lang, layoutMode, onBack }: WalletsScreenProps) {
  const l = translations[lang];
  const isRtl = lang === "he";
  const containerMaxWidth = layoutMode === "web" ? 860 : 460;

  const assets = getAssets(l);
  const cards = getCards(l);

  return (
    <div style={{
      minHeight: "100vh", background: RICH_BLACK, color: "#a1a1aa",
      fontFamily: "'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflowX: "hidden", position: "relative",
    }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none", backgroundImage: noiseUrl }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "45%", height: "45%", borderRadius: "50%", background: "rgba(255,255,255,0.008)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", bottom: "-5%", left: "10%", width: "40%", height: "30%", borderRadius: "50%", background: `radial-gradient(ellipse, ${EMERALD_OUTER}, transparent 70%)`, filter: "blur(80px)", opacity: 0.3 }} />
      </div>

      <main style={{
        maxWidth: containerMaxWidth, margin: "0 auto",
        padding: layoutMode === "web" ? "56px 48px 140px" : "56px 24px 140px",
        position: "relative", zIndex: 10,
      }}>
        <Reveal delay={0}>
          <header style={{
            display: "flex", alignItems: "center", gap: 16, marginBottom: 64,
            flexDirection: isRtl ? "row-reverse" : "row",
          }}>
            <button
              onClick={onBack}
              style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.025)",
                cursor: "pointer", color: "#71717a", ...smooth,
              }}
            >
              {isRtl ? <ChevronRight size={16} strokeWidth={1.5} /> : <ChevronLeft size={16} strokeWidth={1.5} />}
            </button>
            <p style={{ fontSize: 11, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.3em", fontWeight: 600 }}>
              {l.portfolioAssets}
            </p>
          </header>
        </Reveal>

        <Reveal delay={80}>
          <section style={{ marginBottom: 64 }}>
            <div style={{ marginBottom: 8 }}>
              <h2 style={{
                fontSize: "clamp(46px, 12vw, 72px)", fontWeight: 200,
                letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums",
                direction: "ltr", textAlign: isRtl ? "right" : "left",
                textShadow: "0 0 40px rgba(255,255,255,0.08), 0 0 80px rgba(255,255,255,0.04)",
                ...gradientText,
              }}>
                ₪142,650
              </h2>
            </div>
            <div style={{ marginTop: 16, marginBottom: 6, opacity: 0.85 }}>
              <GrowthTrace />
            </div>
            <p style={{ fontSize: 9.5, color: "#27272a", textTransform: "uppercase", letterSpacing: "0.25em", fontWeight: 500 }}>
              {l.performanceTrend}
            </p>
          </section>
        </Reveal>

        <Reveal delay={160}>
          <section style={{ marginBottom: 60 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: "0 4px", flexDirection: isRtl ? "row-reverse" : "row" }}>
              <h3 style={{ fontSize: 11, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.25em", fontWeight: 600 }}>
                {l.wallets}
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {assets.map((a, i) => (
                <AssetCard key={i} {...a} isRtl={isRtl} />
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={240}>
          <section style={{ marginBottom: 60 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: "0 4px", flexDirection: isRtl ? "row-reverse" : "row" }}>
              <h3 style={{ fontSize: 11, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.25em", fontWeight: 600 }}>
                Digital Wealth Cards
              </h3>
            </div>
            <div style={{
              display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8,
              scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none", msOverflowStyle: "none",
              marginLeft: layoutMode === "web" ? 0 : -2,
            }}>
              {cards.map((c, i) => (
                <BrushedMetalCard key={i} last4={c.last4} type={c.type} isActive={i === 0} />
              ))}
              <div style={{
                width: 240, height: 148, borderRadius: 20, flexShrink: 0,
                scrollSnapAlign: "start",
                border: "1px dashed rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", ...smooth,
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
              >
                <Plus size={18} strokeWidth={1} color="#3f3f46" />
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={320}>
          <section style={{ marginBottom: 64 }}>
            <button style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              padding: "18px 24px", borderRadius: 20,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.05)",
              cursor: "pointer", color: "#52525b",
              flexDirection: isRtl ? "row-reverse" : "row",
              ...smooth,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#a1a1aa"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#52525b"; }}
            >
              <Plus size={14} strokeWidth={1} />
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {l.syncLabel}
              </span>
              <Link2 size={12} strokeWidth={1.5} style={{ opacity: 0.5 }} />
            </button>
          </section>
        </Reveal>
      </main>
    </div>
  );
}
