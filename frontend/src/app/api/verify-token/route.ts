import { axiosInstance } from '@/lib/services/api/config'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'


export async function GET() {
    const token = (await cookies()).get('auth_token')?.value

    if (!token) {
        return NextResponse.json({ token: false }, { status: 401 })
    }

    const res = await axiosInstance.get('/users/auth/verify-token/', {
        headers: {
            Authorization: `Token ${token}`,
        },
    })

    if (res.status >= 400) {
        return NextResponse.json({ token: false }, { status: 401 })
    }

    const data = res.data

    return NextResponse.json({ token: true, data })
}
