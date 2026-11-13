'use client'

import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { store } from '@/store'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster
        position='bottom-center'
        offset={28}
        duration={2400}
        visibleToasts={1}
        toastOptions={{ unstyled: true, classNames: { toast: 'toast' } }}
      />
    </Provider>
  )
}
