import axios from 'axios'

// This file is the ONLY place in the app that handles API communication.

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

/**
 * Runs an analysis for the given file + query.
 *
 * The real model/backend is not connected yet,
 * so we currently show "Model not yet connected"
 * instead of returning mock analysis data.
 */
export async function runAnalysis({ file, query, onStep }) {
  // Model is not connected yet.
  throw new Error('Model not yet connected')
}

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