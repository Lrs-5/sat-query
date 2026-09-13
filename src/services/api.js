import axios from 'axios'
import { runMockAnalysis as runMockAnalysisRequest } from './mockAnalysis.js'

// This file is the ONLY place in the app that handles API communication.

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// 60s, not 15s: real agent analysis (upload + fusion + VLM inference) takes
// meaningfully longer than the mock's fixed-delay simulation.
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
})

/**
 * Runs an analysis for the given file + query.
 *
 * Two calls to the real backend:
 *   1. POST /upload  (multipart/form-data) -> { file_id }
 *   2. POST /query    ({ file_id, query })  -> AnalysisResult, returned
 *      synchronously (no polling of /results/{id} needed for this flow).
 *
 * The backend doesn't stream intermediate steps, so once the result comes
 * back we replay its own `trace` array through `onStep` with a short delay
 * per step — this keeps ExecutionTrace's step-by-step animation working
 * exactly as it does in mock mode, with zero component changes.
 */
export async function runAnalysis({ file, query, onStep }) {
  if (USE_MOCK) {
    return runMockAnalysisRequest({ query, onStep })
  }

  const formData = new FormData()
  formData.append('file', file)

  const { data: uploadData } = await httpClient.post('/upload', formData)
  const fileId = uploadData.file_id

  const { data: result } = await httpClient.post('/query', {
    file_id: fileId,
    query,
  })

  for (const step of result.trace ?? []) {
    await wait(STEP_REPLAY_DELAY_MS)
    onStep?.(step)
  }

  return result
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const STEP_REPLAY_DELAY_MS = 400

/**
 * Checks whether the backend is reachable.
 */
export async function checkHealth() {
  if (USE_MOCK) {
    return { status: 'ok', mode: 'mock' }
  }

  const { data } = await httpClient.get('/health')
  return data
}

export const isMockMode = () => USE_MOCK