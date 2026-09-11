// Hand-written mock responses used until M4's real backend is connected.
// These follow the exact "common result format" the whole team agreed on,
// so swapping mock data for a real API response later requires no UI changes.

const VQA_ANSWERS = [
  'The image shows a mixed-use area with residential blocks, cultivated fields, and a river running through the scene.',
  'The scene contains built-up regions in the center, surrounded by agricultural parcels and sparse vegetation.',
  'This appears to be a peri-urban area: a road network connects clustered buildings to open farmland.',
]

export function buildMockVqaResult(query) {
  return {
    task: 'vqa',
    status: 'success',
    answer: pick(VQA_ANSWERS, query),
    confidence: 0.83 + smallJitter(query),
    evidence: [],
    statistics: {},
    artifacts: [],
    trace: [
      'Understanding query',
      'Selecting VQA capability',
      'Analyzing image',
      'Validating result',
    ],
  }
}

export function buildMockGroundingResult(query) {
  const target = query.toLowerCase().includes('road') ? 'road segment' : 'building cluster'
  return {
    task: 'grounding',
    status: 'success',
    answer: `Several ${target}s were identified and marked as visual evidence on the image.`,
    confidence: 0.88 + smallJitter(query),
    evidence: [
      {
        id: 'box-1',
        type: 'bounding_box',
        label: target,
        score: 0.94,
        // coordinates are percentages of image width/height: [x1, y1, x2, y2]
        coordinates: [18, 25, 31, 38],
      },
      {
        id: 'box-2',
        type: 'bounding_box',
        label: target,
        score: 0.89,
        coordinates: [52, 42, 66, 55],
      },
      {
        id: 'box-3',
        type: 'bounding_box',
        label: target,
        score: 0.81,
        coordinates: [40, 58, 50, 68],
      },
    ],
    statistics: {},
    artifacts: [],
    trace: [
      'Understanding query',
      'Selecting grounding capability',
      'Analyzing image',
      'Generating visual evidence',
      'Validating result',
    ],
  }
}

function pick(list, seed) {
  const index = Math.abs(hashString(seed)) % list.length
  return list[index]
}

function smallJitter(seed) {
  return (Math.abs(hashString(seed)) % 8) / 100
}

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}
