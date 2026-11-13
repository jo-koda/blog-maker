const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const TIME_FORMAT = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
})

export function formatDate(iso: string | null) {
  return iso ? DATE_FORMAT.format(new Date(iso)) : '—'
}

export function formatTime(iso: string | null) {
  return iso ? TIME_FORMAT.format(new Date(iso)) : ''
}

// <input type='datetime-local'> works in the browser's local time without a
// zone, so these convert to and from the UTC ISO strings the server stores.
export function toLocalInput(iso: string | null) {
  if (!iso) return ''
  const date = new Date(iso)
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export function fromLocalInput(value: string) {
  return value ? new Date(value).toISOString() : null
}
