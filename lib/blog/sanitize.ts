import sanitizeHtml from 'sanitize-html'

const ALLOWED_TAGS = [
  'h2',
  'h3',
  'h4',
  'p',
  'br',
  'a',
  'ul',
  'ol',
  'li',
  'blockquote',
  'pre',
  'code',
  'img',
  'strong',
  'em',
  'u',
  's',
  'hr',
  'figure',
  'figcaption',
  'mark',
  'span',
  'sub',
  'sup',
  'div',
  'label',
  'input',
  'table',
  'colgroup',
  'col',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'details',
  'summary',
  'iframe',
  'audio',
]

const COLOR =
  /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|var\(--[\w-]+\)|inherit|[a-z]+)$/i
const LENGTH = /^\d+(\.\d+)?(px|em|rem|%)?$/

const TEXT_ALIGN = { 'text-align': [/^(left|right|center|justify)$/] }
const CELL_WIDTH = { width: [LENGTH], 'min-width': [LENGTH] }

// Embeds are limited to players that are safe to frame.
const IFRAME_HOSTS = [
  'www.youtube-nocookie.com',
  'www.youtube.com',
  'player.twitch.tv',
  'clips.twitch.tv',
]

export function sanitizeContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      code: ['class'],
      span: ['class', 'style', 'data-type', 'data-name', 'data-math'],
      mark: ['style', 'data-color'],
      p: ['style'],
      h2: ['id', 'style'],
      h3: ['id', 'style'],
      h4: ['id', 'style'],
      ul: ['data-type'],
      ol: ['start', 'type'],
      li: ['data-type', 'data-checked'],
      input: ['type', 'checked', 'disabled'],
      div: [
        'data-type',
        'data-math',
        'data-youtube-video',
        'data-twitch-video',
      ],
      table: ['style'],
      col: ['style', 'span'],
      th: ['colspan', 'rowspan', 'colwidth', 'style'],
      td: ['colspan', 'rowspan', 'colwidth', 'style'],
      details: ['open'],
      iframe: ['src', 'width', 'height', 'allowfullscreen', 'frameborder'],
      audio: ['src', 'controls', 'preload'],
    },
    allowedClasses: {
      code: ['language-*', 'hljs'],
      span: ['hljs-*', 'language-*'],
    },
    allowedStyles: {
      p: TEXT_ALIGN,
      h2: TEXT_ALIGN,
      h3: TEXT_ALIGN,
      h4: TEXT_ALIGN,
      mark: { 'background-color': [COLOR], color: [COLOR] },
      span: {
        color: [COLOR],
        'background-color': [COLOR],
        'font-family': [/^[\w\s,'"-]+$/],
        'font-size': [LENGTH],
        'line-height': [/^\d+(\.\d+)?(px|em|rem|%)?$/],
      },
      table: CELL_WIDTH,
      col: CELL_WIDTH,
      th: CELL_WIDTH,
      td: CELL_WIDTH,
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https'],
      iframe: ['https'],
      audio: ['http', 'https'],
    },
    allowedIframeHostnames: IFRAME_HOSTS,
    allowIframeRelativeUrls: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
      input: (_, attribs) => ({
        tagName: attribs.type === 'checkbox' ? 'input' : 'span',
        attribs:
          attribs.type === 'checkbox'
            ? { ...attribs, type: 'checkbox', disabled: 'disabled' }
            : {},
      }),
    },
  })
}

export function stripTags(text: string) {
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} }).trim()
}
