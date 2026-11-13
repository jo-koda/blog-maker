'use client'

import { Editor, useEditorState } from '@tiptap/react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  ChevronsDownUp,
  Code,
  Code2,
  Heading2,
  Heading3,
  Heading4,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  ListTree,
  Minus,
  Pilcrow,
  Quote,
  Radical,
  Redo2,
  RemoveFormatting,
  Sigma,
  Smile,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  Underline,
  Undo2,
  SquarePlay,
} from 'lucide-react'
import { lowlight } from '@/lib/blog/extensions'
import { cn } from '@/lib/utils'
import {
  Divider,
  ToolButton,
  ToolPopover,
  ToolSelect,
} from '../_components/tool-button'
import EmojiPicker from './emoji-picker'
import TableToolbar from './table-toolbar'

export interface OutlineEntry {
  id: string
  level: number
  text: string
  pos: number
  isActive: boolean
}

export type MathMode = 'inline' | 'block'

const TEXT_COLORS = [
  { label: 'Gray', value: '#6b6b66' },
  { label: 'Red', value: '#b3261e' },
  { label: 'Orange', value: '#c2410c' },
  { label: 'Amber', value: '#a16207' },
  { label: 'Green', value: '#1e7a46' },
  { label: 'Teal', value: '#0f766e' },
  { label: 'Blue', value: '#1d4ed8' },
  { label: 'Purple', value: '#7e22ce' },
  { label: 'Pink', value: '#be185d' },
]

const HIGHLIGHTS = [
  { label: 'Yellow', value: '#fef08a' },
  { label: 'Green', value: '#bbf7d0' },
  { label: 'Blue', value: '#bfdbfe' },
  { label: 'Pink', value: '#fbcfe8' },
  { label: 'Purple', value: '#e9d5ff' },
  { label: 'Orange', value: '#fed7aa' },
]

const FONT_FAMILIES = [
  { label: 'Font', value: '' },
  { label: 'Serif', value: 'Georgia, serif' },
  { label: 'Sans', value: 'ui-sans-serif, system-ui, sans-serif' },
  { label: 'Mono', value: 'ui-monospace, monospace' },
]

const FONT_SIZES = [
  { label: 'Size', value: '' },
  ...['14px', '16px', '18px', '20px', '24px', '30px'].map((value) => ({
    label: value.replace('px', ''),
    value,
  })),
]

const LINE_HEIGHTS = [
  { label: 'Spacing', value: '' },
  ...['1.2', '1.5', '1.8', '2'].map((value) => ({ label: value, value })),
]

const LANGUAGES = [
  { label: 'Plain text', value: '' },
  ...lowlight
    .listLanguages()
    .sort()
    .map((value) => ({ label: value, value })),
]

function Swatches({
  colors,
  current,
  onPick,
  onClear,
  round = false,
}: {
  colors: { label: string; value: string }[]
  current: string | undefined
  onPick: (value: string) => void
  onClear: () => void
  round?: boolean
}) {
  return (
    <div className='flex w-44 flex-col gap-2'>
      <div className='grid grid-cols-5 gap-1.5'>
        {colors.map((color) => (
          <button
            key={color.value}
            type='button'
            title={color.label}
            aria-label={color.label}
            aria-pressed={current === color.value}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onPick(color.value)}
            style={{ background: color.value }}
            className={cn(
              'size-7 cursor-pointer border border-black/10',
              round ? 'rounded-full' : 'rounded-md',
              current === color.value && 'ring-primary ring-2 ring-offset-1',
            )}
          />
        ))}
      </div>
      <button
        type='button'
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClear}
        className='text-muted-foreground hover:bg-muted cursor-pointer rounded-md px-2 py-1 text-left text-xs'
      >
        Remove
      </button>
    </div>
  )
}

