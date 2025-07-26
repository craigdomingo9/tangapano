import { getAuthToken } from "@/lib/auth/getToken";
import { axiosInstance } from "@/lib/services/api/config";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {

  const token = await getAuthToken();
  const listingId = context.params.id;

  const listing = await request.json();

  const res = await axiosInstance.patch(`/listings/landlord-listings/${listingId}/`, listing, {
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
  const listingId = await params.id;

  const res = await axiosInstance.delete(`/listings/landlord-listings/${listingId}/`, {
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