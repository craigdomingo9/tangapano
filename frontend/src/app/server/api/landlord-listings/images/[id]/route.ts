import { getAuthToken } from "@/lib/auth/getToken";
import { axiosInstance } from "@/lib/services/api/config";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getAuthToken();
  const { id: imageId } = await params;

  const image = await request.json();

  const res = await axiosInstance.patch(
    `/listings/listing-images/${imageId}/`,
    image,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (res.status >= 400) {
    return NextResponse.json({ token: false }, { status: 401 });
  }

  const data = res.data;

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getAuthToken();
  const { id: imageId } = await params;

  const res = await axiosInstance.delete(
    `/listings/listing-images/${imageId}/`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (res.status >= 400) {
    return NextResponse.json({ token: false }, { status: 401 });
  }

  const data = res.data;

  return NextResponse.json(data);
}
