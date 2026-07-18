import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { canonicalUrl, notePath } from "@lib/routing/urls";

export const GET: APIRoute = async () => {
  const notes = (await getCollection("notes")).sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
  const items = notes
    .map((note) => {
      const url = canonicalUrl(notePath(note.data.slug));
      return `<item><title>${note.data.title}</title><link>${url}</link><guid>${url}</guid><pubDate>${note.data.publishedAt.toUTCString()}</pubDate><description>${note.data.summary}</description></item>`;
    })
    .join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Engineering Notes</title><link>${canonicalUrl("/notes/")}</link><description>Engineering notes and technical investigations.</description>${items}</channel></rss>`, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" }
  });
};