export default function EditorToolbar({
  editor,
  outline,
  onLink,
  onImage,
  onEmbed,
  onMath,
}: {
  editor: Editor
  outline: OutlineEntry[]
  onLink: () => void
  onImage: () => void
  onEmbed: () => void
  onMath: (mode: MathMode) => void
}) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => {
      const textStyle = editor.getAttributes('textStyle')
      return {
        paragraph: editor.isActive('paragraph'),
        h2: editor.isActive('heading', { level: 2 }),
        h3: editor.isActive('heading', { level: 3 }),
        h4: editor.isActive('heading', { level: 4 }),
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strike: editor.isActive('strike'),
        code: editor.isActive('code'),
        subscript: editor.isActive('subscript'),
        superscript: editor.isActive('superscript'),
        link: editor.isActive('link'),
        highlight: editor.getAttributes('highlight').color as
          string | undefined,
        isHighlighted: editor.isActive('highlight'),
        color: textStyle.color as string | undefined,
        fontFamily: (textStyle.fontFamily as string | undefined) ?? '',
        fontSize: (textStyle.fontSize as string | undefined) ?? '',
        lineHeight: (textStyle.lineHeight as string | undefined) ?? '',
        alignLeft: editor.isActive({ textAlign: 'left' }),
        alignCenter: editor.isActive({ textAlign: 'center' }),
        alignRight: editor.isActive({ textAlign: 'right' }),
        alignJustify: editor.isActive({ textAlign: 'justify' }),
        bulletList: editor.isActive('bulletList'),
        orderedList: editor.isActive('orderedList'),
        taskList: editor.isActive('taskList'),
        blockquote: editor.isActive('blockquote'),
        codeBlock: editor.isActive('codeBlock'),
        language:
          (editor.getAttributes('codeBlock').language as string | null) ?? '',
        details: editor.isActive('details'),
        table: editor.isActive('table'),
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
      }
    },
  })

  const chain = () => editor.chain().focus()

  function scrollToHeading(entry: OutlineEntry) {
    chain()
      .setTextSelection(entry.pos + 1)
      .run()
    editor.view
      .domAtPos(entry.pos + 1)
      .node.parentElement?.closest('h2, h3, h4')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className='bg-card/95 sticky top-0 z-20 border-y backdrop-blur'>
      <div
        role='toolbar'
        aria-label='Formatting'
        className='flex flex-wrap items-center gap-0.5 px-3 py-1.5'
      >
        <ToolButton
          label='Undo'
          disabled={!state.canUndo}
          onClick={() => chain().undo().run()}
        >
          <Undo2 />
        </ToolButton>
        <ToolButton
          label='Redo'
          disabled={!state.canRedo}
          onClick={() => chain().redo().run()}
        >
          <Redo2 />
        </ToolButton>
        <Divider />
        <ToolButton
          label='Paragraph'
          active={state.paragraph}
          onClick={() => chain().setParagraph().run()}
        >
          <Pilcrow />
        </ToolButton>
        <ToolButton
          label='Heading 2'
          active={state.h2}
          onClick={() => chain().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 />
        </ToolButton>
        <ToolButton
          label='Heading 3'
          active={state.h3}
          onClick={() => chain().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 />
        </ToolButton>
        <ToolButton
          label='Heading 4'
          active={state.h4}
          onClick={() => chain().toggleHeading({ level: 4 }).run()}
        >
          <Heading4 />
        </ToolButton>
        <Divider />
        <ToolSelect
          label='Font family'
          value={state.fontFamily}
          options={FONT_FAMILIES}
          onChange={(value) =>
            value
              ? chain().setFontFamily(value).run()
              : chain().unsetFontFamily().run()
          }
        />
        <ToolSelect
          label='Font size'
          value={state.fontSize}
          options={FONT_SIZES}
          onChange={(value) =>
            value
              ? chain().setFontSize(value).run()
              : chain().unsetFontSize().run()
          }
        />
        <ToolSelect
          label='Line spacing'
          value={state.lineHeight}
          options={LINE_HEIGHTS}
          onChange={(value) =>
            value
              ? chain().setLineHeight(value).run()
              : chain().unsetLineHeight().run()
          }
        />
        <Divider />
        <ToolButton
          label='Bold'
          active={state.bold}
          onClick={() => chain().toggleBold().run()}
        >
          <Bold />
        </ToolButton>
        <ToolButton
          label='Italic'
          active={state.italic}
          onClick={() => chain().toggleItalic().run()}
        >
          <Italic />
        </ToolButton>
        <ToolButton
          label='Underline'
          active={state.underline}
          onClick={() => chain().toggleUnderline().run()}
        >
          <Underline />
        </ToolButton>
        <ToolButton
          label='Strikethrough'
          active={state.strike}
          onClick={() => chain().toggleStrike().run()}
        >
          <Strikethrough />
        </ToolButton>
        <ToolButton
          label='Inline code'
          active={state.code}
          onClick={() => chain().toggleCode().run()}
        >
          <Code />
        </ToolButton>
        <ToolButton
          label='Subscript'
          active={state.subscript}
          onClick={() => chain().toggleSubscript().run()}
        >
          <Subscript />
        </ToolButton>
        <ToolButton
          label='Superscript'
          active={state.superscript}
          onClick={() => chain().toggleSuperscript().run()}
        >
          <Superscript />
        </ToolButton>
        <ToolPopover
          label='Text color'
          active={!!state.color}
          icon={<Baseline style={state.color ? { color: state.color } : {}} />}
        >
          {(close) => (
            <Swatches
              round
              colors={TEXT_COLORS}
              current={state.color}
              onPick={(value) => {
                chain().setColor(value).run()
                close()
              }}
              onClear={() => {
                chain().unsetColor().run()
                close()
              }}
            />
          )}
        </ToolPopover>
        <ToolPopover
          label='Highlight'
          active={state.isHighlighted}
          icon={<Highlighter />}
        >
          {(close) => (
            <Swatches
              colors={HIGHLIGHTS}
              current={state.highlight}
              onPick={(color) => {
                chain().setHighlight({ color }).run()
                close()
              }}
              onClear={() => {
                chain().unsetHighlight().run()
                close()
              }}
            />
          )}
        </ToolPopover>
        <ToolButton label='Link' active={state.link} onClick={onLink}>
          <Link2 />
        </ToolButton>
        <ToolButton
          label='Clear formatting'
          onClick={() => chain().unsetAllMarks().clearNodes().run()}
        >
          <RemoveFormatting />
        </ToolButton>
        <Divider />
        <ToolButton
          label='Align left'
          active={state.alignLeft}
          onClick={() => chain().setTextAlign('left').run()}
        >
          <AlignLeft />
        </ToolButton>
        <ToolButton
          label='Align center'
          active={state.alignCenter}
          onClick={() => chain().setTextAlign('center').run()}
        >
          <AlignCenter />
        </ToolButton>
        <ToolButton
          label='Align right'
          active={state.alignRight}
          onClick={() => chain().setTextAlign('right').run()}
        >
          <AlignRight />
        </ToolButton>
        <ToolButton
          label='Justify'
          active={state.alignJustify}
          onClick={() => chain().setTextAlign('justify').run()}
        >
          <AlignJustify />
        </ToolButton>
        <Divider />
        <ToolButton
          label='Bulleted list'
          active={state.bulletList}
          onClick={() => chain().toggleBulletList().run()}
        >
          <List />
        </ToolButton>
        <ToolButton
          label='Numbered list'
          active={state.orderedList}
          onClick={() => chain().toggleOrderedList().run()}
        >
          <ListOrdered />
        </ToolButton>
        <ToolButton
          label='Task list'
          active={state.taskList}
          onClick={() => chain().toggleTaskList().run()}
        >
          <ListChecks />
        </ToolButton>
        <ToolButton
          label='Quote'
          active={state.blockquote}
          onClick={() => chain().toggleBlockquote().run()}
        >
          <Quote />
        </ToolButton>
        <ToolButton
          label='Code block'
          active={state.codeBlock}
          onClick={() => chain().toggleCodeBlock().run()}
        >
          <Code2 />
        </ToolButton>
        <ToolButton
          label='Collapsible section'
          active={state.details}
          onClick={() =>
            state.details
              ? chain().unsetDetails().run()
              : chain().setDetails().run()
          }
        >
          <ChevronsDownUp />
        </ToolButton>
        <ToolButton
          label='Divider'
          onClick={() => chain().setHorizontalRule().run()}
        >
          <Minus />
        </ToolButton>
        <Divider />
        <ToolButton label='Image' onClick={onImage}>
          <ImagePlus />
        </ToolButton>
        <ToolButton
          label='Table'
          active={state.table}
          onClick={() =>
            chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <Table />
        </ToolButton>
        <ToolButton label='Embed video or audio' onClick={onEmbed}>
          <SquarePlay />
        </ToolButton>
        <ToolButton label='Inline math' onClick={() => onMath('inline')}>
          <Radical />
        </ToolButton>
        <ToolButton label='Math block' onClick={() => onMath('block')}>
          <Sigma />
        </ToolButton>
        <ToolPopover label='Emoji' icon={<Smile />}>
          {(close) => (
            <EmojiPicker
              onPick={(shortcode) => {
                chain().setEmoji(shortcode).run()
                close()
              }}
            />
          )}
        </ToolPopover>
        <ToolPopover
          label='Outline'
          icon={<ListTree />}
          active={outline.length > 0}
        >
          {(close) => (
            <nav aria-label='Outline' className='flex w-64 flex-col'>
              {outline.length === 0 && (
                <p className='text-muted-foreground px-2 py-1.5 text-xs'>
                  Add headings to build an outline.
                </p>
              )}
              {outline.map((entry) => (
                <button
                  key={entry.id}
                  type='button'
                  onClick={() => {
                    scrollToHeading(entry)
                    close()
                  }}
                  style={{ paddingLeft: `${(entry.level - 2) * 12 + 8}px` }}
                  className={cn(
                    'hover:bg-muted cursor-pointer truncate rounded-md py-1.5 pr-2 text-left text-sm',
                    entry.isActive && 'text-primary font-medium',
                  )}
                >
                  {entry.text || 'Untitled heading'}
                </button>
              ))}
            </nav>
          )}
        </ToolPopover>
      </div>
      {state.codeBlock && (
        <div className='flex items-center gap-2 border-t px-3 py-1'>
          <span className='text-muted-foreground text-xs'>Language</span>
          <ToolSelect
            label='Code language'
            value={state.language}
            options={LANGUAGES}
            onChange={(language) =>
              chain()
                .updateAttributes('codeBlock', { language: language || null })
                .run()
            }
          />
        </div>
      )}
      {state.table && <TableToolbar editor={editor} />}
    </div>
  )
}
