import { typographyPrimitives } from '../primitives/typography'

export const semanticTypography = {
  fontSize: {
    caption: typographyPrimitives.fontSize[2],        // 12px/13px
    bodyDense: typographyPrimitives.fontSize[4],      // 14px/15px
    label: typographyPrimitives.fontSize[4],          // 14px/15px
    labelSm: typographyPrimitives.fontSize[1],        // 11px/12px
    navigation: typographyPrimitives.fontSize[4],     // 14px/15px
    body: typographyPrimitives.fontSize[5],           // 16px/16px
    headingSm: typographyPrimitives.fontSize[6],      // 18px/17px
    headingMd: typographyPrimitives.fontSize[8],      // 23px/19px
    headingLg: typographyPrimitives.fontSize[10],     // 29px/22px
    displaySm: typographyPrimitives.fontSize[8],      // 23px/19px
    displayMd: typographyPrimitives.fontSize[12],     // 36px/25px
    displayLg: typographyPrimitives.fontSize[13],     // 40px/27px
    displayXl: typographyPrimitives.fontSize[14],     // 48px/29px
  },
} as const
