import type { JSONContent } from '@tiptap/core'
import slugify from 'slugify'

export interface OutlineItem {
  id: string
  level: number
  text: string
}

function collectText(node: JSONContent): string {
  if (node.text) return node.text
  return (node.content ?? []).map(collectText).join('')
}

// Readable, unique anchors for headings, in document order. The renderer
// assigns ids with the same generator so the public table of contents and
// the rendered headings always agree.
export function createHeadingIds() {
  const used = new Map<string, number>()
  return (text: string) => {
    const base = slugify(text, { lower: true, strict: true }) || 'section'
    const count = used.get(base) ?? 0
    used.set(base, count + 1)
    return count === 0 ? base : `${base}-${count + 1}`
  }
}

export function outline(json: JSONContent) {
  const nextId = createHeadingIds()
  const items: OutlineItem[] = []

  function walk(node: JSONContent) {
    if (node.type === 'heading') {
      const text = collectText(node).trim()
      const id = nextId(text)
      if (text) items.push({ id, level: node.attrs?.level ?? 2, text })
      return
    }
    node.content?.forEach(walk)
  }

  walk(json)
  return items
}
