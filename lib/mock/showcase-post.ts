import type { JSONContent } from '@tiptap/core'

// Seed content for "The editor, feature by feature": one post that uses every
// extension in lib/blog/extensions.ts, so the public renderer and sanitizer
// can be checked against all of them at once.

type Mark = NonNullable<JSONContent['marks']>[number]

function text(value: string, ...marks: Mark[]): JSONContent {
  return marks.length > 0
    ? { type: 'text', text: value, marks }
    : { type: 'text', text: value }
}

function p(...content: (JSONContent | string)[]): JSONContent {
  return {
    type: 'paragraph',
    content: content.map((item) =>
      typeof item === 'string' ? text(item) : item,
    ),
  }
}

function h(level: 2 | 3 | 4, value: string): JSONContent {
  return { type: 'heading', attrs: { level }, content: [text(value)] }
}

function list(type: 'bulletList' | 'orderedList', items: JSONContent[][]) {
  return {
    type,
    content: items.map((content) => ({ type: 'listItem', content })),
  }
}

function cell(type: 'tableHeader' | 'tableCell', value: string): JSONContent {
  return { type, content: [p(value)] }
}

function row(type: 'tableHeader' | 'tableCell', values: string[]) {
  return { type: 'tableRow', content: values.map((value) => cell(type, value)) }
}

function task(checked: boolean, value: string, nested?: JSONContent) {
  return {
    type: 'taskItem',
    attrs: { checked },
    content: nested ? [p(value), nested] : [p(value)],
  }
}

function code(language: string, value: string): JSONContent {
  return { type: 'codeBlock', attrs: { language }, content: [text(value)] }
}

function emoji(name: string): JSONContent {
  return { type: 'emoji', attrs: { name } }
}

function math(latex: string): JSONContent {
  return { type: 'inlineMath', attrs: { latex } }
}

const bold: Mark = { type: 'bold' }
const italic: Mark = { type: 'italic' }
const underline: Mark = { type: 'underline' }
const strike: Mark = { type: 'strike' }
const inlineCode: Mark = { type: 'code' }
const sub: Mark = { type: 'subscript' }
const sup: Mark = { type: 'superscript' }

function link(href: string): Mark {
  return { type: 'link', attrs: { href } }
}

function highlight(color: string): Mark {
  return { type: 'highlight', attrs: { color } }
}

function style(attrs: Record<string, string>): Mark {
  return { type: 'textStyle', attrs }
}

