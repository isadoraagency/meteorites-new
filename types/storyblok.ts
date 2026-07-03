export interface StoryblokAsset {
  filename?: string;
  alt?: string;
}

export interface StoryblokRichTextNode {
  type?: string;
  text?: string;
  content?: StoryblokRichTextNode[];
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

export interface StoryblokStory {
  content?: {
    body?: HeroSectionBlock[];
  };
}
