import Audio from '@tiptap/extension-audio'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import {
  Details,
  DetailsContent,
  DetailsSummary,
} from '@tiptap/extension-details'
import Emoji from '@tiptap/extension-emoji'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { BlockMath, InlineMath } from '@tiptap/extension-mathematics'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { TableKit } from '@tiptap/extension-table'
import TableOfContents from '@tiptap/extension-table-of-contents'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyleKit } from '@tiptap/extension-text-style'
import Twitch from '@tiptap/extension-twitch'
import Typography from '@tiptap/extension-typography'
import Youtube from '@tiptap/extension-youtube'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'

export const lowlight = createLowlight(common)

export const HEADING_LEVELS = [2, 3, 4] as const

// Twitch refuses to play unless the embed names the page's host.
const siteHost = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
).hostname

const katexOptions = { throwOnError: false }

// Shared by the client editor and the server renderer so both agree on the
// document schema. Editor-only behavior (placeholder, drag handle, file
// handling, invisible characters, counters) is added in the editor.
// Heading, code block, math, and emoji are top-level entries so the server
// renderer can swap them for static versions (see render.ts).
export const blogExtensions = [
  StarterKit.configure({
    heading: false,
    codeBlock: false,
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      HTMLAttributes: { rel: 'noopener noreferrer', target: null },
    },
  }),
  Heading.configure({ levels: [...HEADING_LEVELS] }),
  CodeBlockLowlight.configure({ lowlight, defaultLanguage: null }),
  Image.configure({
    HTMLAttributes: { loading: 'lazy' },
    resize: {
      enabled: true,
      directions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      alwaysPreserveAspectRatio: true,
      minWidth: 80,
    },
  }),
  TableKit.configure({ table: { resizable: true } }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Highlight.configure({ multicolor: true }),
  TextStyleKit,
  Subscript,
  Superscript,
  Typography,
  TaskList,
  TaskItem.configure({ nested: true }),
  Youtube.configure({ nocookie: true, width: 640, height: 360 }),
  Twitch.configure({ parent: siteHost, width: 640, height: 360 }),
  Audio,
  Details.configure({ persist: true }),
  DetailsSummary,
  DetailsContent,
  InlineMath.configure({ katexOptions }),
  BlockMath.configure({ katexOptions }),
  Emoji.configure({ enableEmoticons: true }),
  TableOfContents.configure({ anchorTypes: ['heading'] }),
]
