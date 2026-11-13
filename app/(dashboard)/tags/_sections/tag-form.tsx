'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAppDispatch } from '@/hooks/hooks'
import { submitCreateTag } from '@/actions/submit-actions/term-submit-action'
import { tagsSlice } from '../_redux/tags-slice'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Adding…' : 'Add tag'}
    </Button>
  )
}

export default function TagForm() {
  const dispatch = useAppDispatch()
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, formAction] = useActionState(submitCreateTag, null)
  const errors = formState?.errors ?? {}

  useEffect(() => {
    if (!formState) return
    if (formState.data) {
      dispatch(tagsSlice.actions.tagAdded(formState.data))
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
      <h2 className='text-sm font-semibold'>New tag</h2>
      <Field label='Name' htmlFor='tag-name' error={errors.name}>
        <Input id='tag-name' name='name' aria-invalid={!!errors.name} />
      </Field>
      <Field
        label='Slug'
        htmlFor='tag-slug'
        error={errors.slug}
        hint='Leave empty to generate it from the name.'
      >
        <Input id='tag-slug' name='slug' aria-invalid={!!errors.slug} />
      </Field>
      <SubmitButton />
    </form>
  )
}
