import type { JSONContent } from '@tiptap/core'
import { WORDS_PER_MINUTE } from './constants'

export const EMPTY_DOC: JSONContent = { type: 'doc', content: [] }

function collectText(node: JSONContent): string {
  if (node.text) return node.text
  return (node.content ?? []).map(collectText).join(' ')
}

const MEDIA_NODES = new Set([
  'image',
  'youtube',
  'twitch',
  'audio',
  'inlineMath',
  'blockMath',
  'emoji',
  'horizontalRule',
])

function hasMedia(node: JSONContent): boolean {
  if (node.type && MEDIA_NODES.has(node.type)) return true
  return (node.content ?? []).some(hasMedia)
}

export function countWords(json: JSONContent) {
  return collectText(json).split(/\s+/).filter(Boolean).length
}

export function readingTime(json: JSONContent) {
  return Math.max(1, Math.ceil(countWords(json) / WORDS_PER_MINUTE))
}

export function isEmptyDoc(json: JSONContent) {
  return countWords(json) === 0 && !hasMedia(json)
}
