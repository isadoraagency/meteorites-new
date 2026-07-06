import type { Config } from "dompurify";

type DOMPurifyInstance = {
  sanitize: (dirty: string, config?: Config) => string;
};

let purify: DOMPurifyInstance | null = null;

function resolvePurify(): DOMPurifyInstance | null {
  if (typeof window === "undefined") return null;

  if (purify) return purify;

  // Lazy require so DOMPurify initializes with `window` available.
  // A top-level import runs during SSR and returns a factory without `.sanitize`.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const imported = require("dompurify") as {
    default: DOMPurifyInstance & ((window: Window) => DOMPurifyInstance);
  };

  const DOMPurify = imported.default ?? imported;

  if (typeof DOMPurify.sanitize === "function") {
    purify = DOMPurify;
  } else if (typeof DOMPurify === "function") {
    purify = DOMPurify(window);
  }

  return purify;
}

export function sanitizeHtml(html: string, config?: Config): string {
  const cleaner = resolvePurify();
  if (!cleaner) return html;
  return cleaner.sanitize(html, config);
}
