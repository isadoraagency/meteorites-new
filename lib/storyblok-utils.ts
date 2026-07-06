import type { Meteorite, MeteoriteType } from "../types/content";
import type {
  GradientBlock,
  HeroSectionBlock,
  HeroTextBlock,
  MeteoriteBlock,
  MeteoriteTypeBlock,
  SiteGlobalConfigurationsBlock,
  StoryblokAsset,
  StoryblokRichText,
  StoryblokRichTextMark,
  StoryblokRichTextNode,
  StardustCreatorBlock,
  StardustSectionBlock,
  StoryblokStory,
  TypeMeteoritesSectionBlock,
} from "../types/storyblok";
import meteoritesFallback from "../public/data/meteorites.json";

export interface TypeMeteoritesSectionContent {
  title: string;
  description: string;
  items: MeteoriteType[];
}

export interface StardustCreatorContent {
  uid?: string;
  name: string;
  sceneUrl: string;
  tooltip: string;
}

export interface StardustSectionContent {
  quote: string;
  quoteAttribution: string;
  creatorsIntro: string;
  creators: StardustCreatorContent[];
  buttonLabel: string;
}

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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function applyRichTextMarks(
  text: string,
  marks?: StoryblokRichTextMark[]
): string {
  if (!marks?.length) return text;

  return marks.reduce((result, mark) => {
    switch (mark.type) {
      case "bold":
        return `<strong>${result}</strong>`;
      case "italic":
        return `<em>${result}</em>`;
      case "underline":
        return `<u>${result}</u>`;
      case "strike":
        return `<s>${result}</s>`;
      case "code":
        return `<code>${result}</code>`;
      default:
        return result;
    }
  }, text);
}

function renderRichTextNode(
  node: StoryblokRichTextNode,
  inline = false
): string {
  if (node.type === "text") {
    const text = escapeHtml(node.text ?? "");
    return applyRichTextMarks(text, node.marks);
  }

  if (node.type === "hard_break") return "<br/>";

  if (node.type === "paragraph") {
    const inner = node.content?.map((child) => renderRichTextNode(child, inline)).join("") ?? "";
    return inline ? inner : `<p>${inner}</p>`;
  }

  if (Array.isArray(node.content)) {
    return node.content.map((child) => renderRichTextNode(child, inline)).join("");
  }

  return "";
}

function richTextToHtml(
  value: StoryblokRichText | StoryblokRichTextNode | string | null | undefined,
  inline = false
): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (value.type === "doc" && Array.isArray(value.content)) {
    if (inline) {
      return value.content
        .map((node) => renderRichTextNode(node, true))
        .filter(Boolean)
        .join("<br/>");
    }
    return value.content.map((node) => renderRichTextNode(node)).join("");
  }

  return renderRichTextNode(value, inline);
}

export function storyblokRichTextToHtml(
  value?: StoryblokRichText | StoryblokRichTextNode | string | null
): string {
  return richTextToHtml(value);
}

export function storyblokRichTextToInlineHtml(
  value?: StoryblokRichText | StoryblokRichTextNode | string | null
): string {
  return richTextToHtml(value, true);
}

export function slugifyMeteoriteTitle(title: string): string {
  const normalized = title.trim().toLowerCase();
  if (normalized.startsWith("the ")) {
    return `the-${normalized.slice(4).replace(/\s+/g, "-")}`;
  }
  return normalized.replace(/\s+/g, "-");
}

function normalizeFoundDate(value?: string): string {
  if (!value) return "";
  return value.split(" ")[0] ?? value;
}

export function getMeteoriteBlocks(
  story: StoryblokStory | null | undefined
): MeteoriteBlock[] {
  return (
    story?.content?.body?.filter(
      (block): block is MeteoriteBlock => block.component === "meteorite"
    ) ?? []
  );
}