export const showcaseContent: JSONContent = {
  type: 'doc',
  content: [
    p(
      'This post is a guided tour of the editor. Every block below was built with one of the free Tiptap extensions the dashboard ships with, and each section says where to find it in the toolbar. Open the post in the editor next to this page to see both sides. ',
      emoji('rocket'),
    ),

    h(2, 'Writing and text formatting'),
    p(
      'The basics come from StarterKit: ',
      text('bold', bold),
      ', ',
      text('italic', italic),
      ', ',
      text('underline', underline),
      ', ',
      text('strikethrough', strike),
      ', ',
      text('inline code', inlineCode),
      ', and ',
      text('links', link('https://tiptap.dev/docs/editor/extensions')),
      '. Select any text to get the same options in a floating bubble menu.',
    ),
    p(
      'Subscript and superscript cover chemistry and footnotes: H',
      text('2', sub),
      'O, CO',
      text('2', sub),
      ', and x',
      text('2', sup),
      ' + y',
      text('2', sup),
      '. Typography turns plain punctuation into the real thing as you type: "quotes" become curly, -- becomes an en dash, ... becomes an ellipsis, and (c) becomes ©.',
    ),
    h(3, 'Color, highlight, and type'),
    p(
      'Use the highlighter for ',
      text('yellow', highlight('#fef08a')),
      ', ',
      text('green', highlight('#bbf7d0')),
      ', ',
      text('blue', highlight('#bfdbfe')),
      ', or ',
      text('pink', highlight('#fbcfe8')),
      ' highlights, and the text color picker for ',
      text('red', style({ color: '#b3261e' })),
      ', ',
      text('teal', style({ color: '#0f766e' })),
      ', or ',
      text('purple', style({ color: '#7e22ce' })),
      ' text.',
    ),
    p(
      'The text style controls also set the ',
      text('font family', style({ fontFamily: 'ui-monospace, monospace' })),
      ', the ',
      text('font size', style({ fontSize: '24px' })),
      ', and the line spacing of a selection.',
    ),
    {
      type: 'paragraph',
      content: [
        text(
          'This paragraph uses a line height of 2, which is useful for pull quotes or short intros that need room to breathe. Most body text reads best at the default.',
          style({ lineHeight: '2' }),
        ),
      ],
    },
    h(3, 'Alignment'),
    {
      type: 'paragraph',
      attrs: { textAlign: 'center' },
      content: [text('This paragraph is centered.', italic)],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'right' },
      content: [text('This one is aligned to the right.')],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'justify' },
      content: [
        text(
          'Justified text stretches every line except the last to the full width of the column. It suits long, dense paragraphs in a narrow layout, where ragged edges would otherwise draw the eye. Use it sparingly on the web, since uneven word spacing can make text harder to read.',
        ),
      ],
    },

    h(2, 'Lists and tasks'),
    list('bulletList', [
      [p('Bulleted lists for loose collections of ideas')],
      [
        p('Nested items with Tab and Shift+Tab'),
        list('bulletList', [[p('Like this one')]]),
      ],
    ]),
    list('orderedList', [
      [p('Numbered lists for steps')],
      [p('Type 1. at the start of a line to begin one')],
      [p('Press Enter twice to leave the list')],
    ]),
    p(
      'Task lists render as real checkboxes. Readers see them checked or not; authors toggle them in the editor.',
    ),
    {
      type: 'taskList',
      content: [
        task(true, 'Draft the post'),
        task(true, 'Add images and a table'),
        task(false, 'Get a review', {
          type: 'taskList',
          content: [task(true, 'Technical accuracy'), task(false, 'Copy edit')],
        }),
        task(false, 'Schedule for Monday morning'),
      ],
    },

    h(2, 'Quotes, code, and dividers'),
    {
      type: 'blockquote',
      content: [
        p(
          'Simplicity is prerequisite for reliability. ',
          text('— Edsger W. Dijkstra', italic),
        ),
      ],
    },
    p(
      'Code blocks are syntax highlighted. Pick the language from the bar that appears under the toolbar while the cursor is inside a block.',
    ),
    code(
      'ts',
      `import { generateHTML } from '@tiptap/html'

export function renderContent(json: JSONContent) {
  const html = generateHTML(json, blogExtensions)
  return sanitize(html) // never trust client HTML
}`,
    ),
    code(
      'python',
      `def reading_time(words: int, wpm: int = 220) -> int:
    """Minutes, rounded up, never zero."""
    return max(1, -(-words // wpm))`,
    ),
    code(
      'css',
      `.prose table {
  border-collapse: collapse;
  overflow-x: auto;
}`,
    ),
    { type: 'horizontalRule' },

    h(2, 'Images'),
    p(
      'Insert images from the toolbar. Upload one from your computer, or paste a URL. You can also drag a file straight into the editor, or paste a copied image. Drag the corner handles to resize.',
    ),
    {
      type: 'image',
      attrs: {
        src: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600',
        alt: 'A typewriter with a sheet of paper on a desk',
        title: 'Full-width image',
      },
    },
    {
      type: 'image',
      attrs: {
        src: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200',
        alt: 'An open notebook with handwritten notes and a pen',
        title: 'Resized to 360px',
        width: 360,
      },
    },

    h(2, 'Tables'),
    p(
      'Insert a table from the toolbar. While the cursor is inside it, a table bar appears with controls to add and remove rows and columns, merge and split cells, and toggle header rows. Drag a column border to resize it.',
    ),
    {
      type: 'table',
      content: [
        row('tableHeader', ['Plan', 'Posts per month', 'Editors', 'Price']),
        row('tableCell', ['Hobby', '10', '1', 'Free']),
        row('tableCell', ['Team', 'Unlimited', '5', '$12 / month']),
        {
          type: 'tableRow',
          content: [
            cell('tableCell', 'Enterprise'),
            {
              type: 'tableCell',
              attrs: { colspan: 3 },
              content: [
                p('Custom: talk to us. This cell spans three columns.'),
              ],
            },
          ],
        },
      ],
    },

    h(2, 'Collapsible sections'),
    p(
      'Details blocks hide supporting material until the reader asks for it. They are a good fit for FAQs, spoilers, and long logs.',
    ),
    {
      type: 'details',
      content: [
        {
          type: 'detailsSummary',
          content: [text('Does the blog work without JavaScript?')],
        },
        {
          type: 'detailsContent',
          content: [
            p(
              'Yes. Posts are rendered to HTML on the server and sections like this one use the native ',
              text('<details>', inlineCode),
              ' element, so they open and close without any scripts.',
            ),
          ],
        },
      ],
    },
    {
      type: 'details',
      content: [
        {
          type: 'detailsSummary',
          content: [text('Where are uploaded images stored?')],
        },
        {
          type: 'detailsContent',
          content: [
            p(
              'In this demo they are kept in memory and reset when the server restarts. In production they would go to object storage such as S3 or R2.',
            ),
          ],
        },
      ],
    },

    h(2, 'Math'),
    p(
      'Inline formulas sit inside a sentence, like ',
      math('E = mc^2'),
      ' or the quadratic formula ',
      math('x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'),
      '. Type $$...$$ around LaTeX, or use the √ button. Block formulas get their own line:',
    ),
    {
      type: 'blockMath',
      attrs: {
        latex: '\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}',
      },
    },
    {
      type: 'blockMath',
      attrs: {
        latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}',
      },
    },
    p('Click any formula in the editor to edit it.'),

    h(2, 'Emoji'),
    p(
      'Type a shortcode between colons, such as :tada:, or pick one from the emoji button. ',
      emoji('tada'),
      ' ',
      emoji('sparkles'),
      ' ',
      emoji('coffee'),
      ' ',
      emoji('books'),
      ' ',
      emoji('bulb'),
      ' Emoticons like :) work too.',
    ),

    h(2, 'Video and audio'),
    p(
      'The embed button accepts YouTube and Twitch links and direct links to audio files. YouTube videos load from youtube-nocookie.com.',
    ),
    h(3, 'YouTube'),
    {
      type: 'youtube',
      attrs: { src: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' },
    },
    h(3, 'Twitch'),
    {
      type: 'twitch',
      attrs: { src: 'https://www.twitch.tv/twitchdev' },
    },
    h(3, 'Audio'),
    {
      type: 'audio',
      attrs: {
        src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
        controls: true,
      },
    },

    h(2, 'Editing helpers'),
    p('Some extensions help while writing and do not show up in the post:'),
    list('bulletList', [
      [
        p(
          text('Drag handle: ', bold),
          'hover a block and drag the grip on its left to move it.',
        ),
      ],
      [
        p(
          text('Floating menu: ', bold),
          'on an empty line, shortcuts appear for headings, lists, code, images, and tables.',
        ),
      ],
      [
        p(
          text('Outline: ', bold),
          'the outline button lists every heading and jumps to it. Published posts with three or more headings get an "On this page" box like the one at the top of this post.',
        ),
      ],
      [
        p(
          text('Character count: ', bold),
          'the footer shows words, characters, and reading time as you type.',
        ),
      ],
      [
        p(
          text('Formatting marks: ', bold),
          'toggle them in the footer to show spaces, line breaks, and paragraph ends.',
        ),
      ],
      [
        p(
          text('Focus, selection, and drop cursor: ', bold),
          'the current block is marked, the selection stays visible while a dialog is open, and a line shows where dropped content will land.',
        ),
      ],
      [
        p(
          text('Placeholder and trailing node: ', bold),
          'empty posts show a hint, and there is always an empty line after the last block so you can keep typing below a table or image.',
        ),
      ],
    ]),
    p(
      'Line breaks within a paragraph use Shift+Enter.',
      { type: 'hardBreak' },
      'Like this.',
    ),
    p('That covers everything. Happy writing! ', emoji('wave')),
  ],
}
