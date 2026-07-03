import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react/rsc";
import type { MenuData, MenuLink } from "../types/content";
import {
  getBackgroundBlurPx,
  getBackgroundGradientFromConfig,
  getHeroBlock,
  getHeroTextPair,
  getScrollProgressGradientFromConfig,
  getStoryblokAssetAlt,
  getStoryblokAssetUrl,
  getStoryblokRichTextPlain,
} from "./storyblok-utils";
// Static fallback so the app never breaks if the Storyblok story doesn't
// exist yet (or the API is unreachable). This is the same data the app used
// to fetch client-side from /data/menu.json.
import menuFallback from "../public/data/menu.json";

// Initialize the Storyblok SDK once at module load. The token is read
// server-side only (no NEXT_PUBLIC_ prefix), so it never reaches the browser.
storyblokInit({
  accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,
  use: [apiPlugin],
  apiOptions: { region: "eu" }, // Space region — switch to "us" if it ever moves
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapLinks = (blocks: any[] = []): MenuLink[] =>
  blocks.map((b) => ({ title: b.title, action: b.action }));

/**
 * Fetches the "menu" story from Storyblok and maps it back into the existing
 * MenuData shape the <Menu> component already expects. Falls back to the local
 * JSON if the story isn't published yet or the request fails.
 */
export async function getMenu(): Promise<MenuData> {
  try {
    const { data } = await getStoryblokApi().get("cdn/stories/menu", {
      version: "draft", // use "published" in production with the public token
    });
    const content = data.story.content;
    return [{ large: mapLinks(content.large), small: mapLinks(content.small) }];
  } catch (err) {
    // Concise log — the full Storyblok error object is very noisy. A 404 here
    // just means the "menu" story hasn't been created/published yet.
    const status = (err as { status?: number })?.status;
    console.warn(
      `[storyblok] menu fetch failed (${status ?? "error"}), using JSON fallback`
    );
    return menuFallback as MenuData;
  }
}

/**
 * Fetches a story by slug. Uses draft in dev/preview and published in production.
 */
export async function getStoryStoryblok(slug: string, preview = false) {
  try {
    const { data } = await getStoryblokApi().get(`cdn/stories/${slug}`, {
      version:
        preview || process.env.NODE_ENV !== "production" ? "draft" : "published",
      cv: preview ? Date.now() : undefined,
    });
    return data.story;
  } catch (err) {
    const status = (err as { status?: number })?.status;
    console.warn(
      `[storyblok] story "${slug}" fetch failed (${status ?? "error"})`
    );
    return null;
  }
}

export {
  getBackgroundBlurPx,
  getBackgroundGradientFromConfig,
  getHeroBlock,
  getHeroTextPair,
  getScrollProgressGradientFromConfig,
  getStoryblokAssetAlt,
  getStoryblokAssetUrl,
  getStoryblokRichTextPlain,
};
