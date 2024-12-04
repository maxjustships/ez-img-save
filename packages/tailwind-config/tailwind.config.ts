import type { Config } from 'tailwindcss/types/config'

export default {
  daisyui: {
    themes: ['luxury'],
    darkTheme: 'luxury',
  },
  plugins: [require('daisyui')],
} as Omit<Config, 'content'>
