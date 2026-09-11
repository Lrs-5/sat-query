import { useAppStore } from './store/useAppStore.js'
import Header from './components/layout/Header.jsx'
import MobileMenu from './components/layout/MobileMenu.jsx'
import Workspace from './components/workspace/Workspace.jsx'
import DatasetsPage from './components/datasets/DatasetsPage.jsx'
import ModelsPage from './components/models/ModelsPage.jsx'
import Toast from './components/common/Toast.jsx'

// App decides WHICH section to show based on `activePage` in the store.
// This is the app's whole "routing" — no router library needed for three
// simple sections.
export default function App() {
  const activePage = useAppStore((s) => s.activePage)

  return (
    <div className="min-h-screen bg-base-950">
      <Header />
      <MobileMenu />

      <main className="grid-texture min-h-[calc(100vh-64px)]">
        {activePage === 'workspace' && <Workspace />}
        {activePage === 'datasets' && <DatasetsPage />}
        {activePage === 'models' && <ModelsPage />}
      </main>

      <Toast />
    </div>
  )
}
