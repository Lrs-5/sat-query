import { Sparkles, AlertCircle } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore.js'

const EXAMPLE_QUESTIONS = [
  'What is visible in this image?',
  'What objects are visible?',
  'Where are the buildings?',
  'Where are the roads?',
  'Are there vehicles visible?',
]

export default function QueryBox() {
  const query = useAppStore((s) => s.query)
  const setQuery = useAppStore((s) => s.setQuery)
  const loading = useAppStore((s) => s.loading)
  const error = useAppStore((s) => s.error)
  const clearError = useAppStore((s) => s.clearError)
  const runAnalysis = useAppStore((s) => s.runAnalysis)

  function handleSubmit(e) {
    e.preventDefault()
    runAnalysis()
  }

  return (
    <div>
      <p className="mb-3 font-mono text-[11px] tracking-wider text-ink-muted">QUERY</p>

      <form onSubmit={handleSubmit} className="glass-panel p-3.5">
        <textarea
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (error) clearError()
          }}
          placeholder="Ask SatQuery about this image..."
          rows={2}
          className="w-full resize-none bg-transparent text-sm text-ink-primary placeholder:text-ink-faint focus:outline-none"
        />

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_QUESTIONS.slice(0, 3).map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuery(example)}
                className="rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-muted transition-colors hover:border-cyan/30 hover:text-ink-primary"
              >
                {example}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-lime px-4 py-2 text-sm font-medium text-base-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles size={14} />
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
        </div>
      </form>

      {error && (
        <div
          role="alert"
          className="mt-2.5 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-dim px-3.5 py-2.5 text-sm text-danger"
        >
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
