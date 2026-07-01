"use client";

import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";
import type { ReactNode } from "react";

// Client-side init. This is what loads the Storyblok Bridge into the browser
// so the Visual Editor can highlight blocks and push live updates. The
// `NEXT_PUBLIC_` token is safe to expose — it's the preview token, same value
// as the server side but readable in the browser (required by the bridge).
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
  use: [apiPlugin],
  apiOptions: { region: "eu" },
});

export default function StoryblokProvider({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
