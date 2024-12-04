import baseConfig from '@extension/tailwindcss-config'
import { withUI } from '@extension/ui'

export default withUI({
  ...baseConfig,
  daisyui: {
    ...baseConfig.daisyui,
    themes: ['forest'],
    darkTheme: 'forest',
    themeRoot: '#shadow-root',
  },
  content: ['src/**/*.{ts,tsx}'],
})
