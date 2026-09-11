import { buildMockVqaResult, buildMockGroundingResult } from './mockData.js'

const GROUNDING_KEYWORDS = ['where', 'locate', 'find', 'road', 'building', 'vehicle', 'show me']

/**
 * Looks at the wording of the query and guesses whether the user wants a
 * plain answer (VQA) or wants things pointed out on the image (grounding).
 * M3's real AI agent will eventually make this decision properly — this is
 * just enough logic to make the mock demo feel responsive to what's typed.
 */
function inferTask(query) {
  const lower = query.toLowerCase()
  return GROUNDING_KEYWORDS.some((keyword) => lower.includes(keyword)) ? 'grounding' : 'vqa'
}

const STEP_DELAY_MS = 500

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Simulates the full pipeline (query understanding -> capability routing ->
 * analysis -> result) with a short delay per step, calling `onStep` as each
 * one "completes" so the UI can animate the execution trace.
 */
export async function runMockAnalysis({ query, onStep }) {
  const task = inferTask(query)
  const result = task === 'grounding' ? buildMockGroundingResult(query) : buildMockVqaResult(query)

  for (const step of result.trace) {
    await wait(STEP_DELAY_MS)
    onStep?.(step)
  }

  return result
}
