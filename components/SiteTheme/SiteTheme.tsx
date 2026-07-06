"use client";

import { useEffect } from "react";
import { useStoryblokState } from "@storyblok/react";
import {
  getBackgroundGradientFromConfig,
  getScrollProgressGradientFromConfig,
} from "../../lib/storyblok-utils";
import type { SiteGlobalConfigurationsBlock } from "../../types/storyblok";

interface SiteGlobalConfigStory {
  content?: SiteGlobalConfigurationsBlock;
}

interface SiteThemeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialConfig?: any;
}

export default function SiteTheme({ initialConfig }: SiteThemeProps) {
  const configStory = useStoryblokState(
    initialConfig ?? null
  ) as SiteGlobalConfigStory | null;
  const content = configStory?.content ?? null;
  const backgroundGradient = getBackgroundGradientFromConfig(content);
  const scrollGradient = getScrollProgressGradientFromConfig(content);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--site-bg-gradient",
      backgroundGradient
    );
    document.documentElement.style.setProperty(
      "--site-bg-gradient-scroll",
      scrollGradient
    );
  }, [backgroundGradient, scrollGradient]);

  return null;
}
