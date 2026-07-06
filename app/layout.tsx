import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import StoryblokProvider from "../lib/StoryblokProvider";
import "../styles/main.scss";

export const metadata: Metadata = {
  title: "meteorites-landing",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const isStoryblokPreview = (await headers()).get("x-storyblok-preview") === "1";

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <StoryblokProvider
          previewAccessToken={
            isStoryblokPreview ? process.env.STORYBLOK_PREVIEW_TOKEN : undefined
          }
        >
          {children}
        </StoryblokProvider>
      </body>
    </html>
  );
}
