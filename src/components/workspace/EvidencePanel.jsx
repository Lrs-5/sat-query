import { Eye, EyeOff } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore.js'

export default function EvidencePanel() {
  const result = useAppStore((s) => s.result)
  const evidenceVisible = useAppStore((s) => s.evidenceVisible)
  const toggleEvidenceVisible = useAppStore((s) => s.toggleEvidenceVisible)
  const selectedEvidenceId = useAppStore((s) => s.selectedEvidenceId)
  const setSelectedEvidenceId = useAppStore((s) => s.setSelectedEvidenceId)

  if (!result) return null

  const hasEvidence = result.evidence && result.evidence.length > 0

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[11px] tracking-wider text-ink-muted">VISUAL EVIDENCE</p>
        {hasEvidence && (
          <button
            type="button"
            onClick={toggleEvidenceVisible}
            className="flex items-center gap-1.5 font-mono text-[11px] text-ink-muted transition-colors hover:text-ink-primary"
          >
            {evidenceVisible ? <EyeOff size={13} /> : <Eye size={13} />}
            {evidenceVisible ? 'HIDE ALL' : 'SHOW ALL'}
          </button>
        )}
      </div>

      {!hasEvidence ? (
        <div className="glass-panel px-4 py-6 text-center text-sm text-ink-faint">
          No visual evidence returned for this analysis.
        </div>
      ) : (
        <div className="space-y-2">
          {result.evidence.map((item) => {
            const isSelected = selectedEvidenceId === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedEvidenceId(item.id)}
                aria-pressed={isSelected}
                className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${
                  isSelected
                    ? 'border-cyan/40 bg-cyan-dim text-ink-primary'
                    : 'border-line text-ink-muted hover:border-line-strong hover:text-ink-primary'
                }`}
              >
                <span className="flex flex-col">
                  <span className="text-ink-primary">{item.label}</span>
                  <span className="font-mono text-[11px] text-ink-muted">
                    {item.type.replace('_', ' ')}
                  </span>
                </span>
                <span className="font-mono text-xs text-lime">{Math.round(item.score * 100)}%</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
