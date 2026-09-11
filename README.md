# SatQuery AI — Frontend (M5)

This is the **frontend only** for SatQuery AI. It runs completely on mock
data today, and is built so it can be pointed at the real M4 backend later
by changing one file (`src/services/api.js`) — no component needs to change.

## 1. Running it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

To build for production: `npm run build` (output goes to `dist/`).

Optional: copy `.env.example` to `.env` if you want to control mock mode
explicitly. By default, the app runs in mock mode even without a `.env`
file.

## 2. The architecture, in plain language

SatQuery AI's full pipeline looks like this:

```
USER → M5 FRONTEND → M4 BACKEND → M3 AGENT → M1/M2 CAPABILITY → RESULT → M5 FRONTEND
```

The frontend's job is narrow on purpose: show an upload box, take a
question, send both off, and **render whatever result comes back** — an
answer, a confidence score, and optional visual evidence (boxes, masks,
polygons). It does not know or care how the answer was produced.

Because of that, the whole UI is built around ONE reusable "analysis
workspace" instead of a separate page per capability (VQA page, grounding
page, etc). Today it shows bounding boxes; tomorrow, when M2 adds a change
mask, the same viewer and evidence panel will render that too, because they
already work off a generic `evidence` list rather than one hardcoded shape.

## 3. Folder structure — what each folder does

```
src/
  main.jsx              # Starts the React app
  App.jsx               # Top-level layout + simple page switching
  index.css             # Global styles, color/utility classes shared everywhere

  store/
    useAppStore.js       # The single shared "memory" of the app (Zustand)

  services/
    api.js               # The ONLY file that knows mock vs. real backend
    mockAnalysis.js       # Simulates the pipeline delay + step-by-step trace
    mockData.js           # Hand-written example VQA/grounding results

  components/
    layout/               # Header, mobile nav drawer
    workspace/             # Everything inside the main analysis workspace
    datasets/              # The "Datasets" page (list of uploaded files)
    models/                # The "Models" page (capability descriptions)
    common/                # Small reusable pieces (Badge, Toast)

  utils/
    formatters.js          # Small formatting helpers (percentages, labels)
```

**Why this structure?** Each folder answers one question a teammate or judge
might ask: "where's the state?" → `store/`. "Where would the backend calls
go?" → `services/`. "Where's the actual UI?" → `components/`, split by the
three sections of the app (workspace / datasets / models) plus a `common/`
folder for pieces reused across all three.

## 4. How React starts the app

`index.html` has one empty `<div id="root">`. `src/main.jsx` finds that div
and tells React to render `<App />` inside it. `App.jsx` renders the header
and mobile menu (always visible), and then picks ONE of three sections —
Workspace, Datasets, or Models — based on a single piece of state:
`activePage`.

## 5. How the main workspace works

`Workspace.jsx` lays out a sidebar (Mission Control text, upload box,
capability list) next to a main column (image viewer, query box, analysis
result, evidence list, execution trace). Every one of those is its own
small component in `components/workspace/`, so each file stays short and
easy to explain on its own.

## 6. How upload works

`DataSource.jsx` renders a dropzone. Clicking it — or dragging a file onto
it — triggers a hidden `<input type="file">`. Whatever file comes back is
handed to `addDataset(file)` in the store, which:

- reads the file extension to decide if it's a browser-previewable image
  (`png`/`jpg`/`jpeg`) or a raster that needs a backend-rendered preview
  (`tif`/`tiff`)
- creates a temporary local URL for previewable images with
  `URL.createObjectURL(file)`
- stores it as the "active file" shown in the viewer

For TIFF/GeoTIFF, browsers can't reliably preview them, so the viewer shows
a clean "Satellite raster uploaded — preview will be rendered by the
backend" message instead of faking an image.

## 7. How query works

`QueryBox.jsx` is a plain text area bound to `query` in the store, plus an
"Analyze" button. Submitting the form calls `runAnalysis()` in the store,
which validates that a file and a question both exist (showing an inline
error otherwise — never a browser `alert()`), then calls the API service.

## 8. How mock analysis works

`services/api.js` checks the `VITE_USE_MOCK` setting. While it's `true`
(the default), every "Analyze" click goes to `services/mockAnalysis.js`,
which:

