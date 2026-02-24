import type { Config } from 'tailwindcss'
import isacoPreset from '../../packages/tokens/dist/tailwind.preset.js'

const config: Config = {
  presets: [isacoPreset],
  content: [
    './stories/**/*.{ts,tsx,mdx}',
    '../../packages/components/src/**/*.{ts,tsx}',
  ],
}

export default config
