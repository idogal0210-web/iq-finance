import React from 'react';

export type Lang = "en" | "he";
export type LayoutMode = "app" | "web";

export interface Transaction {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  amount: string;
  positive: boolean;
}

export interface Asset {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  name: string;
  balance: number;
  change: string;
  positive: boolean;
}

export interface Card {
  last4: string;
  type: string;
}

export interface WordmarkProps {
  size?: number;
  showTagline?: boolean;
}

export interface SplashScreenProps {
  onFinish?: () => void;
}

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export interface ProgressBarProps {
  ratio: number;
  glow?: boolean;
  delay?: string;
}

export interface TransactionRowProps {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  amount: string;
  positive?: boolean;
  isRtl: boolean;
}

export interface MenuNavItemProps {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  label: string;
  active?: boolean;
  isRtl: boolean;
}

export interface LayoutToggleProps {
  mode: LayoutMode;
  onToggle: () => void;
  label: string;
}

export interface SlideMenuProps {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  onToggleLang: () => void;
}

export interface GrowthTraceProps {
  width?: number;
  height?: number;
}

export interface AssetCardProps {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  name: string;
  balance: number;
  change: string;
  positive: boolean;
  isRtl: boolean;
}

export interface BrushedMetalCardProps {
  last4: string;
  type: string;
  isActive?: boolean;
}

export interface WalletsScreenProps {
  lang: Lang;
  layoutMode: LayoutMode;
  onBack: () => void;
}
