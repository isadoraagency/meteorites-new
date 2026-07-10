import type {
  AboutContent,
  MenuAgency,
  MenuContent,
  MenuData,
  MenuLink,
  Meteorite,
  MeteoriteType,
  SourceItem,
  SourcesContent,
} from "../types/content";
import type {
  AboutBlock,
  GradientBlock,
  HeroSectionBlock,
  HeroTextBlock,
  MenuFooterBlock,
  MenuLinkBlock,
  MenuStoryblokContent,
  MeteoriteBlock,
  MeteoriteTypeBlock,
  SiteGlobalConfigurationsBlock,
  SourceItemBlock,
  SourcesBlock,
  StoryblokAsset,
  StoryblokMultilink,
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

interface RichTextRenderOptions {
  paragraphClass?: string;
  headingClasses?: Partial<Record<number, string>>;
  linkClass?: string;
  linkTarget?: string;
  mergeLinkContinuations?: boolean;
  mergeAfterBoldContinuations?: boolean;
}

function getParagraphTextNodes(
  node: StoryblokRichTextNode
): StoryblokRichTextNode[] {
  if (node.type !== "paragraph" || !node.content?.length) return [];
  return node.content.filter(
    (child) => child.type === "text" && Boolean(child.text?.trim())
  );
}

function paragraphHasMark(
  node: StoryblokRichTextNode,
  markType: string
): boolean {
  return getParagraphTextNodes(node).some((child) =>
    child.marks?.some((mark) => mark.type === markType)
  );
}

function isLinkOnlyParagraph(node: StoryblokRichTextNode): boolean {
  const textNodes = getParagraphTextNodes(node);
  return (
    node.type === "paragraph" &&
    textNodes.length === 1 &&
    textNodes[0].marks?.some((mark) => mark.type === "link") === true
  );
}

function isBoldOnlyParagraph(node: StoryblokRichTextNode): boolean {
  const textNodes = getParagraphTextNodes(node);
  return (
    node.type === "paragraph" &&
    textNodes.length > 0 &&
    textNodes.every((child) => child.marks?.some((mark) => mark.type === "bold"))
  );
}

function isPlainContinuationParagraph(node: StoryblokRichTextNode): boolean {
  const textNodes = getParagraphTextNodes(node);
  return (
    node.type === "paragraph" &&
    textNodes.length > 0 &&
    !paragraphHasMark(node, "link") &&
    !paragraphHasMark(node, "bold")
  );
}

function shouldMergeParagraphContinuation(
  current: StoryblokRichTextNode,
  next: StoryblokRichTextNode,
  options: RichTextRenderOptions
): boolean {
  if (current.type !== "paragraph" || next.type !== "paragraph") return false;

  if (options.mergeLinkContinuations && isLinkOnlyParagraph(next)) {
    return true;
  }

  if (
    options.mergeAfterBoldContinuations &&
    isPlainContinuationParagraph(next) &&
    isBoldOnlyParagraph(current)
  ) {
    return true;
  }

  return false;
}

function mergeParagraphContinuations(
  nodes: StoryblokRichTextNode[],
  options: RichTextRenderOptions
): StoryblokRichTextNode[] {
  if (
    !options.mergeLinkContinuations &&
    !options.mergeAfterBoldContinuations
  ) {
    return nodes;
  }

  const merged: StoryblokRichTextNode[] = [];

  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];

    if (node.type !== "paragraph") {
      merged.push(node);
      continue;
    }

    const combined: StoryblokRichTextNode = {
      ...node,
      content: [...(node.content ?? [])],
    };

    while (
      index + 1 < nodes.length &&
      shouldMergeParagraphContinuation(combined, nodes[index + 1], options)
    ) {
      index++;
      const next = nodes[index];
      combined.content?.push({ type: "hard_break" });
      combined.content?.push(...(next.content ?? []));
    }

    merged.push(combined);
  }

  return merged;
}

function preprocessRichTextDoc(
  value: StoryblokRichText,
  options: RichTextRenderOptions
): StoryblokRichText {
  if (!Array.isArray(value.content)) return value;

  return {
    ...value,
    content: mergeParagraphContinuations(value.content, options),
  };
}

