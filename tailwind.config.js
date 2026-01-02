module.exports = {
  content:[
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_posts/*.md',
    './*.html',
  ],
  safelist: [
    'rotate-180'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          150: '#f1f5f9',
          850: '#1e293b',
        }
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
    }
  },
  variants: {},
  plugins: [],
}
