import App from "../components/App";
import { getMenu, getStoryStoryblok } from "../lib/storyblok";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const isPreview =
    process.env.NODE_ENV !== "production" ||
    resolvedParams._storyblok !== undefined ||
    resolvedParams._storyblok_tk !== undefined;

  const [menu, story] = await Promise.all([
    getMenu(),
    getStoryStoryblok("home", isPreview),
  ]);

  return <App menu={menu} initialStory={story} />;
}
