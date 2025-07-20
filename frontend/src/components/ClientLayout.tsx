// components/ClientLayout.tsx
'use client'

import { usePathname } from 'next/navigation'
import Header from './HomePage/Header'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <>
      {!isDashboard && <Header />}
      {children}
    </>
  )
}
