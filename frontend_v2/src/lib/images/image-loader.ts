"use client";

interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function myImageLoader({
  src,
  width,
  quality,
}: ImageLoaderParams) {
  // 1. Use an environment variable (fallback to localhost for dev safety)
  // We remove any trailing slash from the domain to keep logic clean
  const backendUrl = (
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
  ).replace(/\/$/, "");

  // 2. Ensure src always starts with a slash
  const cleanSrc = src.startsWith("/") ? src : `/${src}`;

  // 3. Return the full URL with optimization params
  // Even if your backend ignores '?w=800', passing them is standard practice
  // to avoid cache collisions and allow for future optimization support.
  return `${backendUrl}${cleanSrc}?w=${width}&q=${quality || 75}`;
}
