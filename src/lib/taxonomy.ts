// src/lib/taxonomy.ts — 标签/分类的 URL slug 生成与反查
// 静态站用 slug 做路由，避免中文、空格、点号在 URL 里被各种环境区别对待。

export interface TaxonomyItem {
  name: string;
  slug: string;
  count: number;
}

/** 名称 → URL slug：小写、空格转连字符、去掉 URL 里有歧义的字符，保留中文 */
export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[.\s_/\\?#%&]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** 从文章集合里聚合标签或分类，按出现次数倒序 */
export function buildTaxonomy(
  posts: Array<{ data: { tags?: string[]; category?: string } }>,
  kind: 'tag' | 'category'
): TaxonomyItem[] {
  const map = new Map<string, TaxonomyItem>();

  for (const post of posts) {
    const names =
      kind === 'tag'
        ? post.data.tags ?? []
        : post.data.category
          ? [post.data.category]
          : [];

    for (const name of names) {
      const existing = map.get(name);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(name, { name, slug: slugify(name), count: 1 });
      }
    }
  }

  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
