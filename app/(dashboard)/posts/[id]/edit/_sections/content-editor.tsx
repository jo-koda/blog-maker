'use client'

import { useState } from 'react'
import type { AnyExtension, Editor } from '@tiptap/core'
import FileHandler from '@tiptap/extension-file-handler'
import InvisibleCharacters from '@tiptap/extension-invisible-characters'
import NodeRange from '@tiptap/extension-node-range'
import Placeholder from '@tiptap/extension-placeholder'
import type { TableOfContentData } from '@tiptap/extension-table-of-contents'
import { CharacterCount, Focus, Selection } from '@tiptap/extensions'
import { EditorContent, useEditor } from '@tiptap/react'
import { toast } from 'sonner'
import { useAppDispatch, useAppStore } from '@/hooks/hooks'
import { blogExtensions } from '@/lib/blog/extensions'
import { postEditorSlice } from '../_redux/post-editor-slice'
import {
  IMAGE_ACCEPT,
  altFromFileName,
  useImageUpload,
} from '../_components/use-image-upload'
import EditorFooter from './editor-footer'
import EditorMenus from './editor-menus'
import EditorToolbar, { MathMode, OutlineEntry } from './editor-toolbar'
import EmbedDialog from './embed-dialog'
import ImageDialog from './image-dialog'
import LinkDialog from './link-dialog'
import MathDialog, { MathTarget } from './math-dialog'

type Dialog = 'link' | 'image' | 'embed' | null

export default function ContentEditor() {
  const dispatch = useAppDispatch()
  const store = useAppStore()
  const upload = useImageUpload()
  const [dialog, setDialog] = useState<Dialog>(null)
  const [math, setMath] = useState<MathTarget | null>(null)
  const [outline, setOutline] = useState<OutlineEntry[]>([])

  async function insertFiles(editor: Editor, files: File[], pos: number) {
    for (const file of files) {
      const loading = toast.loading(`Uploading ${file.name}…`)
      const alt = altFromFileName(file.name)
      const src = await upload(file, alt)
      toast.dismiss(loading)
      if (!src) continue
      editor
        .chain()
        .insertContentAt(pos, { type: 'image', attrs: { src, alt } })
        .focus()
        .run()
    }
  }

  function withEditorCallbacks(extension: AnyExtension) {
    if (extension.name === 'inlineMath' || extension.name === 'blockMath') {
      const mode: MathMode =
        extension.name === 'inlineMath' ? 'inline' : 'block'
      return extension.configure({
        onClick: (node: { attrs: { latex: string } }, pos: number) =>
          setMath({ mode, latex: node.attrs.latex, pos }),
      })
    }
    if (extension.name === 'tableOfContents') {
      return extension.configure({
        onUpdate: (content: TableOfContentData) =>
          setOutline(
            content.map((item) => ({
              id: item.id,
              level: item.originalLevel,
              text: item.textContent,
              pos: item.pos,
              isActive: item.isActive,
            })),
          ),
      })
    }
    return extension
  }

  const editor = useEditor({
    extensions: [
      ...blogExtensions.map(withEditorCallbacks),
      Placeholder.configure({ placeholder: 'Start writing your post…' }),
      CharacterCount,
      Focus.configure({ mode: 'deepest' }),
      Selection,
      NodeRange,
      InvisibleCharacters.configure({ visible: false }),
      FileHandler.configure({
        allowedMimeTypes: IMAGE_ACCEPT.split(','),
        onDrop: (editor, files, pos) => insertFiles(editor, files, pos),
        onPaste: (editor, files, htmlContent) => {
          if (htmlContent) return
          insertFiles(editor, files, editor.state.selection.anchor)
        },
      }),
    ],
    content: store.getState().postEditorState.values.contentJson,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-lg prose-headings:font-sans prose-headings:font-semibold max-w-none font-serif px-6 py-5 md:px-10',
        'aria-label': 'Post content',
      },
    },
    onUpdate: ({ editor }) => {
      dispatch(
        postEditorSlice.actions.valueChanged({
          key: 'contentJson',
          value: editor.getJSON(),
        }),
      )
    },
  })

  if (!editor) {
    return <div className='min-h-[480px]' />
  }

  return (
    <>
      <EditorToolbar
        editor={editor}
        outline={outline}
        onLink={() => setDialog('link')}
        onImage={() => setDialog('image')}
        onEmbed={() => setDialog('embed')}
        onMath={(mode) => setMath({ mode, latex: '', pos: null })}
      />
      <div className='relative'>
        <EditorContent editor={editor} />
        <EditorMenus
          editor={editor}
          onLink={() => setDialog('link')}
          onImage={() => setDialog('image')}
        />
      </div>
      <EditorFooter editor={editor} />
      <LinkDialog
        editor={editor}
        open={dialog === 'link'}
        onClose={() => setDialog(null)}
      />
      <ImageDialog
        editor={editor}
        open={dialog === 'image'}
        onClose={() => setDialog(null)}
      />
      <EmbedDialog
        editor={editor}
        open={dialog === 'embed'}
        onClose={() => setDialog(null)}
      />
      <MathDialog editor={editor} target={math} onClose={() => setMath(null)} />
    </>
  )
}
