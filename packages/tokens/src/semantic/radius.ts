import { radiusPrimitives } from '../primitives/radius'

export const semanticRadius = {
  radius: {
    button: radiusPrimitives.radius.full,
    card: {
      mobile: radiusPrimitives.radius['2xl'],    // 16px
      desktop: radiusPrimitives.radius['3xl'],   // 24px
    },
    table: {
      mobile: radiusPrimitives.radius['2xl'],    // 16px
      desktop: radiusPrimitives.radius['3xl'],   // 24px
    },
    leftNavItem: radiusPrimitives.radius.none,
    input: radiusPrimitives.radius['2xl'],       // 16px
    badgeSmall: radiusPrimitives.radius.xl,      // 12px
    badgeDefault: radiusPrimitives.radius['2xl'], // 16px
    select: radiusPrimitives.radius.full,
    selectForm: radiusPrimitives.radius['2xl'],   // 16px
  },
} as const
