import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react/rsc";
import type { MenuContent } from "../types/content";
import {
  getBackgroundBlurPx,
  getBackgroundGradientFromConfig,
  getHeroBlock,
  getHeroTextPair,
  getMeteoritesFromStory,
  getEmptyMenuContent,
  getScrollProgressGradientFromConfig,
  getStoryblokAssetAlt,
  getStoryblokAssetUrl,
  getStoryblokRichTextPlain,
  mapMeteoriteBlockToMeteorite,
  mapMenuStoryToContent,
  storyblokRichTextToHtml,
} from "./storyblok-utils";

// True everywhere except real production: Vercel preview deployments run with
// NODE_ENV=production, so NODE_ENV alone can't tell QA previews apart —
// VERCEL_ENV ("production" | "preview" | "development") is the reliable signal
// there, with NODE_ENV as the fallback for local/non-Vercel environments.
export const isPreviewEnvironment = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV !== "production"
  : process.env.NODE_ENV !== "production";

// Initialize the Storyblok SDK once at module load. The token is read
// server-side only (no NEXT_PUBLIC_ prefix), so it never reaches the browser.
storyblokInit({
  accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,
  use: [apiPlugin],
  apiOptions: { region: "eu" }, // Space region — switch to "us" if it ever moves
});

/**
 * Fetches the "menu" story from Storyblok and maps it into MenuContent.
 * Returns empty content (with console warnings) if the story is missing or the request fails.
 */
export async function getMenuContent(preview = false): Promise<MenuContent> {
  try {
    const { data } = await getStoryblokApi().get("cdn/stories/menu", {
      version: preview || isPreviewEnvironment ? "draft" : "published",
      cv: preview ? Date.now() : undefined,
    });
    return mapMenuStoryToContent(data.story);
  } catch (err) {
    const status = (err as { status?: number })?.status;
    console.error(
      `[storyblok] menu fetch failed (${status ?? "error"}), returning empty menu content`
    );
    return getEmptyMenuContent();
  }
}

/**
 * Fetches a story by slug. Uses draft in dev/preview and published in production.
 */
export async function getStoryStoryblok(slug: string, preview = false) {
  try {
    const { data } = await getStoryblokApi().get(`cdn/stories/${slug}`, {
      version: preview || isPreviewEnvironment ? "draft" : "published",
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
  getMeteoritesFromStory,
  getScrollProgressGradientFromConfig,
  getStoryblokAssetAlt,
  getStoryblokAssetUrl,
  getStoryblokRichTextPlain,
  mapMeteoriteBlockToMeteorite,
  storyblokRichTextToHtml,
};
