import { toPercent } from '../../utils/formatters.js'

export default function ConfidenceMeter({ value }) {
  const percent = Math.round((value || 0) * 100)

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <p className="font-mono text-[11px] tracking-wider text-ink-muted">CONFIDENCE</p>
        <p className="font-display text-lg font-semibold text-ink-primary">{toPercent(value)}</p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan to-lime transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
