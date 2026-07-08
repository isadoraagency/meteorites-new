export interface StoryblokAsset {
  filename?: string;
  alt?: string;
}

export interface StoryblokRichTextMark {
  type?: string;
  attrs?: Record<string, unknown>;
}

export interface StoryblokRichTextNode {
  type?: string;
  text?: string;
  marks?: StoryblokRichTextMark[];
  content?: StoryblokRichTextNode[];
  attrs?: Record<string, unknown>;
}

export interface StoryblokRichText {
  type?: string;
  content?: StoryblokRichTextNode[];
}

export interface HeroTextBlock {
  _uid?: string;
  component: "text";
  text?: StoryblokRichText | string;
}

export interface HeroSectionBlock {
  _uid?: string;
  component: "hero-section";
  mainTitle?: string;
  mainSubtitle?: string;
  video?: StoryblokAsset;
  backgroundBlur?: number | string;
  texts?: HeroTextBlock[];
  secondTitle?: string;
  secondTitleColor?: string;
  videoAnimation?: StoryblokAsset;
  videoAnimationSafari?: StoryblokAsset;
  textAfterPill?: HeroTextBlock[];
}

export interface GradientBlock {
  _uid?: string;
  component: "gradient";
  Degrees?: string | number;
  startColor?: string;
  middleColor?: string;
  endColor?: string;
}

export interface SiteGlobalConfigurationsBlock {
  _uid?: string;
  component: "site-global-configurations";
  backgroundGradient?: GradientBlock[];
}

export interface CompositionItemBlock {
  _uid?: string;
  component: "composition-item";
  name?: string;
}

export interface VideoFallBlock {
  _uid?: string;
  component: "video-fall";
  description?: string;
  source?: string;
  video?: StoryblokAsset;
}

export interface MeteoriteBlock {
  _uid?: string;
  component: "meteorite";
  title?: string;
  slug?: string;
  about?: StoryblokRichText | string;
  short?: StoryblokRichText | string;
  old?: StoryblokRichText | string;
  fallPlace?: string;
  fallDate?: string;
  foundDate?: string;
  type?: string;
  meteoriteClass?: string;
  observedFall?: boolean;
  image?: StoryblokAsset;
  shadow?: StoryblokAsset;
  video?: StoryblokAsset;
  composition?: CompositionItemBlock[];
  videoFall?: VideoFallBlock[];
}

export interface MeteoriteTypeBlock {
  _uid?: string;
  component: "meteorite-type";
  name?: string;
  subtype?: string;
  description?: StoryblokRichText | string;
  image?: StoryblokAsset;
}

export interface TypeMeteoritesSectionBlock {
  _uid?: string;
  component: "type-meteorites-section";
  title?: string;
  description?: StoryblokRichText | string;
  items?: MeteoriteTypeBlock[];
}

export interface StardustCreatorBlock {
  _uid?: string;
  component: "stardust-creator";
  name?: string;
  sceneUrl?: string;
  tooltip?: string;
}

export interface StardustSectionBlock {
  _uid?: string;
  component: "stardust-section";
  quote?: StoryblokRichText | string;
  quoteAttribution?: string;
  creatorsIntro?: string;
  creators?: StardustCreatorBlock[];
  buttonLabel?: string;
}

export type StoryblokBodyBlock =
  | HeroSectionBlock
  | MeteoriteBlock
  | TypeMeteoritesSectionBlock
  | StardustSectionBlock;

export interface StoryblokMultilink {
  url?: string;
  cached_url?: string;
  linktype?: string;
}

export interface MenuLinkBlock {
  _uid?: string;
  component: "menu_link";
  title?: string;
  action?: string;
}

export interface SourceItemBlock {
  _uid?: string;
  component: "source-item";
  title?: string;
  description?: StoryblokRichText | string;
}

export interface SourcesBlock {
  _uid?: string;
  component: "sources";
  title?: string;
  video?: StoryblokAsset;
  items?: SourceItemBlock[];
}

export interface AboutBlock {
  _uid?: string;
  component: "about";
  logo?: StoryblokAsset;
  text?: StoryblokRichText | string;
  ctaLabel?: string;
  ctaUrl?: StoryblokMultilink;
}

export interface MenuFooterBlock {
  footerText?: string;
  footerCreditsText?: string;
  agencyUrl?: StoryblokMultilink;
  agencyLogo?: StoryblokAsset;
}

export interface MenuStoryblokContent extends MenuFooterBlock {
  _uid?: string;
  component?: "menu";
  large?: MenuLinkBlock[];
  small?: MenuLinkBlock[];
  credits?: StoryblokRichText | string;
  sources?: SourcesBlock[];
  about?: AboutBlock[];
  footer?: MenuFooterBlock[];
  footerCreditsText?: string;
}

export interface StoryblokStory {
  content?: {
    body?: StoryblokBodyBlock[];
  };
}
