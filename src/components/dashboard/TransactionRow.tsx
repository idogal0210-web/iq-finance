import { useState } from 'react';
import { motion } from 'framer-motion';
import { SURFACE, EMERALD, smooth } from '../../theme';
import { useLanguage } from '../../contexts/LanguageContext';
import type React from 'react';
import styles from './TransactionRow.module.css';

interface TransactionRowProps {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  amount: string;
  positive?: boolean;
  showTopBorder?: boolean;
}

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 320, damping: 26 },
  },
};

export default function TransactionRow({
  icon: Icon,
  title,
  subtitle,
  amount,
  positive = false,
  showTopBorder = false,
}: TransactionRowProps) {
  const { isRtl } = useLanguage();
  const [h, setH] = useState<boolean>(false);
  return (
    <motion.div variants={rowVariants}>
      {showTopBorder && (
        <div style={{ height: 1, margin: '0 16px', background: 'rgba(255,255,255,0.03)' }} />
      )}
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        className={styles.row}
        style={{
          background: h ? 'rgba(255,255,255,0.025)' : 'transparent',
          flexDirection: isRtl ? 'row-reverse' : 'row',
          ...smooth,
        }}
      >
        <div className={styles.left} style={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <div
            className={styles.iconWrap}
            style={{
              background: SURFACE,
              border: `1px solid ${h ? (positive ? 'rgba(45,212,160,0.2)' : 'rgba(255,255,255,0.1)') : 'rgba(255,255,255,0.04)'}`,
              color: h ? (positive ? EMERALD : '#d4d4d8') : '#52525b',
              ...smooth,
            }}
          >
            <Icon size={15} strokeWidth={1.5} />
          </div>
          <div>
            <p className={styles.title} style={{ color: '#e4e4e7', textAlign: isRtl ? 'right' : 'left' }}>{title}</p>
            <p className={styles.subtitle} style={{ color: '#52525b', textAlign: isRtl ? 'right' : 'left' }}>{subtitle}</p>
          </div>
        </div>
        <span className={styles.amount} style={{ color: positive ? EMERALD : '#e4e4e7' }}>
          {positive ? '+' : '-'}₪{amount}
        </span>
      </div>
    </motion.div>
  );
}
