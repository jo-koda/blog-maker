'use client'

import DragHandle from '@tiptap/extension-drag-handle-react'
import { Editor, useEditorState } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import {
  Bold,
  Code,
  Code2,
  GripVertical,
  Heading2,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListChecks,
  Strikethrough,
  Table,
  Underline,
} from 'lucide-react'
import { ToolButton } from '../_components/tool-button'

const menuClass =
  'bg-card flex items-center gap-0.5 rounded-lg border p-1 shadow-lg'

export default function EditorMenus({
  editor,
  onLink,
  onImage,
}: {
  editor: Editor
  onLink: () => void
  onImage: () => void
}) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
      strike: editor.isActive('strike'),
      code: editor.isActive('code'),
      highlight: editor.isActive('highlight'),
      link: editor.isActive('link'),
    }),
  })

  const chain = () => editor.chain().focus()

  return (
    <>
      <BubbleMenu
        editor={editor}
        options={{ placement: 'top', offset: 8 }}
        shouldShow={({ editor, state, from, to }) =>
          from !== to &&
          editor.isEditable &&
          !editor.isActive('codeBlock') &&
          !editor.isActive('image') &&
          state.doc.textBetween(from, to).trim().length > 0
        }
        className={menuClass}
      >
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
          label='Highlight'
          active={state.highlight}
          onClick={() => chain().toggleHighlight({ color: '#fef08a' }).run()}
        >
          <Highlighter />
        </ToolButton>
        <ToolButton label='Link' active={state.link} onClick={onLink}>
          <Link2 />
        </ToolButton>
      </BubbleMenu>

      <FloatingMenu
        editor={editor}
        options={{ placement: 'bottom-start', offset: 6 }}
        className={menuClass}
      >
        <ToolButton
          label='Heading 2'
          onClick={() => chain().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 />
        </ToolButton>
        <ToolButton
          label='Bulleted list'
          onClick={() => chain().toggleBulletList().run()}
        >
          <List />
        </ToolButton>
        <ToolButton
          label='Task list'
          onClick={() => chain().toggleTaskList().run()}
        >
          <ListChecks />
        </ToolButton>
        <ToolButton
          label='Code block'
          onClick={() => chain().toggleCodeBlock().run()}
        >
          <Code2 />
        </ToolButton>
        <ToolButton label='Image' onClick={onImage}>
          <ImagePlus />
        </ToolButton>
        <ToolButton
          label='Table'
          onClick={() =>
            chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <Table />
        </ToolButton>
      </FloatingMenu>

      <DragHandle editor={editor}>
        <span
          title='Drag to move'
          className='text-muted-foreground hover:bg-muted grid h-6 w-5 cursor-grab place-items-center rounded active:cursor-grabbing'
        >
          <GripVertical className='size-4' />
        </span>
      </DragHandle>
    </>
  )
}
