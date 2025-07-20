import { getAuthToken } from "@/lib/auth/getToken";
import { axiosInstance } from "@/lib/services/api/config";
import { NextResponse } from "next/server";


export async function PATCH( request: Request, { params }: { params: { id: string } } ) {
  const token = await getAuthToken();
  const roomId = await params.id;
  const room = await request.json();

  const res = await axiosInstance.patch(`/listings/rooms/${roomId}/`, room, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (res.status >= 400) {
    return NextResponse.json({ token: false }, { status: 401 })
  }

  const data = res.data

  return NextResponse.json(data)
}

export async function DELETE( request: Request, { params }: { params: { id: string } } ) {
  const token = await getAuthToken();
  const roomId = await params.id;

  const res = await axiosInstance.delete(`/listings/rooms/${roomId}/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (res.status >= 400) {
    return NextResponse.json({ token: false }, { status: 401 })
  }

  const data = res.data

  return NextResponse.json(data)
}

