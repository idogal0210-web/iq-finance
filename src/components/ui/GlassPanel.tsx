import { useState } from 'react';
import type { GlassPanelProps } from '../../types';
import { glassStyle, glassHover, smooth } from '../../theme';

export default function GlassPanel({ children, style = {}, ...props }: GlassPanelProps) {
  const [hover, setHover] = useState<boolean>(false);
  return (
    <div
      style={{ ...glassStyle, ...(hover ? glassHover : {}), ...smooth, ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >{children}</div>
  );
}
