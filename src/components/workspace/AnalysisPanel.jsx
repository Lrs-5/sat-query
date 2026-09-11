import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore.js'
import { taskLabel } from '../../utils/formatters.js'
import ConfidenceMeter from './ConfidenceMeter.jsx'
import Badge from '../common/Badge.jsx'

export default function AnalysisPanel() {
  const loading = useAppStore((s) => s.loading)
  const result = useAppStore((s) => s.result)

  if (!loading && !result) {
    return (
      <div>
        <p className="mb-3 font-mono text-[11px] tracking-wider text-ink-muted">ANALYSIS</p>
        <div className="glass-panel px-4 py-8 text-center text-sm text-ink-faint">
          Ask a question above to see results here.
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <p className="mb-3 font-mono text-[11px] tracking-wider text-ink-muted">ANALYSIS</p>
        <div className="glass-panel flex items-center gap-3 px-4 py-6">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />
          <p className="font-mono text-sm tracking-wide text-ink-primary">ANALYZING IMAGE…</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <p className="mb-3 font-mono text-[11px] tracking-wider text-ink-muted">ANALYSIS</p>
      <div className="glass-panel space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] tracking-wider text-ink-muted">TASK</span>
            <Badge tone="cyan">{taskLabel(result.task)}</Badge>
          </div>
          <Badge tone={result.status === 'success' ? 'lime' : 'danger'}>
            {result.status.toUpperCase()}
          </Badge>
        </div>

        <div>
          <p className="mb-1.5 font-mono text-[11px] tracking-wider text-ink-muted">ANSWER</p>
          <p className="text-sm leading-relaxed text-ink-primary">{result.answer}</p>
        </div>

        <ConfidenceMeter value={result.confidence} />
      </div>
    </motion.div>
  )
}
