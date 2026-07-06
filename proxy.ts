import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isStoryblokPreview =
    request.nextUrl.searchParams.has("_storyblok") ||
    request.nextUrl.searchParams.has("_storyblok_tk");

  if (!isStoryblokPreview) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.headers.set("x-storyblok-preview", "1");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
