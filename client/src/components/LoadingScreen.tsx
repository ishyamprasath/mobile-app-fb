import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
        className="h-16 w-16 rounded-full border-4 border-[#0c2244] border-t-[#E31E24]"
      />
    </div>
  );
}
