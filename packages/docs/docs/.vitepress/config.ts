import fs from 'fs';
const read = (relative) => fs.readFileSync(require.resolve(relative), 'utf-8');
// .vitepress/config.js
export default {
  // site-level options
  title: 'axios plugin',
  description: '一套 axios 请求层拦截器调度解决方案，将 axios 插件化，实现与自定义拦截器的解耦',
  lang: 'cn-ZH',
  base: '/axios-plugin/',
  lastUpdated: true,
  themeConfig: {
    // theme-level options
    footer: {
      message: 'Released under the MIT License ❤️',
      copyright: 'Copyright © 2023-present mengqiuleo',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mengqiuleo/axios-plugin'},
      {
        icon: { svg: read('../public/npm.svg')} ,
        link: 'https://www.npmjs.com/settings/axios-plugin/packages'
      },
    ],
    markdown: {
      theme: {
        light: 'min-dark',
        dark: 'one-dark-pro',
      },
      lineNumbers: true,
      config: (md) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        md.use(require('markdown-it-task-lists'))
      },
    },
    // algolia: {
    //   appId: 'WPY8IFS0UX',
    //   apiKey: '8cc9e4ff3f98b5854346224aac791bbf',
    //   indexName: 'axios-cache-interceptor-js'
    // },
    search: {
      provider: 'local'
    },
    editLink: {
      pattern:
        'https://github.com/mengqiuleo/axios-plugin'
    },
    nav: [
      { text: '指南', link: '/guide/index' },
      { text: '插件', link: '/plugin/cache'  },
      { text: '其他', link: '/others/license' }
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '介绍', link: '/guide/' },
          { text: '快速开始', link: '/guide/core' },
          { text: '自定义插件', link: '/guide/diy' }
        ]
      },
      {
        text: '插件',
        items: [
          { text: '缓存', link: '/plugin/cache' },
          { text: '拦截器', link: '/plugin/interceptor' },
          { text: '错误重试', link: '/plugin/retry' },
          { text: '节流', link: '/plugin/throttle' },
          { text: '超时', link: '/plugin/timeout' },
          { text: '文件下载', link: '/plugin/download' },
          { text: 'token', link: '/plugin/token' }
        ]
      },
      {
        text: '其他',
        items: [
          { text: 'MIT License', link: '/others/license' },
          { text: 'Changelog', link: '/others/changelog' }
        ]
      }
    ]
  },
  outDir: '../../../docs'
}