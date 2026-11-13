'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input, Select, Textarea } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { submitCreateCategory } from '@/actions/submit-actions/term-submit-action'
import { categoryOptions } from '@/lib/blog/category-tree'
import { categoriesSlice } from '../_redux/categories-slice'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Adding…' : 'Add category'}
    </Button>
  )
}

export default function CategoryForm() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.categoriesState.categories)
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, formAction] = useActionState(submitCreateCategory, null)
  const errors = formState?.errors ?? {}

  useEffect(() => {
    if (!formState) return
    if (formState.data) {
      dispatch(categoriesSlice.actions.categoryAdded(formState.data))
      formRef.current?.reset()
      toast.success(`Added ${formState.data.name}.`)
    } else if (formState.message && !formState.errors) {
      toast.error(formState.message)
    }
  }, [formState, dispatch])

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className='bg-card flex flex-col gap-4 rounded-xl border p-4'
    >
      <h2 className='text-sm font-semibold'>New category</h2>
      <Field label='Name' htmlFor='category-name' error={errors.name}>
        <Input id='category-name' name='name' aria-invalid={!!errors.name} />
      </Field>
      <Field
        label='Slug'
        htmlFor='category-slug'
        error={errors.slug}
        hint='Leave empty to generate it from the name.'
      >
        <Input id='category-slug' name='slug' aria-invalid={!!errors.slug} />
      </Field>
      <Field label='Parent' htmlFor='category-parent'>
        <Select id='category-parent' name='parentId' defaultValue=''>
          <option value=''>None</option>
          {categoryOptions(categories).map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label='Description' htmlFor='category-description'>
        <Textarea id='category-description' name='description' rows={3} />
      </Field>
      <SubmitButton />
    </form>
  )
}
