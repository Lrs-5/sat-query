import { CheckCircle2, Clock } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore.js'
import Badge from '../common/Badge.jsx'

const CAPABILITIES = [
  { id: 'vqa', label: 'Visual Question Answering', tag: 'VQA', status: 'active' },
  { id: 'grounding', label: 'Visual Grounding', tag: 'BOXES', status: 'active' },
  { id: 'change-detection', label: 'Change Detection', tag: null, status: 'soon' },
  { id: 'optical-sar', label: 'Optical + SAR Fusion', tag: null, status: 'soon' },
]

export default function Capabilities() {
  const selectedCapability = useAppStore((s) => s.selectedCapability)
  const setSelectedCapability = useAppStore((s) => s.setSelectedCapability)
  const showToast = useAppStore((s) => s.showToast)

  return (
    <div>
      <p className="mb-3 font-mono text-[11px] tracking-wider text-ink-muted">
        ACTIVE CAPABILITIES
      </p>
      <div className="flex flex-col gap-2">
        {CAPABILITIES.map((capability) => {
          const isActive = capability.status === 'active'
          const isSelected = selectedCapability === capability.id

          return (
            <button
              key={capability.id}
              type="button"
              disabled={!isActive}
              onClick={() => {
                if (!isActive) {
                  showToast(`${capability.label} is coming soon.`, 'info')
                  return
                }
                setSelectedCapability(capability.id)
              }}
              aria-pressed={isSelected}
              className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${
                isSelected
                  ? 'border-lime/40 bg-lime-dim text-ink-primary'
                  : isActive
                  ? 'border-line text-ink-muted hover:border-cyan/30 hover:text-ink-primary'
                  : 'cursor-not-allowed border-line text-ink-faint'
              }`}
            >
              <span className="flex items-center gap-2">
                {isActive ? (
                  <CheckCircle2 size={14} className={isSelected ? 'text-lime' : 'text-ink-muted'} />
                ) : (
                  <Clock size={14} className="text-ink-faint" />
                )}
                {capability.label}
              </span>
              {isActive ? (
                <Badge tone={isSelected ? 'lime' : 'neutral'}>{capability.tag} · ACTIVE</Badge>
              ) : (
                <Badge tone="neutral">SOON</Badge>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
