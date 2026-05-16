import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  accent?: 'blue' | 'red' | 'white';
}

const accentStyles: Record<string, { border: string; iconBg: string; iconColor: string }> = {
  blue: { border: 'border-[#003DA5]/40', iconBg: 'bg-[#003DA5]/20', iconColor: 'text-blue-300' },
  red: { border: 'border-[#E31E24]/40', iconBg: 'bg-[#E31E24]/20', iconColor: 'text-rose-300' },
  white: { border: 'border-white/15', iconBg: 'bg-white/10', iconColor: 'text-white' },
};

export function MetricCard({ title, value, subtitle, icon, accent = 'white' }: MetricCardProps) {
  const style = accentStyles[accent];
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className={`rounded-[24px] border bg-[#0c2244] p-5 text-white ${style.border}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-white/70">{title}</div>
        <div className={`rounded-2xl p-3 ${style.iconBg} ${style.iconColor}`}>{icon}</div>
      </div>
      <div className="text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-2 text-sm text-white/60">{subtitle}</div>
    </motion.div>
  );
}
