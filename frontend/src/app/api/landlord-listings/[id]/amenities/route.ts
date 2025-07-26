import { getAuthToken } from "@/lib/auth/getToken";
import { axiosInstance } from "@/lib/services/api/config";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {

  const token = await getAuthToken();
  const listingId = context.params.id;

  const { amenities } = await request.json();

  const res = await axiosInstance.patch(`/listings/landlord-listings/${listingId}/`, { amenity_ids: amenities }, {
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
