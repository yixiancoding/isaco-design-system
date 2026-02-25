import { spacingPrimitives } from '../primitives/spacing'

export const semanticSpacing = {
  spacing: {
    pageMargin: {
      mobile: spacingPrimitives.spacing[200],    // 16px (1rem)
      desktop: spacingPrimitives.spacing[300],   // 24px (1.5rem)
    },
    cardPadding: {
      mobile: spacingPrimitives.spacing[200],    // 16px (1rem)
      desktop: spacingPrimitives.spacing[300],   // 24px (1.5rem)
    },
    pageTopPadding: {
      mobile: spacingPrimitives.spacing[200],    // 16px (1rem)
      desktop: spacingPrimitives.spacing[500],   // 40px (2.5rem)
    },
  },
} as const
