import { FileImage, Satellite, Trash2, CheckCircle2, FolderOpen } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore.js'

export default function DatasetsPage() {
  const datasets = useAppStore((s) => s.datasets)
  const activeFile = useAppStore((s) => s.activeFile)
  const selectDataset = useAppStore((s) => s.selectDataset)
  const removeDataset = useAppStore((s) => s.removeDataset)
  const setActivePage = useAppStore((s) => s.setActivePage)

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6">
      <p className="font-mono text-xs tracking-wider text-cyan">DATASETS</p>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-primary">
        Uploaded imagery
      </h1>

      {datasets.length === 0 ? (
        <div className="glass-panel flex flex-col items-center gap-3 px-6 py-14 text-center">
          <FolderOpen size={26} className="text-ink-muted" />
          <p className="text-sm text-ink-primary">No files uploaded yet.</p>
          <p className="max-w-sm text-sm text-ink-muted">
            Upload a satellite image from the workspace to see it listed here.
          </p>
          <button
            type="button"
            onClick={() => setActivePage('workspace')}
            className="mt-2 rounded-lg bg-lime px-4 py-2 text-sm font-medium text-base-950 transition-opacity hover:opacity-90"
          >
            Go to workspace
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {datasets.map((dataset) => {
            const isActive = activeFile?.id === dataset.id
            return (
              <div
                key={dataset.id}
                className={`glass-panel flex items-center gap-4 p-4 ${
                  isActive ? 'border-lime/40' : ''
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-dim">
                  {dataset.kind === 'image' ? (
                    <FileImage size={17} className="text-cyan" />
                  ) : (
                    <Satellite size={17} className="text-cyan" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-primary">{dataset.name}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-muted">
                    {dataset.extension.toUpperCase()} · {dataset.sizeLabel || 'UNKNOWN SIZE'} ·{' '}
                    {dataset.status.toUpperCase()}
                  </p>
                </div>

                {isActive && (
                  <span className="hidden items-center gap-1 font-mono text-[11px] text-lime sm:flex">
                    <CheckCircle2 size={13} /> ACTIVE
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => selectDataset(dataset.id)}
                  disabled={isActive}
                  className="rounded-md border border-line px-3 py-1.5 text-xs text-ink-primary transition-colors hover:border-lime/40 hover:text-lime disabled:cursor-default disabled:opacity-50"
                >
                  {isActive ? 'In use' : 'Use'}
                </button>

                <button
                  type="button"
                  onClick={() => removeDataset(dataset.id)}
                  aria-label={`Remove ${dataset.name}`}
                  title="Remove"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger-dim hover:text-danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
