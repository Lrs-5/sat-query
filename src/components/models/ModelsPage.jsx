import { Eye, Crosshair, GitCompareArrows, Radar, Satellite, Layers } from 'lucide-react'
import Badge from '../common/Badge.jsx'

const MODELS = [
  {
    id: 'vqa',
    icon: Eye,
    title: 'Visual Question Answering',
    tag: 'VQA',
    status: 'active',
    description: 'Answers free-form natural language questions about a single satellite image.',
  },
  {
    id: 'grounding',
    icon: Crosshair,
    title: 'Visual Grounding',
    tag: 'BOXES',
    status: 'active',
    description: 'Locates objects or regions named in a query and marks them as visual evidence.',
  },
  {
    id: 'change-detection',
    icon: GitCompareArrows,
    title: 'Change Detection',
    tag: 'BI-TEMPORAL',
    status: 'soon',
    description: 'Compares two images of the same location over time to highlight what changed.',
  },
  {
    id: 'optical',
    icon: Satellite,
    title: 'Optical Analysis',
    tag: 'OPTICAL',
    status: 'soon',
    description: 'Quantitative and spatial analysis of optical satellite imagery.',
  },
  {
    id: 'sar',
    icon: Radar,
    title: 'SAR Analysis',
    tag: 'SAR',
    status: 'soon',
    description: 'Analysis of radar imagery, useful in cloud cover or low-light conditions.',
  },
  {
    id: 'fusion',
    icon: Layers,
    title: 'Optical + SAR Fusion',
    tag: 'FUSION',
    status: 'soon',
    description: 'Combines optical and radar sources for more complete scene understanding.',
  },
]

export default function ModelsPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <p className="font-mono text-xs tracking-wider text-cyan">MODELS</p>
      <h1 className="mb-1 font-display text-2xl font-semibold text-ink-primary">Capabilities</h1>
      <p className="mb-6 text-sm text-ink-muted">
        These describe what each specialist capability does. They're built and owned by other
        parts of the team — the frontend only displays and routes to them.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {MODELS.map((model) => {
          const Icon = model.icon
          const isActive = model.status === 'active'
          return (
            <div key={model.id} className="glass-panel flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                  <Icon size={16} className={isActive ? 'text-lime' : 'text-ink-muted'} />
                </div>
                <Badge tone={isActive ? 'lime' : 'neutral'}>
                  {isActive ? `${model.tag} · ACTIVE` : 'COMING SOON'}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-primary">{model.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{model.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
