import { Home, Plus, WalletCards } from 'lucide-react';
import { smooth } from '../../theme';

interface BottomNavProps {
  onWallets: () => void;
}

export default function BottomNav({ onWallets }: BottomNavProps) {
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
      zIndex: 55, width: 280, height: 64,
    }}>
      <div style={{
        borderRadius: 20, height: "100%", width: "100%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px",
        background: `linear-gradient(145deg, rgba(10,11,12,0.94) 0%, rgba(6,6,6,0.97) 100%)`,
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.04)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.8)", ...smooth,
      }}>
        <button style={{ color: "#52525b", background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 10 }}>
          <Home size={19} strokeWidth={1.5} />
        </button>
        <div style={{ position: "relative", top: -20 }}>
          <button style={{
            width: 52, height: 52, borderRadius: 16,
            background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#d4d4d8", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)", ...smooth,
          }}>
            <Plus size={22} strokeWidth={1.5} />
          </button>
        </div>
        <button
          onClick={onWallets}
          style={{ color: "#52525b", background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 10, ...smooth }}
        >
          <WalletCards size={19} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
