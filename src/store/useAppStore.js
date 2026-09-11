import { create } from 'zustand'
import { runAnalysis as runAnalysisRequest } from '../services/api.js'

let nextDatasetId = 1

/**
 * useAppStore is the single shared "memory" of the app.
 *
 * Any component can read from it (e.g. `const query = useAppStore(s => s.query)`)
 * and call its actions (e.g. `useAppStore.getState().setQuery('...')`).
 * This avoids passing dozens of props down through many component layers.
 *
 * Nothing in here talks to models, agents, or a database — it only holds
 * UI state and calls the API service layer (services/api.js), which is the
 * only place that knows about mock vs. real backend mode.
 */
export const useAppStore = create((set, get) => ({
  // ----- navigation -----
  activePage: 'workspace', // 'workspace' | 'datasets' | 'models'
  mobileMenuOpen: false,

  setActivePage: (page) => set({ activePage: page, mobileMenuOpen: false }),
  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),

  // ----- datasets / uploaded files -----
  // Each dataset looks like:
  // { id, name, extension, sizeLabel, status, kind: 'raster-fallback' | 'image', url }
  datasets: [],
  activeFile: null, // the dataset currently shown in the workspace viewer

  addDataset: (file) => {
    const extension = (file.name.split('.').pop() || '').toLowerCase()
    const isPreviewable = ['png', 'jpg', 'jpeg'].includes(extension)
    const dataset = {
      id: `file-${nextDatasetId++}`,
      name: file.name,
      extension,
      sizeLabel: formatFileSize(file.size),
      status: 'ready',
      kind: isPreviewable ? 'image' : 'raster-fallback',
      // Later, the backend can hand us `previewUrl` instead of an object URL.
      url: isPreviewable ? URL.createObjectURL(file) : null,
    }
    set((state) => ({
      datasets: [...state.datasets, dataset],
      activeFile: dataset,
      error: null,
    }))
    return dataset
  },

  removeDataset: (id) => {
    set((state) => {
      const removed = state.datasets.find((d) => d.id === id)
      if (removed?.url) URL.revokeObjectURL(removed.url)
      const remaining = state.datasets.filter((d) => d.id !== id)
      const wasActive = state.activeFile?.id === id
      return {
        datasets: remaining,
        activeFile: wasActive ? null : state.activeFile,
      }
    })
  },

  selectDataset: (id) => {
    const dataset = get().datasets.find((d) => d.id === id)
    if (!dataset) return
    set({ activeFile: dataset, activePage: 'workspace' })
  },

  // ----- capability selection -----
  selectedCapability: 'vqa', // 'vqa' | 'grounding'
  setSelectedCapability: (capability) => set({ selectedCapability: capability }),

  // ----- query + analysis -----
  query: '',
  setQuery: (query) => set({ query }),

  loading: false,
  loadingSteps: [], // execution trace steps as they "complete" during a run
  result: null,
  error: null,

  clearError: () => set({ error: null }),

  runAnalysis: async () => {
    const { activeFile, query } = get()

    if (!activeFile) {
      set({ error: 'Upload a satellite image first.' })
      return
    }
    if (!query.trim()) {
      set({ error: 'Enter a question first.' })
      return
    }

    set({ loading: true, error: null, result: null, loadingSteps: [], selectedEvidenceId: null })

    try {
      const result = await runAnalysisRequest({
        file: activeFile,
        query,
        // onStep lets the UI reveal the execution trace one line at a time,
        // instead of dumping the whole trace on screen at once.
        onStep: (step) => {
          set((state) => ({ loadingSteps: [...state.loadingSteps, step] }))
        },
      })
      set({ result, loading: false, evidenceVisible: true })
    } catch (err) {
      set({
        loading: false,
        error: err?.message || 'Analysis failed. Please try again.',
      })
    }
  },

  // ----- evidence overlay -----
  evidenceVisible: true,
  selectedEvidenceId: null,
  toggleEvidenceVisible: () => set((state) => ({ evidenceVisible: !state.evidenceVisible })),
  setSelectedEvidenceId: (id) =>
    set((state) => ({ selectedEvidenceId: state.selectedEvidenceId === id ? null : id })),

  // ----- toast (small inline notification, never a browser alert) -----
  toast: null, // { message, tone: 'error' | 'info' }
  showToast: (message, tone = 'info') => {
    set({ toast: { message, tone } })
    setTimeout(() => {
      // Only clear if it's still the same toast (avoids clobbering a newer one)
      set((state) => (state.toast?.message === message ? { toast: null } : {}))
    }, 3200)
  },

  // ----- reset -----
  reset: () => {
    const { datasets } = get()
    datasets.forEach((d) => {
      if (d.url) URL.revokeObjectURL(d.url)
    })
    set({
      datasets: [],
      activeFile: null,
      query: '',
      selectedCapability: 'vqa',
      loading: false,
      loadingSteps: [],
      result: null,
      error: null,
      evidenceVisible: true,
      selectedEvidenceId: null,
      toast: { message: 'Workspace reset.', tone: 'info' },
    })
  },
}))

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