function applyRichTextMarks(
  text: string,
  marks?: StoryblokRichTextMark[],
  options: RichTextRenderOptions = {}
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
      case "link": {
        const href = String(mark.attrs?.href ?? "#");
        const target =
          options.linkTarget ??
          (typeof mark.attrs?.target === "string" ? mark.attrs.target : "_blank");
        const classAttr = options.linkClass ? ` class="${options.linkClass}"` : "";
        const rel = target === "_blank" ? ' rel="noreferrer"' : "";
        return `<a href="${escapeHtml(href)}" target="${escapeHtml(target)}"${classAttr}${rel}>${result}</a>`;
      }
      default:
        return result;
    }
  }, text);
}

function renderRichTextNode(
  node: StoryblokRichTextNode,
  inline = false,
  options: RichTextRenderOptions = {}
): string {
  if (node.type === "text") {
    const text = escapeHtml(node.text ?? "");
    return applyRichTextMarks(text, node.marks, options);
  }

  if (node.type === "hard_break") return "<br/>";

  if (node.type === "heading") {
    const level = Number(node.attrs?.level) || 3;
    const tag = `h${level}`;
    const className = options.headingClasses?.[level];
    const classAttr = className ? ` class="${className}"` : "";
    const inner =
      node.content?.map((child) => renderRichTextNode(child, inline, options)).join("") ?? "";
    return `<${tag}${classAttr}>${inner}</${tag}>`;
  }

  if (node.type === "paragraph") {
    const inner =
      node.content?.map((child) => renderRichTextNode(child, inline, options)).join("") ?? "";
    if (!inner.trim()) return "";
    if (inline) return inner;
    const className = options.paragraphClass;
    const classAttr = className ? ` class="${className}"` : "";
    return `<p${classAttr}>${inner}</p>`;
  }

  if (Array.isArray(node.content)) {
    return node.content
      .map((child) => renderRichTextNode(child, inline, options))
      .join("");
  }

  return "";
}

function richTextToHtml(
  value: StoryblokRichText | StoryblokRichTextNode | string | null | undefined,
  inline = false,
  options: RichTextRenderOptions = {}
): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  const normalizedValue =
    value.type === "doc" && Array.isArray(value.content)
      ? preprocessRichTextDoc(value, options)
      : value;

  if (normalizedValue.type === "doc" && Array.isArray(normalizedValue.content)) {
    if (inline) {
      return normalizedValue.content
        .map((node) => renderRichTextNode(node, true, options))
        .filter(Boolean)
        .join("<br/>");
    }
    return normalizedValue.content
      .map((node) => renderRichTextNode(node, false, options))
      .filter(Boolean)
      .join("");
  }

  return renderRichTextNode(normalizedValue, inline, options);
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

export function storyblokRichTextToSourcesHtml(
  value?: StoryblokRichText | StoryblokRichTextNode | string | null
): string {
  return richTextToHtml(value, false, {
    headingClasses: {
      3: "text-p p2 text-semi-bold",
    },
    linkClass: "ia-link",
    linkTarget: "_blank",
    mergeLinkContinuations: true,
  });
}

export function storyblokRichTextToCreditsHtml(
  value?: StoryblokRichText | StoryblokRichTextNode | string | null
): string {
  return richTextToHtml(value, false, {
    paragraphClass: "fz-6",
    mergeAfterBoldContinuations: true,
  });
}

