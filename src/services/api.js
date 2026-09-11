import axios from 'axios'
import { runMockAnalysis } from './mockAnalysis.js'

// This file is the ONLY place in the app that knows whether we're talking to
// mock data or to M4's real FastAPI backend. Every component calls the
// functions exported here instead of using axios directly — so switching
// modes later never requires touching component code.

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

/**
 * Runs an analysis for the given file + query.
 *
 * Mock mode: fabricates a realistic result locally (see mockAnalysis.js).
 * Real mode (VITE_USE_MOCK=false): this is where the three real calls to
 * M4 would happen instead — POST /upload, POST /query, then GET
 * /results/{id} — returning the exact same "common result" shape so the
 * rest of the app does not need to change.
 */
export async function runAnalysis({ file, query, onStep }) {
  if (USE_MOCK) {
    return runMockAnalysis({ query, onStep })
  }

  // --- Real backend integration (not active while VITE_USE_MOCK=true) ---
  // Left intentionally simple: M4 owns the actual contract details.
  //
  // const uploadForm = new FormData()
  // uploadForm.append('file', file)
  // const { data: uploaded } = await httpClient.post('/upload', uploadForm)
  //
  // const { data: queued } = await httpClient.post('/query', {
  //   fileId: uploaded.fileId,
  //   query,
  // })
  //
  // const { data: result } = await httpClient.get(`/results/${queued.resultId}`)
  // return result

  throw new Error('Real backend mode is not connected yet.')
}

/**
 * Checks whether the M4 backend is reachable. Only meaningful once
 * VITE_USE_MOCK=false. Safe to call in mock mode — it just resolves to a
 * mock "online" status without making a network request.
 */
export async function checkHealth() {
  if (USE_MOCK) {
    return { status: 'ok', mode: 'mock' }
  }
  const { data } = await httpClient.get('/health')
  return data
}

export const isMockMode = () => USE_MOCK
