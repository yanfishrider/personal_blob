// src/lib/blog-data.ts — 首页/文章页共享的站点数据（避免每个页面重复 getCollection 计算）
import { getCollection } from 'astro:content';

export interface BlogData {
  posts: Array<{
    slug: string;
    data: {
      title: string;
      description?: string;
      date: Date;
      tags?: string[];
      category?: string;
    };
  }>;
  postCount: number;
  tagCount: number;
  categoryCount: number;
  recentPosts: Array<{ slug: string; title: string }>;
  postDates: string[];
  lastUpdate: Date;
}

export async function getBlogData(): Promise<BlogData> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const tagSet = new Set<string>();
  const catSet = new Set<string>();
  posts.forEach(p => {
    p.data.tags?.forEach(t => tagSet.add(t));
    if (p.data.category) catSet.add(p.data.category);
  });

  const postDates = posts.map(p => {
    const d = p.data.date;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  return {
    posts,
    postCount: posts.length,
    tagCount: tagSet.size,
    categoryCount: catSet.size,
    recentPosts: posts.slice(0, 8).map(p => ({ slug: p.slug, title: p.data.title })),
    postDates,
    lastUpdate: posts.length > 0 ? posts[0].data.date : new Date(),
  };
}
