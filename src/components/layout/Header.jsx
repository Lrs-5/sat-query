import { Satellite, Menu, RotateCcw } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore.js'

const NAV_ITEMS = [
  { id: 'workspace', label: 'Workspace' },
  { id: 'datasets', label: 'Datasets' },
  { id: 'models', label: 'Models' },
]

export default function Header() {
  const activePage = useAppStore((s) => s.activePage)
  const setActivePage = useAppStore((s) => s.setActivePage)
  const openMobileMenu = useAppStore((s) => s.openMobileMenu)
  const reset = useAppStore((s) => s.reset)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
        {/* Logo / brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-lime/25 bg-lime-dim">
            <Satellite size={18} className="text-lime" strokeWidth={1.75} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold tracking-wide text-ink-primary">
              SATQUERY
            </p>
            <p className="font-mono text-[10px] tracking-wider text-ink-muted">
              AI — EARTH INTELLIGENCE
            </p>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePage(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative rounded-md px-3.5 py-2 font-mono text-xs font-medium tracking-wider transition-colors ${
                  isActive ? 'text-lime' : 'text-ink-muted hover:text-ink-primary'
                }`}
              >
                {item.label.toUpperCase()}
                {isActive && (
                  <span className="absolute inset-x-2.5 -bottom-[1px] h-[2px] rounded-full bg-lime" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Right side: status, reset, mobile menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
            </span>
            <span className="font-mono text-[11px] tracking-wider text-ink-muted">
              SYSTEM ONLINE
            </span>
          </div>

          <button
            type="button"
            onClick={reset}
            title="Reset the workspace"
            className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-[11px] tracking-wider text-ink-muted transition-colors hover:border-danger/40 hover:text-danger"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">RESET</span>
          </button>

          <button
            type="button"
            onClick={openMobileMenu}
            title="Open menu"
            aria-label="Open navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink-primary md:hidden"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
