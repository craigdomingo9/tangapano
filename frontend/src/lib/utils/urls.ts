import { headers } from "next/headers";

export async function getBaseUrl(): Promise<string> {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const xForwardedProto = headersList.get("x-forwarded-proto");

    // Use x-forwarded-proto if available, otherwise determine by environment
    const protocol =
      xForwardedProto?.split(",")[0]?.trim() ||
      (process.env.NODE_ENV === "production" ? "https" : "http");

    // Validate host
    if (!host) {
      throw new Error("Host header not available");
    }

    // Construct base URL
    // TODO: Change to https
    return `http://${host}`;
  } catch (error) {
    // Fallback to environment variable or default
    return (
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NODE_ENV === "production"
        ? // TODO: Change to https
          "http://tangapano.co.zw"
        : "http://localhost:3000")
    );
  }
}
