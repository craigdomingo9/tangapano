import { getAuthToken } from '@/lib/auth/getToken'
import { NextResponse } from 'next/server'

export async function GET() {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/auth/verify-token/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const data = await res.json()
  return NextResponse.json({ message: 'Authenticated', user: data })
}
