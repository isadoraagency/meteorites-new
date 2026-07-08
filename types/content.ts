// Shapes of the static JSON content served from /public/data/*.json

export interface VideoFall {
  description: string;
  source: string;
  src: string;
}

export interface Meteorite {
  title: string;
  slug: string;
  about: string; // HTML string
  short: string;
  image: string;
  shadow: string;
  video: string;
  old: string; // HTML string, e.g. "<strong>1.3</strong> billion years old"
  fallDate: string;
  fallPlace: string;
  composition: string[];
  type: string;
  class: string;
  observedFall: boolean;
  videoFall?: VideoFall;
  foundDate: string;
}

export interface MeteoriteType {
  id: number;
  uid?: string;
  name: string;
  description: string; // HTML string
  image: string;
  type: string;
}

export interface MenuLink {
  title: string;
  action: string;
}

export interface MenuSection {
  large: MenuLink[];
  small: MenuLink[];
}

// menu.json is an array containing a single MenuSection
export type MenuData = MenuSection[];

export interface TextContent {
  text: string; // HTML string
}

export interface SourceItem {
  title: string;
  description: string; // HTML string
}

export interface MenuAgency {
  footerText: string;
  footerCreditsText: string;
  agencyUrl: string;
  agencyLogo: string;
  agencyLogoAlt?: string;
}

export interface SourcesContent {
  title: string;
  video: string;
  items: SourceItem[];
}

export interface AboutContent {
  logo: string;
  logoAlt?: string;
  text: string;
  ctaLabel: string;
  ctaUrl: string;
}

export interface MenuContent {
  links: MenuData;
  agency: MenuAgency;
  creditsHtml: string;
  sources: SourcesContent;
  about: AboutContent;
}
