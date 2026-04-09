import { useState, useEffect } from 'react';
import type { RevealProps } from '../../types';
import styles from './Reveal.module.css';

export default function Reveal({ children, delay = 0, style = {} }: RevealProps) {
  const [show, setShow] = useState(false);
  useEffect(() => { const id = setTimeout(() => setShow(true), delay); return () => clearTimeout(id); }, [delay]);
  return (
    <div
      className={`${styles.root} ${show ? styles.visible : styles.hidden}`}
      style={{
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        ...style,
      }}
    >{children}</div>
  );
}
