'use client'

import { Editor, useEditorState } from '@tiptap/react'
import {
  BetweenHorizontalEnd,
  BetweenHorizontalStart,
  BetweenVerticalEnd,
  BetweenVerticalStart,
  Columns3,
  PanelLeft,
  PanelTop,
  Rows3,
  TableCellsMerge,
  TableCellsSplit,
  Trash2,
} from 'lucide-react'
import { Divider, ToolButton } from '../_components/tool-button'

export default function TableToolbar({ editor }: { editor: Editor }) {
  const can = useEditorState({
    editor,
    selector: ({ editor }) => ({
      merge: editor.can().mergeCells(),
      split: editor.can().splitCell(),
    }),
  })

  const chain = () => editor.chain().focus()

  return (
    <div
      role='toolbar'
      aria-label='Table'
      className='flex flex-wrap items-center gap-0.5 border-t px-3 py-1'
    >
      <span className='text-muted-foreground mr-1 text-xs'>Table</span>
      <ToolButton
        label='Insert row above'
        onClick={() => chain().addRowBefore().run()}
      >
        <BetweenHorizontalStart />
      </ToolButton>
      <ToolButton
        label='Insert row below'
        onClick={() => chain().addRowAfter().run()}
      >
        <BetweenHorizontalEnd />
      </ToolButton>
      <ToolButton label='Delete row' onClick={() => chain().deleteRow().run()}>
        <Rows3 />
      </ToolButton>
      <Divider />
      <ToolButton
        label='Insert column left'
        onClick={() => chain().addColumnBefore().run()}
      >
        <BetweenVerticalStart />
      </ToolButton>
      <ToolButton
        label='Insert column right'
        onClick={() => chain().addColumnAfter().run()}
      >
        <BetweenVerticalEnd />
      </ToolButton>
      <ToolButton
        label='Delete column'
        onClick={() => chain().deleteColumn().run()}
      >
        <Columns3 />
      </ToolButton>
      <Divider />
      <ToolButton
        label='Merge cells'
        disabled={!can.merge}
        onClick={() => chain().mergeCells().run()}
      >
        <TableCellsMerge />
      </ToolButton>
      <ToolButton
        label='Split cell'
        disabled={!can.split}
        onClick={() => chain().splitCell().run()}
      >
        <TableCellsSplit />
      </ToolButton>
      <ToolButton
        label='Toggle header row'
        onClick={() => chain().toggleHeaderRow().run()}
      >
        <PanelTop />
      </ToolButton>
      <ToolButton
        label='Toggle header column'
        onClick={() => chain().toggleHeaderColumn().run()}
      >
        <PanelLeft />
      </ToolButton>
      <Divider />
      <ToolButton
        label='Delete table'
        onClick={() => chain().deleteTable().run()}
      >
        <Trash2 />
      </ToolButton>
    </div>
  )
}
