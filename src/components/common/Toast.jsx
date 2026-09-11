import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Info } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore.js'

// A small inline notification shown in the corner of the screen.
// This replaces browser alert() everywhere in the app, as required.
export default function Toast() {
  const toast = useAppStore((s) => s.toast)

  return (
    <div className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            role="status"
            className={`glass-panel flex max-w-sm items-center gap-2.5 px-4 py-3 text-sm shadow-glow ${
              toast.tone === 'error' ? 'border-danger/40' : 'border-lime/30'
            }`}
          >
            {toast.tone === 'error' ? (
              <AlertTriangle size={16} className="shrink-0 text-danger" />
            ) : (
              <Info size={16} className="shrink-0 text-lime" />
            )}
            <span className="text-ink-primary">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
