import { getAuthToken } from "@/lib/auth/getToken";
import { axiosInstance } from "@/lib/services/api/config";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const token = await getAuthToken();
  const user = await request.json();

  const res = await axiosInstance.patch('/users/me/', user, {
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


