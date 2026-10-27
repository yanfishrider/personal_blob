import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yanfishrider.github.io',
  base: '/personal_blob',
  integrations: [tailwind(), sitemap()],

  // 悬停预取：静态页导航近乎瞬时（显式声明，避免依赖默认值）
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  markdown: {
    // 代码块固定在暖色深底上，和纸面形成节奏对比
    shikiConfig: {
      theme: 'github-dark',
      wrap: false,
    },
  },
});
