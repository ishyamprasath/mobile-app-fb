import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, ShieldCheck } from 'lucide-react';
import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface AppShellProps {
  title: string;
  subtitle: string;
  badge: string;
  children: ReactNode;
}

export function AppShell({ title, subtitle, badge, children }: AppShellProps) {
  const { user, logout } = useAuth();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#081730] px-4 py-6 font-sans text-white md:px-8 lg:px-10">
      <div className="tvs-corner-top" />
      <div className="tvs-corner-bottom fixed" />

      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto mb-6 flex max-w-7xl flex-col gap-4 rounded-3xl border border-white/10 bg-[#0c2244] p-4 md:flex-row md:items-center md:justify-between md:p-6"
      >
        <div className="flex-1 min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#E31E24]/20 bg-[#E31E24]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#E31E24]">
            <ShieldCheck size={14} />
            {badge}
          </div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h1>
          <p className="mt-1 text-sm text-white/60 md:text-base">{subtitle}</p>
        </div>

        {/* Mobile: Name in header with logout icon */}
        <div className="flex items-center justify-between gap-3 md:hidden">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#E31E24]">Signed in</div>
            <div className={`font-semibold truncate ${user?.name && user.name.length > 20 ? 'text-xs' : user?.name && user.name.length > 12 ? 'text-sm' : 'text-base'}`}>
              {user?.name}
            </div>
          </div>
          <button
            onClick={logout}
            className="flex-shrink-0 rounded-2xl bg-[#8B0000] p-3 text-white transition hover:bg-[#8B0000]/90"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Desktop: Full user card with logout button */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-2xl border border-white/10 bg-[#071830] px-4 py-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#E31E24]">Signed in</div>
            <div className="font-semibold">{user?.name}</div>
            <div className="text-xs text-white/60">{user?.designation}</div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#8B0000] px-4 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#8B0000]/90"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={badge}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.35 }}
          className="relative z-10 mx-auto max-w-7xl pb-12"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