export function mapMeteoriteBlockToMeteorite(block: MeteoriteBlock): Meteorite {
  const videoFallBlock = block.videoFall?.[0];
  const videoFallSrc = getStoryblokAssetUrl(videoFallBlock?.video);

  return {
    title: block.title?.trim() ?? "",
    slug:
      block.slug?.trim() ||
      slugifyMeteoriteTitle(block.title?.trim() ?? ""),
    about: storyblokRichTextToHtml(block.about),
    short: storyblokRichTextToHtml(block.short),
    old: storyblokRichTextToInlineHtml(block.old),
    image: getStoryblokAssetUrl(block.image),
    shadow: getStoryblokAssetUrl(block.shadow),
    video: getStoryblokAssetUrl(block.video),
    fallDate: block.fallDate?.trim() ?? "",
    fallPlace: block.fallPlace?.trim() ?? "",
    composition: (block.composition ?? [])
      .map((item) => item.name?.trim() ?? "")
      .filter(Boolean),
    type: block.type?.trim() ?? "",
    class: block.meteoriteClass?.trim() ?? "",
    observedFall: Boolean(block.observedFall),
    videoFall: videoFallSrc
      ? {
          description: videoFallBlock?.description?.trim() ?? "",
          source: videoFallBlock?.source?.trim() ?? "",
          src: videoFallSrc,
        }
      : undefined,
    foundDate: normalizeFoundDate(block.foundDate),
  };
}

export function getMeteoritesFromStory(
  story: StoryblokStory | null | undefined
): Meteorite[] {
  const blocks = getMeteoriteBlocks(story);
  if (!blocks.length) return meteoritesFallback as Meteorite[];
  return blocks.map(mapMeteoriteBlockToMeteorite);
}

export function getTypeMeteoritesBlock(
  story: StoryblokStory | null | undefined
): TypeMeteoritesSectionBlock | null {
  return (
    story?.content?.body?.find(
      (block): block is TypeMeteoritesSectionBlock =>
        block.component === "type-meteorites-section"
    ) ?? null
  );
}

export function mapMeteoriteTypeBlockToMeteoriteType(
  block: MeteoriteTypeBlock,
  index: number
): MeteoriteType {
  return {
    id: index + 1,
    uid: block._uid,
    name: block.name?.trim() ?? "",
    type: block.subtype?.trim() ?? "",
    description: storyblokRichTextToHtml(block.description),
    image: getStoryblokAssetUrl(block.image),
  };
}

export function getTypeMeteoritesSectionFromStory(
  story: StoryblokStory | null | undefined
): TypeMeteoritesSectionContent | null {
  const block = getTypeMeteoritesBlock(story);
  if (!block) return null;

  return {
    title: block.title?.trim() ?? "",
    description: storyblokRichTextToHtml(block.description),
    items: (block.items ?? []).map(mapMeteoriteTypeBlockToMeteoriteType),
  };
}

export function getStardustBlock(
  story: StoryblokStory | null | undefined
): StardustSectionBlock | null {
  return (
    story?.content?.body?.find(
      (block): block is StardustSectionBlock =>
        block.component === "stardust-section"
    ) ?? null
  );
}

export function mapStardustCreatorBlockToContent(
  block: StardustCreatorBlock
): StardustCreatorContent | null {
  const sceneUrl = block.sceneUrl?.trim() ?? "";
  if (!sceneUrl) return null;

  return {
    uid: block._uid,
    name: block.name?.trim() ?? "",
    sceneUrl,
    tooltip: block.tooltip?.trim() ?? "",
  };
}

export function getStardustSectionFromStory(
  story: StoryblokStory | null | undefined
): StardustSectionContent | null {
  const block = getStardustBlock(story);
  if (!block) return null;

  return {
    quote: storyblokRichTextToHtml(block.quote),
    quoteAttribution: block.quoteAttribution?.trim() ?? "",
    creatorsIntro: block.creatorsIntro?.trim() ?? "",
    creators: (block.creators ?? [])
      .map(mapStardustCreatorBlockToContent)
      .filter((creator): creator is StardustCreatorContent => creator !== null),
    buttonLabel: block.buttonLabel?.trim() ?? "",
  };
}
