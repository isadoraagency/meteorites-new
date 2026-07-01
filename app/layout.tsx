import type { Metadata, Viewport } from "next";
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoryblokProvider>{children}</StoryblokProvider>
      </body>
    </html>
  );
}
