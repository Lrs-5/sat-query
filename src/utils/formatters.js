// Small formatting helpers shared across components.

export function toPercent(value) {
  if (typeof value !== 'number') return '—'
  return `${Math.round(value * 100)}%`
}

export const CAPABILITY_LABELS = {
  vqa: 'Visual Question Answering',
  grounding: 'Visual Grounding',
}

export function taskLabel(task) {
  if (task === 'vqa') return 'VQA'
  if (task === 'grounding') return 'GROUNDING'
  return task?.toUpperCase() || '—'
}
