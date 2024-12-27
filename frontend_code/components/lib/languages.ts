export const languages = {
  markdown: { name: 'Markdown', alias: ['md', 'markdown'] },
  json: { name: 'JSON' },
  javascript: { name: 'JavaScript', alias: ['js'] },
  typescript: { name: 'TypeScript', alias: ['ts'] },
  python: { name: 'Python', alias: ['py'] },
  html: { name: 'HTML' },
  css: { name: 'CSS' },
  java: { name: 'Java' },
  cpp: { name: 'C++' },
  rust: { name: 'Rust', alias: ['rs'] },
} as const;

export type LanguageKey = keyof typeof languages;