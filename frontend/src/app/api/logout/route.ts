import { axiosInstance } from '@/lib/services/api/config';
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies();
  
  const res = await axiosInstance.get('/users/auth/logout/', { 
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${cookieStore.get('auth_token')?.value}`,
      credentials: 'include',
    }
  });
  
  if (res.status >= 400) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 401 })
  }
  
  
  cookieStore.delete('auth_token')
  return NextResponse.json({ message: 'Logged out' })
}