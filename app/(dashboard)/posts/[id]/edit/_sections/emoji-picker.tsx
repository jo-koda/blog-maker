'use client'

import { useMemo, useState } from 'react'
import { emojis } from '@tiptap/extension-emoji'
import { Input } from '@/components/ui/input'

const FEATURED = [
  'smile',
  'joy',
  'heart_eyes',
  'wink',
  'sunglasses',
  'thinking',
  'partying_face',
  'cry',
  '+1',
  'clap',
  'raised_hands',
  'pray',
  'heart',
  'fire',
  'sparkles',
  'tada',
  'rocket',
  'star',
  'bulb',
  'zap',
  'white_check_mark',
  'x',
  'warning',
  'eyes',
  'coffee',
  'books',
  'memo',
  'pushpin',
  'computer',
  'gear',
  'bug',
  'lock',
  'chart_with_upwards_trend',
  'calendar',
  'trophy',
  'wave',
]

const LIMIT = 48

export default function EmojiPicker({
  onPick,
}: {
  onPick: (shortcode: string) => void
}) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const term = query.trim().toLowerCase().replace(/^:|:$/g, '')
    const available = emojis.filter((item) => item.emoji)
    if (!term) {
      return FEATURED.map((code) =>
        available.find((item) => item.shortcodes.includes(code)),
      ).filter((item) => item !== undefined)
    }
    return available
      .filter(
        (item) =>
          item.shortcodes.some((code) => code.includes(term)) ||
          item.tags?.some((tag) => tag.includes(term)),
      )
      .slice(0, LIMIT)
  }, [query])

  return (
    <div className='flex w-72 flex-col gap-2'>
      <Input
        autoFocus
        value={query}
        placeholder='Search emoji'
        aria-label='Search emoji'
        onChange={(event) => setQuery(event.target.value)}
        className='h-8 py-1'
      />
      <div className='grid max-h-56 grid-cols-8 gap-0.5 overflow-y-auto'>
        {results.map((item) => (
          <button
            key={item.name}
            type='button'
            title={`:${item.shortcodes[0]}:`}
            aria-label={item.name}
            onClick={() => onPick(item.shortcodes[0])}
            className='hover:bg-muted grid size-8 cursor-pointer place-items-center rounded-md text-lg'
          >
            {item.emoji}
          </button>
        ))}
        {results.length === 0 && (
          <p className='text-muted-foreground col-span-8 py-2 text-center text-xs'>
            No matches.
          </p>
        )}
      </div>
      <p className='text-muted-foreground text-xs'>
        Tip: type <code>:rocket:</code> while writing.
      </p>
    </div>
  )
}
