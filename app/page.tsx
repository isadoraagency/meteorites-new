import App from "../components/App";
import {
  getBackgroundGradientFromConfig,
  getMenu,
  getScrollProgressGradientFromConfig,
  getStoryStoryblok,
} from "../lib/storyblok";
import type { SiteGlobalConfigurationsBlock } from "../types/storyblok";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const isPreview =
    process.env.NODE_ENV !== "production" ||
    resolvedParams._storyblok !== undefined ||
    resolvedParams._storyblok_tk !== undefined;

  const [menu, story, globalConfigStory] = await Promise.all([
    getMenu(),
    getStoryStoryblok("home", isPreview),
    getStoryStoryblok("site-global-configurations", isPreview),
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
        menu={menu}
        initialStory={story}
        initialGlobalConfig={globalConfigStory}
      />
    </>
  );
}
