import { useEffect, useRef, useState } from 'react'
import { ZoomIn, ZoomOut, Maximize, Minimize, RefreshCcw, Eye, EyeOff, Satellite } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore.js'
import mockSatelliteImage from '../../assets/mockSatelliteImage.svg'

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.5

export default function ImageViewer() {
  const activeFile = useAppStore((s) => s.activeFile)
  const result = useAppStore((s) => s.result)
  const evidenceVisible = useAppStore((s) => s.evidenceVisible)
  const toggleEvidenceVisible = useAppStore((s) => s.toggleEvidenceVisible)
  const selectedEvidenceId = useAppStore((s) => s.selectedEvidenceId)
  const setSelectedEvidenceId = useAppStore((s) => s.setSelectedEvidenceId)

  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  function handleZoomIn() {
    setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)))
  }
  function handleZoomOut() {
    setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)))
  }
  function handleResetZoom() {
    setZoom(1)
  }

  async function handleFullscreenToggle() {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      // Some browsers (or embedded frames) don't support the Fullscreen API —
      // fail quietly instead of throwing an unhandled error.
      try {
        await containerRef.current.requestFullscreen()
      } catch {
        /* fullscreen unsupported in this environment */
      }
    } else {
      await document.exitFullscreen()
    }
  }

  const hasRealImage = activeFile?.kind === 'image' && activeFile.url
  const isRasterFallback = activeFile?.kind === 'raster-fallback'
  const boundingBoxes =
    evidenceVisible && result?.evidence?.filter((item) => item.type === 'bounding_box')

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[11px] tracking-wider text-ink-muted">SATELLITE VIEWER</p>
        <div className="flex items-center gap-1.5">
          <ViewerButton onClick={handleZoomOut} label="Zoom out" disabled={zoom <= MIN_ZOOM}>
            <ZoomOut size={14} />
          </ViewerButton>
          <span className="w-10 text-center font-mono text-[11px] text-ink-muted">
            {Math.round(zoom * 100)}%
          </span>
          <ViewerButton onClick={handleZoomIn} label="Zoom in" disabled={zoom >= MAX_ZOOM}>
            <ZoomIn size={14} />
          </ViewerButton>
          <ViewerButton onClick={handleResetZoom} label="Reset zoom">
            <RefreshCcw size={13} />
          </ViewerButton>
          <ViewerButton
            onClick={toggleEvidenceVisible}
            label={evidenceVisible ? 'Hide evidence' : 'Show evidence'}
            active={evidenceVisible}
          >
            {evidenceVisible ? <Eye size={14} /> : <EyeOff size={14} />}
          </ViewerButton>
          <ViewerButton
            onClick={handleFullscreenToggle}
            label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </ViewerButton>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`glass-panel relative aspect-[16/10] overflow-auto ${
          isFullscreen ? 'flex items-center justify-center bg-base-950' : ''
        }`}
      >
        <div
          className="relative h-full w-full origin-center transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          {isRasterFallback ? (
            <RasterFallback filename={activeFile.name} />
          ) : (
            <img
              src={hasRealImage ? activeFile.url : mockSatelliteImage}
              alt={hasRealImage ? activeFile.name : 'Demo satellite scene'}
              className="h-full w-full select-none object-cover"
              draggable={false}
            />
          )}

          {boundingBoxes?.map((box) => {
            const [x1, y1, x2, y2] = box.coordinates
            const isSelected = selectedEvidenceId === box.id
            return (
              <button
                key={box.id}
                type="button"
                onClick={() => setSelectedEvidenceId(box.id)}
                title={`${box.label} · ${Math.round(box.score * 100)}%`}
                className={`absolute rounded-[3px] border-2 transition-colors ${
                  isSelected
                    ? 'border-cyan bg-cyan/10 shadow-[0_0_0_2px_rgba(90,209,230,0.35)]'
                    : 'border-lime/80 bg-lime/5 hover:border-lime'
                }`}
                style={{
                  left: `${x1}%`,
                  top: `${y1}%`,
                  width: `${x2 - x1}%`,
                  height: `${y2 - y1}%`,
                }}
              >
                <span
                  className={`absolute -top-6 left-0 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[10px] ${
                    isSelected ? 'bg-cyan text-base-950' : 'bg-lime text-base-950'
                  }`}
                >
                  {box.label}
                </span>
              </button>
            )
          })}
        </div>

        {!activeFile && (
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-base-950/70 px-2.5 py-1 font-mono text-[10px] tracking-wide text-ink-muted">
            DEMO SCENE — UPLOAD AN IMAGE TO REPLACE
          </div>
        )}
      </div>
    </div>
  )
}

function RasterFallback({ filename }) {
  return (
    <div className="grid-texture flex h-full w-full flex-col items-center justify-center gap-2 bg-base-800 text-center">
      <Satellite size={26} className="text-cyan" />
      <p className="text-sm text-ink-primary">Satellite raster uploaded</p>
      <p className="max-w-xs truncate px-4 font-mono text-xs text-ink-muted">{filename}</p>
      <p className="text-xs text-ink-faint">Preview will be rendered by the backend</p>
    </div>
  )
}

function ViewerButton({ children, onClick, label, disabled, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
        active
          ? 'border-lime/40 bg-lime-dim text-lime'
          : 'border-line text-ink-muted hover:border-cyan/30 hover:text-ink-primary'
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  )
}
