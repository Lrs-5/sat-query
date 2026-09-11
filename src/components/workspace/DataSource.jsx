import { useRef, useState } from 'react'
import { UploadCloud, FileImage, X, Satellite } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore.js'

const ACCEPTED_EXTENSIONS = ['.tif', '.tiff', '.png', '.jpg', '.jpeg']

export default function DataSource() {
  const activeFile = useAppStore((s) => s.activeFile)
  const addDataset = useAppStore((s) => s.addDataset)
  const removeDataset = useAppStore((s) => s.removeDataset)
  const showToast = useAppStore((s) => s.showToast)
  const inputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)

  function handleFiles(fileList) {
    const file = fileList?.[0]
    if (!file) return

    const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      showToast('Unsupported file type. Use TIF, TIFF, PNG or JPG.', 'error')
      return
    }

    addDataset(file)
  }

  return (
    <div>
      <p className="mb-3 font-mono text-[11px] tracking-wider text-ink-muted">DATA SOURCE</p>

      {!activeFile ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragOver(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={`flex w-full flex-col items-center gap-2.5 rounded-xl border border-dashed px-4 py-7 text-center transition-colors ${
            isDragOver ? 'border-lime/60 bg-lime-dim' : 'border-line hover:border-cyan/40'
          }`}
        >
          <UploadCloud size={22} className={isDragOver ? 'text-lime' : 'text-ink-muted'} />
          <span className="text-sm text-ink-primary">Drop satellite image</span>
          <span className="text-xs text-ink-muted">or click to browse</span>
          <span className="mt-1 font-mono text-[10px] tracking-wide text-ink-faint">
            SUPPORTS TIF · TIFF · PNG · JPG — GEOTIFF RASTERS OK
          </span>
        </button>
      ) : (
        <div className="glass-panel flex items-start gap-3 p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-dim">
            {activeFile.kind === 'image' ? (
              <FileImage size={17} className="text-cyan" />
            ) : (
              <Satellite size={17} className="text-cyan" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ink-primary" title={activeFile.name}>
              {activeFile.name}
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-ink-muted">
              {activeFile.extension.toUpperCase()} {activeFile.sizeLabel && `· ${activeFile.sizeLabel}`} · READY
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeDataset(activeFile.id)}
            aria-label="Remove uploaded file"
            title="Remove file"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger-dim hover:text-danger"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
