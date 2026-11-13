'use client'

import { Field } from '@/components/ui/field'
import { Input, Textarea } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import Panel from '../_components/panel'
import { postEditorSlice } from '../_redux/post-editor-slice'

const actions = postEditorSlice.actions

export default function SeoPanel() {
  const dispatch = useAppDispatch()
  const values = useAppSelector((state) => state.postEditorState.values)
  const errors = useAppSelector((state) => state.postEditorState.errors)

  const title = values.seoTitle || values.title || 'Untitled'
  const description =
    values.seoDescription || values.excerpt || 'Add a description…'

  return (
    <Panel title='SEO' defaultOpen={false}>
      <div className='bg-muted/60 rounded-lg p-3'>
        <p className='text-muted-foreground truncate text-xs'>
          yourdomain.com › blog › {values.slug || 'post'}
        </p>
        <p className='truncate text-[15px] text-[#1a0dab]'>{title}</p>
        <p className='text-muted-foreground line-clamp-2 text-xs'>
          {description}
        </p>
      </div>
      <Field
        label='SEO title'
        htmlFor='post-seo-title'
        error={errors.seoTitle}
        hint={`${values.seoTitle.length}/70 · Defaults to the post title.`}
      >
        <Input
          id='post-seo-title'
          value={values.seoTitle}
          placeholder={values.title}
          aria-invalid={!!errors.seoTitle}
          onChange={(event) =>
            dispatch(
              actions.valueChanged({
                key: 'seoTitle',
                value: event.target.value,
              }),
            )
          }
        />
      </Field>
      <Field
        label='Meta description'
        htmlFor='post-seo-description'
        error={errors.seoDescription}
        hint={`${values.seoDescription.length}/160 · Defaults to the excerpt.`}
      >
        <Textarea
          id='post-seo-description'
          rows={3}
          value={values.seoDescription}
          placeholder={values.excerpt}
          aria-invalid={!!errors.seoDescription}
          onChange={(event) =>
            dispatch(
              actions.valueChanged({
                key: 'seoDescription',
                value: event.target.value,
              }),
            )
          }
        />
      </Field>
      <Field
        label='Canonical URL'
        htmlFor='post-canonical'
        error={errors.canonicalUrl}
        hint='Only set this when the post first appeared elsewhere.'
      >
        <Input
          id='post-canonical'
          value={values.canonicalUrl}
          placeholder='https://…'
          aria-invalid={!!errors.canonicalUrl}
          onChange={(event) =>
            dispatch(
              actions.valueChanged({
                key: 'canonicalUrl',
                value: event.target.value.trim(),
              }),
            )
          }
        />
      </Field>
    </Panel>
  )
}
