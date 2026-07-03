import type {
  GradientBlock,
  HeroSectionBlock,
  HeroTextBlock,
  SiteGlobalConfigurationsBlock,
  StoryblokAsset,
  StoryblokRichText,
  StoryblokRichTextNode,
  StoryblokStory,
} from "../types/storyblok";

export const EMPTY_GRADIENT = {
  degrees: 0,
  startColor: "#ffffff",
  middleColor: "#ffffff",
  middleStop: 50,
  endColor: "#ffffff",
} as const;

export interface GradientParams {
  degrees: number;
  startColor: string;
  middleColor: string;
  middleStop: number;
  endColor: string;
}

export function buildLinearGradientCss(params: GradientParams): string {
  return `linear-gradient(${params.degrees}deg, ${params.startColor} 0%, ${params.middleColor} ${params.middleStop}%, ${params.endColor} 100%)`;
}

export function getGradientParams(
  block?: GradientBlock | null
): GradientParams {
  if (!block) return { ...EMPTY_GRADIENT };

  const degrees = Number(block.Degrees);
  return {
    degrees: Number.isFinite(degrees) ? degrees : 0,
    startColor: block.startColor?.trim() || "#ffffff",
    middleColor: block.middleColor?.trim() || "#ffffff",
    middleStop: 49,
    endColor: block.endColor?.trim() || "#ffffff",
  };
}

export function getBackgroundGradientFromConfig(
  config?: SiteGlobalConfigurationsBlock | null
): string {
  return buildLinearGradientCss(
    getGradientParams(config?.backgroundGradient?.[0])
  );
}

export function getScrollProgressGradientFromConfig(
  config?: SiteGlobalConfigurationsBlock | null
): string {
  return buildLinearGradientCss({
    ...getGradientParams(config?.backgroundGradient?.[0]),
    degrees: 90,
  });
}

export function getStoryblokRichTextPlain(
  value?: StoryblokRichText | StoryblokRichTextNode | string | null
): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (value.type === "text" && "text" in value && value.text) return value.text;

  if (Array.isArray(value.content)) {
    return value.content.map((node) => getStoryblokRichTextPlain(node)).join("");
  }

  return "";
}

export function getHeroTextPair(
  blocks: HeroTextBlock[] | undefined | null
): [string, string] {
  if (!blocks || blocks.length < 2) return ["", ""];

  const texts = blocks
    .slice(0, 2)
    .map((block) => getStoryblokRichTextPlain(block.text).trim());

  if (texts.some((text) => !text)) return ["", ""];

  return [texts[0], texts[1]];
}

export function getBackgroundBlurPx(
  value?: number | string | null
): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function getStoryblokAssetUrl(
  asset?: StoryblokAsset | null
): string {
  if (!asset?.filename) return "";
  return asset.filename;
}

export function getStoryblokAssetAlt(
  asset?: StoryblokAsset | null
): string | undefined {
  const alt = asset?.alt?.trim();
  return alt || undefined;
}

export function getHeroBlock(
  story: StoryblokStory | null | undefined
): HeroSectionBlock | null {
  return (
    story?.content?.body?.find((block) => block.component === "hero-section") ?? null
  );
}
