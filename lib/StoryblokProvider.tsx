"use client";

import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";
import { useEffect, type ReactNode } from "react";

let bridgeInitialized = false;

// Loads the Storyblok Bridge only when the server passes a preview token
// (Visual Editor iframe with ?_storyblok). Regular visitors never receive it.
export default function StoryblokProvider({
  children,
  previewAccessToken,
}: {
  children: ReactNode;
  previewAccessToken?: string;
}) {
  useEffect(() => {
    if (!previewAccessToken || bridgeInitialized) return;

    storyblokInit({
      accessToken: previewAccessToken,
      use: [apiPlugin],
      apiOptions: { region: "eu" },
    });
    bridgeInitialized = true;
  }, [previewAccessToken]);

  return children;
}