export function storyblokRichTextToAboutHtml(
  value?: StoryblokRichText | StoryblokRichTextNode | string | null
): string {
  return richTextToHtml(value, false, {
    paragraphClass: "h6 text-light",
  });
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

const EMPTY_MENU_CONTENT: MenuContent = {
  links: [{ large: [], small: [] }],
  agency: {
    footerText: "",
    footerCreditsText: "",
    agencyUrl: "",
    agencyLogo: "",
  },
  creditsHtml: "",
  sources: { title: "", video: "", items: [] },
  about: { logo: "", text: "", ctaLabel: "", ctaUrl: "" },
};

function mapMenuLinks(blocks: MenuLinkBlock[] = []): MenuLink[] {
  return blocks
    .map((block) => ({
      title: block.title?.trim() ?? "",
      action: block.action?.trim() ?? "",
    }))
    .filter((link) => link.title && link.action);
}

export function getStoryblokLinkUrl(link?: StoryblokMultilink | null): string {
  return link?.url?.trim() || link?.cached_url?.trim() || "";
}

function getMenuFooterFields(
  content?: MenuStoryblokContent | null
): MenuFooterBlock {
  const footerGroup = content?.footer?.[0];
  return {
    footerText: footerGroup?.footerText ?? content?.footerText,
    footerCreditsText:
      footerGroup?.footerCreditsText ?? content?.footerCreditsText,
    agencyUrl: footerGroup?.agencyUrl ?? content?.agencyUrl,
    agencyLogo: footerGroup?.agencyLogo ?? content?.agencyLogo,
  };
}

function mapMenuAgency(content?: MenuStoryblokContent | null): MenuAgency {
  const footer = getMenuFooterFields(content);
  return {
    footerText: footer.footerText?.trim() ?? "",
    footerCreditsText: footer.footerCreditsText?.trim() ?? "",
    agencyUrl: getStoryblokLinkUrl(footer.agencyUrl),
    agencyLogo: getStoryblokAssetUrl(footer.agencyLogo),
    agencyLogoAlt: getStoryblokAssetAlt(footer.agencyLogo),
  };
}

function mapSourceItemBlock(block: SourceItemBlock): SourceItem | null {
  const title = block.title?.trim() ?? "";
  const description = storyblokRichTextToSourcesHtml(block.description);
  if (!title || !description.trim()) return null;
  return { title, description };
}

function mapSourcesBlock(block?: SourcesBlock | null): SourcesContent {
  return {
    title: block?.title?.trim() ?? "",
    video: getStoryblokAssetUrl(block?.video),
    items: (block?.items ?? [])
      .map(mapSourceItemBlock)
      .filter((item): item is SourceItem => item !== null),
  };
}

function mapAboutBlock(block?: AboutBlock | null): AboutContent {
  return {
    logo: getStoryblokAssetUrl(block?.logo),
    logoAlt: getStoryblokAssetAlt(block?.logo),
    text: storyblokRichTextToAboutHtml(block?.text),
    ctaLabel: block?.ctaLabel?.trim() ?? "",
    ctaUrl: getStoryblokLinkUrl(block?.ctaUrl),
  };
}

function logMissingMenuFields(content: MenuContent): void {
  const section = content.links[0];
  if (!section?.large.length) {
    console.warn("[storyblok] menu: missing or empty large links");
  }
  if (!section?.small.length) {
    console.warn("[storyblok] menu: missing or empty small links");
  }
  if (!content.agency.footerText) {
    console.warn("[storyblok] menu: missing footerText");
  }
  if (!content.agency.agencyUrl) {
    console.warn("[storyblok] menu: missing agencyUrl");
  }
  if (!content.agency.agencyLogo) {
    console.warn("[storyblok] menu: missing agencyLogo");
  }
  if (!content.creditsHtml.trim()) {
    console.warn("[storyblok] menu: missing credits content");
  }
  if (!content.sources.title) {
    console.warn("[storyblok] menu: missing sources title");
  }
  if (!content.sources.video) {
    console.warn("[storyblok] menu: missing sources video");
  }
  if (!content.sources.items.length) {
    console.warn("[storyblok] menu: missing sources items");
  }
  if (!content.about.text.trim()) {
    console.warn("[storyblok] menu: missing about text");
  }
  if (!content.about.ctaLabel || !content.about.ctaUrl) {
    console.warn("[storyblok] menu: missing about CTA");
  }
}

export function getEmptyMenuContent(): MenuContent {
  return structuredClone(EMPTY_MENU_CONTENT);
}

export function mapMenuStoryToContent(
  story?: { content?: MenuStoryblokContent } | null
): MenuContent {
  const content = story?.content;
  if (!content) {
    console.warn("[storyblok] menu: story has no content");
    return getEmptyMenuContent();
  }

  const mapped: MenuContent = {
    links: [
      {
        large: mapMenuLinks(content.large),
        small: mapMenuLinks(content.small),
      },
    ],
    agency: mapMenuAgency(content),
    creditsHtml: content.credits
      ? storyblokRichTextToCreditsHtml(content.credits)
      : "",
    sources: mapSourcesBlock(content.sources?.[0]),
    about: mapAboutBlock(content.about?.[0]),
  };

  logMissingMenuFields(mapped);
  return mapped;
}
