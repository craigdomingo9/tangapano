import { getAuthToken } from "@/lib/auth/getToken";
import { axiosInstance } from "@/lib/services/api/config";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const token = await getAuthToken();
  const formData = await request.formData();

  const imageFile = formData.get("image") as File;
  const caption = formData.get("caption") as string;
  const listingId = formData.get("listing") as string;

  if (!imageFile || !listingId) {
    return NextResponse.json({ error: "Missing image or listing" }, { status: 400 });
  }

  // Convert to Buffer
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadForm = new FormData();
  uploadForm.append("listing", listingId);
  uploadForm.append("caption", caption)
  uploadForm.append("image", new Blob([buffer]), imageFile.name); // Safe for modern environments

  const res = await axiosInstance.post(`/listings/listing-images/`, uploadForm, {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "multipart/form-data"
    },
  });

  if (res.status >= 400) {
    return NextResponse.json({ token: false }, { status: 401 });
  }

  return NextResponse.json({ token: true, data: res.data });
}
