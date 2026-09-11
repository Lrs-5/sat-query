import MissionControl from './MissionControl.jsx'
import DataSource from './DataSource.jsx'
import Capabilities from './Capabilities.jsx'
import ImageViewer from './ImageViewer.jsx'
import QueryBox from './QueryBox.jsx'
import AnalysisPanel from './AnalysisPanel.jsx'
import EvidencePanel from './EvidencePanel.jsx'
import ExecutionTrace from './ExecutionTrace.jsx'

// The ONE reusable analysis workspace. It is deliberately generic: it
// renders whatever `result` (task, answer, evidence) the state holds,
// so adding change-detection or SAR fusion later means teaching the
// viewer/evidence panel a new evidence `type` — not building a new page.
export default function Workspace() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:py-8">
      <div className="mb-6">
        <p className="font-mono text-xs tracking-wider text-cyan">SATQUERY AI / MVP</p>
        <h1 className="font-display text-2xl font-semibold text-ink-primary sm:text-3xl">
          Geospatial intelligence through natural language.
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="flex flex-col gap-7 lg:sticky lg:top-24 lg:self-start">
          <MissionControl />
          <DataSource />
          <Capabilities />
        </aside>

        {/* Main analysis column */}
        <div className="flex flex-col gap-7">
          <ImageViewer />
          <QueryBox />

          <div className="grid grid-cols-1 gap-7 xl:grid-cols-2">
            <AnalysisPanel />
            <EvidencePanel />
          </div>

          <ExecutionTrace />
        </div>
      </div>
    </div>
  )
}
