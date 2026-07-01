import App from "../components/App";
import { getMenu } from "../lib/storyblok";

export default async function Home() {
  const menu = await getMenu();
  return <App menu={menu} />;
}
