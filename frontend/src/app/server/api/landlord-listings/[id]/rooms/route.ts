import { getAuthToken } from "@/lib/auth/getToken";
import { axiosInstance } from "@/lib/services/api/config";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ token: false }, { status: 401 });
  }

  const { id: listingId } = await params;

  const res = await axiosInstance.get(`/listings/rooms/?listing=${listingId}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (res.status >= 400) {
    return NextResponse.json({ token: false }, { status: 401 });
  }

  const data = res.data;

  return NextResponse.json(data);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getAuthToken();
  const { id: listingId } = await params;
  const room = await request.json();
  const postData = { ...room, listing: listingId };

  const res = await axiosInstance.post(`/listings/rooms/`, postData, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (res.status >= 400) {
    return NextResponse.json({ token: false }, { status: 401 });
  }

  const data = res.data;

  return NextResponse.json({ token: true, data });
}
