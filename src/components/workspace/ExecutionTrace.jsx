import { motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore.js'

export default function ExecutionTrace() {
  const loading = useAppStore((s) => s.loading)
  const loadingSteps = useAppStore((s) => s.loadingSteps)
  const result = useAppStore((s) => s.result)

  const steps = loading ? loadingSteps : result?.trace || []

  if (!loading && !result) return null

  return (
    <div>
      <p className="mb-3 font-mono text-[11px] tracking-wider text-ink-muted">EXECUTION TRACE</p>
      <div className="glass-panel space-y-2 p-3.5">
        {steps.map((step, index) => (
          <motion.div
            key={`${step}-${index}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-sm"
          >
            <CheckCircle2 size={14} className="shrink-0 text-lime" />
            <span className="text-ink-muted">{step}</span>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm">
            <Loader2 size={14} className="shrink-0 animate-spin text-cyan" />
            <span className="text-ink-faint">Working…</span>
          </div>
        )}
      </div>
    </div>
  )
}
