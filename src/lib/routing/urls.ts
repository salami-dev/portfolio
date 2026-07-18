export const siteUrl = "https://salami.tech";

export function canonicalPath(path: string): string {
  if (path === "/") {
    return "/";
  }

  return path.endsWith("/") ? path : `${path}/`;
}

export function canonicalUrl(path: string): string {
  return new URL(canonicalPath(path), siteUrl).toString();
}

export function workPath(slug: string): string {
  return `/work/${slug}/`;
}

export function notePath(slug: string): string {
  return `/notes/${slug}/`;
}
