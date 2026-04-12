import { motion } from 'framer-motion';
import { Home, Plus, WalletCards } from 'lucide-react';
import { EMERALD, smooth } from '../../theme';
import styles from './BottomNav.module.css';

interface BottomNavProps {
  onHome?: () => void;
  onWallets: () => void;
  onAdd?: () => void;
  activePage?: 'home' | 'wallets';
}

const navButtonHover = { y: -2 };
const navButtonTap = { scale: 0.92 };
const fabTap = { scale: 0.95 };
const fabHover = { y: -2, scale: 1.03 };
const buttonSpring = { type: 'spring' as const, stiffness: 400, damping: 22 };

export default function BottomNav({ onHome, onWallets, onAdd, activePage = 'home' }: BottomNavProps) {
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
        <motion.button
          onClick={onHome}
          whileHover={navButtonHover}
          whileTap={navButtonTap}
          transition={buttonSpring}
          className={styles.btn}
          style={{ color: activePage === 'home' ? EMERALD : '#52525b', ...smooth }}
        >
          <Home size={19} strokeWidth={1.5} />
          {activePage === 'home' && (
            <span style={{
              position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
              width: 3, height: 3, borderRadius: 9999, background: EMERALD,
              boxShadow: `0 0 5px ${EMERALD}`,
            }} />
          )}
        </motion.button>
        <div className={styles.fabWrap}>
          <motion.button
            onClick={onAdd}
            whileHover={fabHover}
            whileTap={fabTap}
            transition={buttonSpring}
            className={styles.fab}
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
              color: "#d4d4d8", border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)", ...smooth,
            }}
          >
            <Plus size={22} strokeWidth={1.5} />
          </motion.button>
        </div>
        <motion.button
          onClick={onWallets}
          whileHover={navButtonHover}
          whileTap={navButtonTap}
          transition={buttonSpring}
          className={styles.btn}
          style={{ color: activePage === 'wallets' ? EMERALD : '#52525b', ...smooth }}
        >
          <WalletCards size={19} strokeWidth={1.5} />
          {activePage === 'wallets' && (
            <span style={{
              position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
              width: 3, height: 3, borderRadius: 9999, background: EMERALD,
              boxShadow: `0 0 5px ${EMERALD}`,
            }} />
          )}
        </motion.button>
      </div>
    </div>
  );
}
