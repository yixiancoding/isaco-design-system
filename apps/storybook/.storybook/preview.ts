import type { Preview } from '@storybook/react'
import '/Users/isali/projects/isaco-design-system/packages/tokens/dist/variables.css'
import '../styles.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
