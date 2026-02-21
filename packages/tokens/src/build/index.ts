import * as fs from 'fs'
import * as path from 'path'
import { generateCSSVariables, writeCSSFile } from './generate-css-variables'
import { generateFlatTokens, writeFlatTokensFile } from './generate-flat-tokens'
import { generateTailwindPreset, writeTailwindPresetFile } from './generate-tailwind-preset'

// Import semantic tokens (these reference primitives)
async function buildTokens() {
  console.log('🔨 Building tokens...\n')

  // Dynamically import tokens
  const { semantic: semanticColors } = await import('../semantic/colors')
  const { semanticTypography } = await import('../semantic/typography')
  const { semanticSpacing } = await import('../semantic/spacing')

  // Combine all semantic tokens
  const allTokens = {
    color: semanticColors,
    ...semanticTypography,
    ...semanticSpacing,
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

  // Generate Tailwind preset
  const tailwindPreset = generateTailwindPreset(allTokens)
  writeTailwindPresetFile(tailwindPreset, path.join(distDir, 'tailwind.preset.js'))

  console.log('\n✅ Token build complete!')
}

buildTokens().catch((error) => {
  console.error('Error building tokens:', error)
  process.exit(1)
})
