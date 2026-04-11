import { motion } from 'framer-motion';
import { Home, Plus, WalletCards } from 'lucide-react';
import { smooth } from '../../theme';
import styles from './BottomNav.module.css';

interface BottomNavProps {
  onWallets: () => void;
  onAdd?: () => void;
}

const navButtonHover = { y: -2 };
const navButtonTap = { scale: 0.92 };
const fabTap = { scale: 0.95 };
const fabHover = { y: -2, scale: 1.03 };
const buttonSpring = { type: 'spring' as const, stiffness: 400, damping: 22 };

export default function BottomNav({ onWallets, onAdd }: BottomNavProps) {
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
          whileHover={navButtonHover}
          whileTap={navButtonTap}
          transition={buttonSpring}
          className={styles.btn}
          style={{ color: "#52525b" }}
        >
          <Home size={19} strokeWidth={1.5} />
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
          style={{ color: "#52525b", ...smooth }}
        >
          <WalletCards size={19} strokeWidth={1.5} />
        </motion.button>
      </div>
    </div>
  );
}
