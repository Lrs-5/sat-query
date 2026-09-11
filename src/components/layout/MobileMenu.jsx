import { AnimatePresence, motion } from 'framer-motion'
import { X, LayoutGrid, FolderOpen, Cpu } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore.js'

const NAV_ITEMS = [
  { id: 'workspace', label: 'Workspace', icon: LayoutGrid },
  { id: 'datasets', label: 'Datasets', icon: FolderOpen },
  { id: 'models', label: 'Models', icon: Cpu },
]

export default function MobileMenu() {
  const isOpen = useAppStore((s) => s.mobileMenuOpen)
  const closeMobileMenu = useAppStore((s) => s.closeMobileMenu)
  const activePage = useAppStore((s) => s.activePage)
  const setActivePage = useAppStore((s) => s.setActivePage)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop — clicking it closes the drawer */}
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={closeMobileMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className="absolute right-0 top-0 h-full w-72 border-l border-line bg-base-900 p-5"
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="font-mono text-xs tracking-wider text-ink-muted">NAVIGATION</p>
              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink-primary"
              >
                <X size={16} />
              </button>
            </div>

            <nav className="flex flex-col gap-1.5" aria-label="Mobile">
              {NAV_ITEMS.map((item) => {
                const isActive = activePage === item.id
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePage(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-lg border px-3.5 py-3 font-mono text-xs tracking-wider transition-colors ${
                      isActive
                        ? 'border-lime/30 bg-lime-dim text-lime'
                        : 'border-line text-ink-muted hover:text-ink-primary'
                    }`}
                  >
                    <Icon size={15} />
                    {item.label.toUpperCase()}
                  </button>
                )
              })}
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
