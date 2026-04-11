import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Bell, Menu, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { RICH_BLACK, EMERALD_OUTER, noiseUrl, smooth } from "./theme";
import { getTransactions } from "./data/mockData";
import { useFinance } from "./contexts/FinanceContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { LayoutProvider, useLayout } from "./contexts/LayoutContext";
import { FinanceProvider } from "./contexts/FinanceContext";

const queryClient = new QueryClient();
import SplashScreen from "./components/SplashScreen";
import Wordmark from "./components/Wordmark";
import Reveal from "./components/ui/Reveal";
import GlassPanel from "./components/ui/GlassPanel";
import LayoutToggle from "./components/layout/LayoutToggle";
import SlideMenu from "./components/layout/SlideMenu";
import BottomNav from "./components/layout/BottomNav";
import BalanceSection from "./components/dashboard/BalanceSection";
import TransactionRow from "./components/dashboard/TransactionRow";
import AIInsightCard from "./components/dashboard/AIInsightCard";
import GoalArchitect from "./components/dashboard/GoalArchitect";
import WalletsScreen from "./components/wallets/WalletsScreen";
import SettingsScreen from "./components/settings/SettingsScreen";
import AddTransactionSheet from "./components/AddTransactionSheet";

function Dashboard() {
  const { isRtl, t, toggleLang } = useLanguage();
  const { layoutMode, containerMaxWidth, toggleLayout } = useLayout();
  const { transactions: dbTransactions } = useFinance();
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const navigate = useNavigate();
  const mockTransactions = getTransactions(t);
  const liveTransactions = dbTransactions.length > 0
    ? dbTransactions.slice(0, 4).map(tx => ({
        icon: tx.type === 'income' ? ArrowDownLeft : ArrowUpRight,
        title: tx.description ?? (tx.type === 'income' ? t.income : t.flow),
        subtitle: tx.date,
        amount: tx.amount.toLocaleString(),
        positive: tx.type === 'income',
      }))
    : mockTransactions;

  useEffect(() => { const id = setTimeout(() => setVisible(true), 100); return () => clearTimeout(id); }, []);

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none", backgroundImage: noiseUrl }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-15%", left: "-15%", width: "55%", height: "55%", borderRadius: "50%", background: "rgba(255,255,255,0.01)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", top: "30%", right: "-20%", width: "50%", height: "50%", borderRadius: "50%", background: "rgba(255,255,255,0.007)", filter: "blur(120px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "20%", width: "40%", height: "30%", borderRadius: "50%", background: `radial-gradient(ellipse, ${EMERALD_OUTER}, transparent 70%)`, filter: "blur(80px)", opacity: 0.35 }} />
      </div>

      <SlideMenu open={menuOpen} onClose={() => setMenuOpen(false)} onToggleLang={toggleLang} onSettings={() => { setMenuOpen(false); navigate('/settings'); }} />

      <main style={{
        maxWidth: containerMaxWidth,
        margin: "0 auto",
        padding: layoutMode === "web" ? "56px 48px 140px" : "56px 24px 140px",
        position: "relative", zIndex: 10,
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.6s ease, transform 0.6s ease, max-width 0.6s cubic-bezier(0.22,1,0.36,1), padding 0.6s cubic-bezier(0.22,1,0.36,1)",
      }}>

        <Reveal delay={0}>
          <header style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 72,
            flexDirection: isRtl ? "row-reverse" : "row",
          }}>
            <Wordmark size={28} showTagline={true} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexDirection: isRtl ? "row-reverse" : "row" }}>
              <LayoutToggle onToggle={toggleLayout} label={layoutMode === "app" ? t.layoutWeb : t.layoutApp} />
              <button style={{
                width: 38, height: 38, borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)",
                cursor: "pointer", ...smooth,
              }}>
                <Bell size={15} strokeWidth={1.5} color="#52525b" />
              </button>
              <button onClick={() => setMenuOpen(true)} style={{
                width: 38, height: 38, borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)",
                cursor: "pointer", ...smooth,
              }}>
                <Menu size={15} strokeWidth={1.5} color="#52525b" />
              </button>
            </div>
          </header>
        </Reveal>

        <Reveal delay={100}>
          <BalanceSection />
        </Reveal>

        <Reveal delay={200}>
          <section style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: "0 4px", flexDirection: isRtl ? "row-reverse" : "row" }}>
              <h3 style={{ fontSize: 11, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.25em", fontWeight: 600 }}>{t.recentFlow}</h3>
              <button style={{ fontSize: 11, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.15em", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>{t.archive}</button>
            </div>
            <GlassPanel style={{ borderRadius: 28, padding: "6px" }}>
              {liveTransactions.map((tx, i) => (
                <div key={i}>
                  {i > 0 && <div style={{ height: 1, margin: "0 16px", background: "rgba(255,255,255,0.03)" }} />}
                  <TransactionRow
                    icon={tx.icon}
                    title={tx.title}
                    subtitle={tx.subtitle}
                    amount={tx.amount}
                    positive={tx.positive}
                  />
                </div>
              ))}
            </GlassPanel>
          </section>
        </Reveal>

        <Reveal delay={300}>
          <section style={{ marginBottom: 56 }}>
            <AIInsightCard />
          </section>
        </Reveal>

        <Reveal delay={400}>
          <GoalArchitect />
        </Reveal>
      </main>

      <BottomNav onWallets={() => navigate("/wallets")} onAdd={() => setAddOpen(true)} />
      <AddTransactionSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}

function AppContent() {
  const [splashDone, setSplashDone] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { if (splashDone) setVisible(true); }, [splashDone]);

  return (
    <div
      style={{
        height: "100vh", overflowY: "auto", background: RICH_BLACK, color: "#a1a1aa",
        fontFamily: "'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflowX: "hidden", position: "relative",
        opacity: visible ? 1 : 0, transition: "opacity 0.6s ease",
      }}
    >
      {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
      {splashDone && (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/wallets" element={<WalletsScreen onBack={() => {}} />} />
        </Routes>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <LanguageProvider>
          <LayoutProvider>
            <FinanceProvider>
              <AppContent />
            </FinanceProvider>
          </LayoutProvider>
        </LanguageProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
