import * as fs from 'fs'
import * as path from 'path'
import { generateCSSVariables, writeCSSFile } from './generate-css-variables'
import { generateFlatTokens, writeFlatTokensFile } from './generate-flat-tokens'
import { generateTailwindPreset, writeTailwindPresetFile } from './generate-tailwind-preset'

// Import semantic tokens (these reference primitives)
async function buildTokens() {
  console.log('🔨 Building tokens...\n')

  // Dynamically import tokens
  const { semanticColors } = await import('../semantic/colors')
  const { semanticTypography } = await import('../semantic/typography')
  const { semanticSpacing } = await import('../semantic/spacing')
  const { semanticRadius } = await import('../semantic/radius')
  const { spacingPrimitives } = await import('../primitives/spacing')
  const { radiusPrimitives } = await import('../primitives/radius')
  const { typographyPrimitives } = await import('../primitives/typography')

  // Combine all semantic tokens for CSS variables
  const allTokens = {
    color: semanticColors,
    ...semanticTypography,
    ...semanticSpacing,
    ...semanticRadius,
  }

  // For Tailwind, include primitive spacing and radius scales
  const tailwindTokens = {
    color: semanticColors,
    spacing: spacingPrimitives.spacing,
    borderRadius: radiusPrimitives.radius,
    fontFamily: typographyPrimitives.fontFamily,
    fontWeight: typographyPrimitives.fontWeight,
  }

  // Create dist directory
  const distDir = path.join(__dirname, '../../dist')
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true })
  }

  // Generate CSS variables
  const cssContent = generateCSSVariables(allTokens)
  writeCSSFile(cssContent, path.join(distDir, 'variables.css'))

  // Generate flat tokens for Pencil.dev
  const flatTokens = generateFlatTokens(allTokens)
  writeFlatTokensFile(flatTokens, path.join(distDir, 'tokens-flat.json'))

  // Generate Tailwind preset (using primitive spacing scale)
  const tailwindPreset = generateTailwindPreset(tailwindTokens)
  writeTailwindPresetFile(tailwindPreset, path.join(distDir, 'tailwind.preset.js'))

  console.log('\n✅ Token build complete!')
}

buildTokens().catch((error) => {
  console.error('Error building tokens:', error)
  process.exit(1)
})
