import { canonicalUrl } from "@lib/routing/urls";

export type PageMetadata = {
  title: string;
  description: string;
  canonical: string;
  ogType?: "website" | "article";
  image?: string;
};

const siteName = "Personal Engineering Portfolio";

export function buildPageMetadata(input: {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  image?: string;
}): PageMetadata {
  return {
    title: input.title === siteName ? input.title : `${input.title} | ${siteName}`,
    description: input.description,
    canonical: canonicalUrl(input.path),
    ogType: input.ogType ?? "website",
    image: input.image
  };
}
