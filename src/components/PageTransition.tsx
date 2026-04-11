import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Route-level transition: incoming page slides up with a spring, outgoing
 * page fades + scales down slightly. Used inside <AnimatePresence mode="wait">
 * so the exit animation finishes before the next page mounts.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
