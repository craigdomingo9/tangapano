import { getAuthToken } from "@/lib/auth/getToken";
import { axiosInstance } from "@/lib/services/api/config";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ token: false }, { status: 401 });
  }

  const res = await axiosInstance.get("/listings/landlord-listings/", {
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

export async function POST(request: Request) {
  const token = await getAuthToken();
  const listing = await request.json();

  console.log(listing);
  const res = await axiosInstance.post(
    "/listings/landlord-listings/",
    listing,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );

  if (res.status >= 400) {
    return NextResponse.json({ token: false }, { status: 401 });
  }

  const data = res.data;

  return NextResponse.json(data);
}
