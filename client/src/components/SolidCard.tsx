import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SolidCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function SolidCard({ children, className = '', delay = 0 }: SolidCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`rounded-3xl border border-white/10 bg-[#0c2244] p-6 transition-colors hover:border-[#E31E24]/30 ${className}`}
    >
      {children}
    </motion.div>
  );
}
