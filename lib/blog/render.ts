import 'server-only'

import type { AnyExtension, JSONContent, Node } from '@tiptap/core'
import { shortcodeToEmoji } from '@tiptap/extension-emoji'
import { generateHTML } from '@tiptap/html'
import type { DOMOutputSpec } from '@tiptap/pm/model'
import katex from 'katex'
import { blogExtensions, lowlight } from './extensions'
import { createHeadingIds } from './outline'
import { sanitizeContent } from './sanitize'

type HastNode = ReturnType<typeof lowlight.highlight>['children'][number]

function hastToSpec(node: HastNode): DOMOutputSpec | string {
  if (node.type === 'text') return node.value
  if (node.type !== 'element') return ''
  const className = node.properties.className
  return [
    node.tagName,
    { class: Array.isArray(className) ? className.join(' ') : null },
    ...node.children.map(hastToSpec),
  ] as DOMOutputSpec
}

function highlightedCode(code: string, language: string | null) {
  if (!language || !lowlight.registered(language)) return [code]
  return lowlight.highlight(language, code).children.map(hastToSpec)
}

// The editor renders a few nodes with client-side node views (KaTeX, syntax
// highlighting, emoji images). For stored HTML the server swaps them for
// static versions: highlighted code as `hljs-*` spans, math as placeholders
// that are replaced with KaTeX markup after sanitizing, and emoji as text.
function serverExtensions() {
  const nextHeadingId = createHeadingIds()

  const overrides: Record<string, (extension: Node) => AnyExtension> = {
    heading: (extension) =>
      extension.extend({
        renderHTML({ node, HTMLAttributes }) {
          return [
            `h${node.attrs.level}`,
            { ...HTMLAttributes, id: nextHeadingId(node.textContent) },
            0,
          ]
        },
      }),
    codeBlock: (extension) =>
      extension.extend({
        renderHTML({ node }) {
          const language = node.attrs.language as string | null
          return [
            'pre',
            [
              'code',
              { class: language ? `language-${language} hljs` : null },
              ...highlightedCode(node.textContent, language),
            ],
          ]
        },
      }),
    inlineMath: (extension) =>
      extension.extend({
        renderHTML({ node }) {
          return ['span', { 'data-math': 'inline' }, node.attrs.latex ?? '']
        },
      }),
    blockMath: (extension) =>
      extension.extend({
        renderHTML({ node }) {
          return ['div', { 'data-math': 'block' }, node.attrs.latex ?? '']
        },
      }),
    emoji: (extension) =>
      extension.extend({
        renderHTML({ node }) {
          const name = node.attrs.name as string
          const item = shortcodeToEmoji(name, this.options.emojis)
          return [
            'span',
            { 'data-type': 'emoji', 'data-name': name },
            item?.emoji ?? `:${name}:`,
          ]
        },
      }),
  }

  return blogExtensions.map(
    (extension) => overrides[extension.name]?.(extension as Node) ?? extension,
  )
}

function decodeEntities(text: string) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&amp;/g, '&')
}

// KaTeX output is generated from the LaTeX string (with `trust` off), so it
// is inserted after sanitizing rather than widening the allowlist for it.
function renderMath(html: string) {
  return html.replace(
    /<(span|div) data-math="(inline|block)">([\s\S]*?)<\/\1>/g,
    (_, tag: string, mode: string, latex: string) =>
      `<${tag} data-math="${mode}">${katex.renderToString(
        decodeEntities(latex),
        { displayMode: mode === 'block', throwOnError: false, trust: false },
      )}</${tag}>`,
  )
}

// Never trust HTML from the client: the server renders it from the Tiptap
// JSON and sanitizes the result before it is stored.
export function renderContent(json: JSONContent) {
  return renderMath(sanitizeContent(generateHTML(json, serverExtensions())))
}
