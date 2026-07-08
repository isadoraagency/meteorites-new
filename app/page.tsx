import App from "../components/App";
import {
  getBackgroundGradientFromConfig,
  getMenuContent,
  getScrollProgressGradientFromConfig,
  getStoryStoryblok,
  isPreviewEnvironment,
} from "../lib/storyblok";
import type { SiteGlobalConfigurationsBlock } from "../types/storyblok";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const isPreview =
    isPreviewEnvironment ||
    resolvedParams._storyblok !== undefined ||
    resolvedParams._storyblok_tk !== undefined;
  const [menuContent, story, globalConfigStory, menuStory] = await Promise.all([
    getMenuContent(isPreview),
    getStoryStoryblok("home", isPreview),
    getStoryStoryblok("site-global-configurations", isPreview),
    getStoryStoryblok("menu", isPreview),
  ]);

  const globalConfig =
    globalConfigStory?.content as SiteGlobalConfigurationsBlock | undefined;
  const backgroundGradient = getBackgroundGradientFromConfig(globalConfig);
  const scrollGradient = getScrollProgressGradientFromConfig(globalConfig);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `:root { --site-bg-gradient: ${backgroundGradient}; --site-bg-gradient-scroll: ${scrollGradient}; }`,
        }}
      />
      <App
        menuContent={menuContent}
        initialMenuStory={menuStory}
        initialStory={story}
        initialGlobalConfig={globalConfigStory}
      />
    </>
  );
}
