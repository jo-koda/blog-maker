'use client'

import { KeyboardEvent, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { Field } from '@/components/ui/field'
import { Input, Select } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { createTag } from '@/actions/api-actions/tag-action'
import { categoryOptions } from '@/lib/blog/category-tree'
import Panel from '../_components/panel'
import { postEditorSlice } from '../_redux/post-editor-slice'

const actions = postEditorSlice.actions

function TagPicker() {
  const dispatch = useAppDispatch()
  const tags = useAppSelector((state) => state.postEditorState.tags)
  const tagIds = useAppSelector((state) => state.postEditorState.values.tagIds)
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)

  const selected = tags.filter((tag) => tagIds.includes(tag.id))
  const term = draft.trim().toLowerCase()
  const suggestions = term
    ? tags
        .filter(
          (tag) =>
            !tagIds.includes(tag.id) && tag.name.toLowerCase().includes(term),
        )
        .slice(0, 6)
    : []

  async function add() {
    if (!term || pending) return
    const match = tags.find((tag) => tag.name.toLowerCase() === term)
    if (match) {
      if (!tagIds.includes(match.id)) dispatch(actions.tagToggled(match.id))
      setDraft('')
      return
    }

    setPending(true)
    const result = await createTag({ values: { name: draft.trim() } })
    setPending(false)
    if (!result.data) {
      toast.error(result.message ?? 'Could not add tag.')
      return
    }
    dispatch(actions.tagCreated(result.data))
    setDraft('')
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      add()
    }
    if (event.key === 'Backspace' && !draft && selected.length > 0) {
      dispatch(actions.tagToggled(selected[selected.length - 1].id))
    }
  }

  return (
    <Field
      label='Tags'
      htmlFor='post-tags'
      hint='Press Enter to add. New tags are created as you type.'
    >
      {selected.length > 0 && (
        <div className='flex flex-wrap gap-1.5'>
          {selected.map((tag) => (
            <span
              key={tag.id}
              className='bg-accent text-primary inline-flex items-center gap-1 rounded-full py-0.5 pr-1 pl-2.5 text-xs font-medium'
            >
              {tag.name}
              <button
                type='button'
                aria-label={`Remove ${tag.name}`}
                onClick={() => dispatch(actions.tagToggled(tag.id))}
                className='hover:bg-primary/10 cursor-pointer rounded-full p-0.5'
              >
                <X className='size-3' />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        id='post-tags'
        value={draft}
        disabled={pending}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder='Add a tag'
      />
      {suggestions.length > 0 && (
        <div className='flex flex-wrap gap-1.5'>
          {suggestions.map((tag) => (
            <button
              key={tag.id}
              type='button'
              onClick={() => {
                dispatch(actions.tagToggled(tag.id))
                setDraft('')
              }}
              className='hover:bg-muted cursor-pointer rounded-full border px-2.5 py-0.5 text-xs'
            >
              + {tag.name}
            </button>
          ))}
        </div>
      )}
    </Field>
  )
}

export default function TaxonomyPanel() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.postEditorState.categories)
  const categoryId = useAppSelector(
    (state) => state.postEditorState.values.categoryId,
  )
  const options = useMemo(() => categoryOptions(categories), [categories])

  return (
    <Panel title='Category & tags'>
      <Field label='Category' htmlFor='post-category'>
        <Select
          id='post-category'
          value={categoryId ?? ''}
          onChange={(event) =>
            dispatch(
              actions.valueChanged({
                key: 'categoryId',
                value: event.target.value || null,
              }),
            )
          }
        >
          <option value=''>Uncategorized</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>
      <TagPicker />
    </Panel>
  )
}
