import MissionControl from './MissionControl.jsx'
import DataSource from './DataSource.jsx'
import Capabilities from './Capabilities.jsx'
import ImageViewer from './ImageViewer.jsx'
import QueryBox from './QueryBox.jsx'
import AnalysisPanel from './AnalysisPanel.jsx'
import EvidencePanel from './EvidencePanel.jsx'
import ExecutionTrace from './ExecutionTrace.jsx'

// Main reusable analysis workspace.
// Desktop uses a compact single-screen dashboard layout.
// Mobile keeps the normal vertical flow for usability.
export default function Workspace() {
  return (
    <div className="mx-auto h-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:h-[calc(100vh-80px)] lg:overflow-hidden lg:px-6 lg:py-4">

      {/* Header */}
      <div className="mb-3 shrink-0">
        <p className="font-mono text-[10px] tracking-wider text-cyan">
          SATQUERY AI / MVP
        </p>

        <h1 className="font-display text-xl font-semibold leading-tight text-ink-primary sm:text-2xl">
          Geospatial intelligence through natural language.
        </h1>
      </div>

      {/* Desktop dashboard */}
      <div className="lg:grid lg:h-[calc(100%-58px)] lg:grid-cols-[250px_minmax(0,1fr)_330px] lg:gap-4">

        {/* LEFT SIDEBAR */}
        <aside className="mb-6 flex flex-col gap-4 lg:mb-0 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
          <MissionControl />
          <DataSource />
          <Capabilities />
        </aside>

        {/* CENTER - IMAGE */}
        <main className="flex min-w-0 flex-col gap-3 lg:min-h-0">

          {/* Image viewer */}
          <div className="min-h-0 flex-1">
            <ImageViewer />
          </div>

          {/* Query */}
          <QueryBox />

        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="flex min-w-0 flex-col gap-4 lg:min-h-0 lg:overflow-y-auto lg:pl-1">

          <AnalysisPanel />

          <EvidencePanel />

        </aside>
      </div>

      {/* Execution trace */}
      <div className="mt-3 lg:max-h-[105px] lg:overflow-y-auto">
        <ExecutionTrace />
      </div>

    </div>
  )
}