1. Looks at the words in the question to guess VQA vs. grounding
   (`inferTask`) — a rough stand-in for what M3's real agent will do
2. Builds a realistic result object from `mockData.js`
3. "Streams" the execution trace back one step at a time with a short
   delay, so the UI can animate it, instead of just returning everything
   instantly

## 9. How Zustand state works

`store/useAppStore.js` is one file holding everything components need to
share: which page is active, the uploaded files, the current query, the
loading/result/error state, and evidence visibility. A component reads a
slice of it with `useAppStore(state => state.something)`, and calls an
action the same way. This avoids threading props through five layers of
components just to get a query string from the sidebar to the button.

## 10. How the image viewer works

`ImageViewer.jsx` shows either the uploaded image, the raster fallback
message, or (if nothing's uploaded yet) a local generated demo satellite
scene so the workspace never looks empty. On top of the image, it lays a
list of `evidence` items with `type: "bounding_box"` as absolutely
positioned rectangles, using the coordinates as percentages of the image
box — so they land in the right place regardless of screen size. Zoom
buttons scale that whole layer with a CSS `transform`; fullscreen uses the
browser's native Fullscreen API on the viewer's container.

## 11. How evidence boxes work

Each mock evidence item looks like:

```js
{ id: "box-1", type: "bounding_box", label: "building cluster", score: 0.94, coordinates: [18, 25, 31, 38] }
```

The viewer reads `type` to decide how to draw it (today: rectangles for
`bounding_box`; `mask` and `polygon` types are already accounted for in the
data shape so a teammate can add real rendering for them later without
changing the result format). Clicking a box in the evidence list or on the
image highlights the same box in both places, because both read/write the
same `selectedEvidenceId` in the store.

## 12. How confidence is displayed

`ConfidenceMeter.jsx` takes the `confidence` number (0–1) from the result
and shows it as a percentage plus a filled bar. It's just confidence — the
UI never claims a percentage of "correctness."

## 13. How execution trace works

While `loading` is `true`, `ExecutionTrace.jsx` shows each step as it
arrives from the mock service, with a spinner underneath to indicate more
are coming. Once the result is back, it shows the full trace from the
result object with checkmarks. This is intentionally high-level — it never
shows internal reasoning, just the named pipeline stages.

## 14. How navigation works

Three real `<button>` elements in the header (`Workspace`, `Datasets`,
`Models`) each call `setActivePage(id)`. `App.jsx` reads that value and
renders the matching section. The active tab gets a visual underline via
`aria-current="page"` plus a conditional class.

## 15. How the mobile menu works

Below the `md` breakpoint, the desktop nav is hidden and a menu button
appears (`Header.jsx`). Clicking it sets `mobileMenuOpen: true` in the
store. `MobileMenu.jsx` then animates in a right-side drawer (Framer
Motion) with the same three nav buttons, a close button, and a
click-outside backdrop that also closes it.

## 16. How this will connect to M4 later

Everything the frontend needs from the backend is described by four
endpoints already sketched out in `services/api.js`:

```
POST /upload
POST /query
GET  /results/{id}
GET  /health
```

To go live: set `VITE_USE_MOCK=false` in `.env`, then fill in the
commented-out Axios calls in `runAnalysis()` inside `services/api.js`. As
long as M4 returns the same result shape (`task`, `status`, `answer`,
`confidence`, `evidence`, `statistics`, `artifacts`, `trace`), nothing in
`components/` needs to change.

## 17. How M1/M2/M3 results will eventually appear

M1/M2's specialist outputs and M3's routing decisions all get flattened by
M4 into that one common result shape before reaching the frontend. Today
`mockData.js` fabricates that shape. Later, the real result — whichever
capability produced it — will look identical from the frontend's point of
view, which is exactly why no page-per-capability was built.

## 18. What you can confidently explain in a presentation

- The overall pipeline and why the frontend only needs a generic result
  shape, not knowledge of any model
- Why the workspace is one reusable screen instead of four demo pages
- How Zustand keeps state in one place instead of passing props everywhere
- How mock mode lets the whole UI be demoed today, and swapped for the
  real API later by editing one file
- How the evidence format (`type`, `label`, `score`, `coordinates`) is
  designed to support boxes now and masks/polygons later without a rewrite
