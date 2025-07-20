import { getAuthToken } from "@/lib/auth/getToken"
import { axiosInstance } from "@/lib/services/api/config"
import { NextResponse } from "next/server"



export async function GET() {
  const token = await getAuthToken();
  
  if (!token) {
    return NextResponse.json({ token: false }, { status: 401 })
  }

  const res = await axiosInstance.get('/listings/landlord-listings/', {
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
