// src/lib/blog-data.ts — 首页/文章页共享的站点数据
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export interface BlogData {
  posts: Post[];
  postCount: number;
  tagCount: number;
  categoryCount: number;
  recentPosts: Array<{ slug: string; title: string }>;
  /** YYYY-MM-DD，用于日历打点 */
  postDates: string[];
  lastUpdate: Date;
}

/** 统一按 UTC 格式化，避免构建机时区把日期算偏一天 */
export function formatDate(date: Date, style: 'long' | 'short' = 'long'): string {
  return date.toLocaleDateString('zh-CN', {
    timeZone: 'UTC',
    year: 'numeric',
    month: style === 'long' ? 'long' : '2-digit',
    day: '2-digit',
  });
}

/** YYYY-MM-DD（UTC） */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** 粗略阅读时长：中文 400 字/分，英文 200 词/分 */
export function readingTime(body = ''): number {
  const cjk = (body.match(/[\u4e00-\u9fa5]/g) || []).length;
  const words = body
    .replace(/[\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
}

export async function getBlogData(): Promise<BlogData> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const tagSet = new Set<string>();
  const catSet = new Set<string>();
  posts.forEach((p) => {
    p.data.tags?.forEach((t) => tagSet.add(t));
    if (p.data.category) catSet.add(p.data.category);
  });

  return {
    posts,
    postCount: posts.length,
    tagCount: tagSet.size,
    categoryCount: catSet.size,
    recentPosts: posts.slice(0, 6).map((p) => ({ slug: p.slug, title: p.data.title })),
    postDates: posts.map((p) => isoDate(p.data.date)),
    lastUpdate: posts.length > 0 ? posts[0].data.date : new Date(),
  };
}
