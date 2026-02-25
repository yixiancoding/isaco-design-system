export const typographyPrimitives = {
  fontFamily: {
    body: 'Urbanist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'Magno Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  fontSize: {
    // Base scale - responsive between desktop (SM+) and mobile
    // Format: [desktop, mobile]
    1: ['0.6875rem', '0.75rem'],      // 11px, 12px
    2: ['0.75rem', '0.8125rem'],      // 12px, 13px
    3: ['0.8125rem', '0.875rem'],     // 13px, 14px
    4: ['0.875rem', '0.9375rem'],     // 14px, 15px
    5: ['1rem', '1rem'],              // 16px, 16px
    6: ['1.125rem', '1.0625rem'],     // 18px, 17px
    7: ['1.25rem', '1.125rem'],       // 20px, 18px
    8: ['1.4375rem', '1.1875rem'],    // 23px, 19px
    9: ['1.625rem', '1.3125rem'],     // 26px, 21px
    10: ['1.8125rem', '1.375rem'],    // 29px, 22px
    11: ['2rem', '1.5rem'],           // 32px, 24px
    12: ['2.25rem', '1.5625rem'],     // 36px, 25px
    13: ['2.5rem', '1.6875rem'],      // 40px, 27px
    14: ['3rem', '1.8125rem'],        // 48px, 29px
  },
  letterSpacing: {
    default: '0',
  },
  paragraphSpacing: '0',
  paragraphIndent: '0',
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const
