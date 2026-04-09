import { Home, Plus, WalletCards } from 'lucide-react';
import { smooth } from '../../theme';
import styles from './BottomNav.module.css';

interface BottomNavProps {
  onWallets: () => void;
}

export default function BottomNav({ onWallets }: BottomNavProps) {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.bar}
        style={{
          background: `linear-gradient(145deg, rgba(10,11,12,0.94) 0%, rgba(6,6,6,0.97) 100%)`,
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.04)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.8)", ...smooth,
        }}
      >
        <button className={styles.btn} style={{ color: "#52525b" }}>
          <Home size={19} strokeWidth={1.5} />
        </button>
        <div className={styles.fabWrap}>
          <button
            className={styles.fab}
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
              color: "#d4d4d8", border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)", ...smooth,
            }}
          >
            <Plus size={22} strokeWidth={1.5} />
          </button>
        </div>
        <button
          onClick={onWallets}
          className={styles.btn}
          style={{ color: "#52525b", ...smooth }}
        >
          <WalletCards size={19} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
