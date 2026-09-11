// A small pill label used for statuses like "ACTIVE" or "COMING SOON".
// Centralized here so every status badge in the app looks consistent.
export default function Badge({ tone = 'neutral', children }) {
  const tones = {
    lime: 'bg-lime-dim text-lime border border-lime/30',
    cyan: 'bg-cyan-dim text-cyan border border-cyan/30',
    neutral: 'bg-white/5 text-ink-muted border border-line',
    danger: 'bg-danger-dim text-danger border border-danger/30',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide font-mono ${tones[tone] || tones.neutral}`}
    >
      {children}
    </span>
  )
}
