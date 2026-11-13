import { ReactNode } from 'react'
import Providers from './_sections/providers'
import SideBar from './_sections/side-bar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className='flex min-h-screen flex-col md:flex-row'>
        <SideBar />
        <main className='min-w-0 flex-1 px-4 py-6 md:px-8'>{children}</main>
      </div>
    </Providers>
  )
}
