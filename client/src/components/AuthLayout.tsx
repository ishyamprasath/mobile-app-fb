import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, icon, children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#081730] flex flex-col font-sans">
      <div className="tvs-corner-top" />
      <div className="tvs-corner-bottom" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[360px]"
        >
          <div className="mb-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#E31E24] text-[#E31E24]"
            >
              {icon}
            </motion.div>
            <h1 className="text-[22px] font-bold tracking-tight text-white mb-2">{title}</h1>
            <p className="text-[13px] text-white/60 font-medium">{subtitle}</p>
            <div className="tvs-header-line" />
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}
