import fs from 'fs'
import path from 'path'

interface Mode {
  modeId: string
  name: string
}

interface Collection {
  id: string
  name: string
  modes: Mode[]
  variableIds: string[]
}

interface Variable {
  id: string
  name: string
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN'
  valuesByMode: Record<string, any>
}

interface ConsoleOutput {
  collections: Record<string, Collection>
  variables: Record<string, Variable>
}

// Helper to convert RGBA to hex
function rgbaToHex(rgba: { r: number; g: number; b: number; a: number }): string {
  const r = Math.round(rgba.r * 255)
  const g = Math.round(rgba.g * 255)
  const b = Math.round(rgba.b * 255)
  const a = rgba.a

  if (a < 1) {
    const alpha = Math.round(a * 255)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${alpha.toString(16).padStart(2, '0')}`
  }

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Resolve variable aliases
function resolveValue(value: any, variables: Record<string, Variable>, modeId: string, visited = new Set<string>()): any {
  if (value && typeof value === 'object' && 'type' in value && value.type === 'VARIABLE_ALIAS') {
    const aliasId = value.id

    if (visited.has(aliasId)) {
      console.warn(`Circular reference detected for variable ${aliasId}`)
      return null
    }

    visited.add(aliasId)
    const aliasedVar = variables[aliasId]

    if (!aliasedVar) {
      console.warn(`Variable ${aliasId} not found`)
      return null
    }

    // Try the requested mode first, then fall back to any available mode
    let aliasedValue = aliasedVar.valuesByMode[modeId]
    if (!aliasedValue) {
      // Use the first available mode from the aliased variable
      const availableModes = Object.keys(aliasedVar.valuesByMode)
      if (availableModes.length > 0) {
        aliasedValue = aliasedVar.valuesByMode[availableModes[0]]
      }
    }

    return resolveValue(aliasedValue, variables, modeId, visited)
  }

  return value
}

// Process the console output
function processConsoleOutput(data: ConsoleOutput) {
  const { collections, variables } = data

  // Find the TS1 Primitives collection
  const primitivesCollection = Object.values(collections).find(c => c.name === 'TS1 Primitives')
  if (!primitivesCollection) {
    console.error('TS1 Primitives collection not found')
    return
  }

  // Get the default mode (usually the first one, typically "Light")
  const defaultMode = primitivesCollection.modes[0]
  const defaultModeId = defaultMode.modeId

  // Organize primitives by category
  const colorPrimitives: Record<string, Record<string, string>> = {}
  const spacingPrimitives: Record<string, string> = {}
  const typographyPrimitives: Record<string, any> = {
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
  }

  // Process primitive variables
  for (const varId of primitivesCollection.variableIds) {
    const variable = variables[varId]
    if (!variable) continue

    // Skip deprecated variables (including typos like [depreacted])
    if (variable.name.toLowerCase().includes('deprec')) continue

    const rawValue = variable.valuesByMode[defaultModeId]
    const value = resolveValue(rawValue, variables, defaultModeId)

    const nameParts = variable.name.split('/')

    if (variable.resolvedType === 'COLOR' && value) {
      // Color primitive: e.g., "Oranges/50"
      const [category, shade] = nameParts
      if (!colorPrimitives[category]) {
        colorPrimitives[category] = {}
      }
      const hexValue = rgbaToHex(value)
      colorPrimitives[category][shade] = hexValue
    } else if (variable.resolvedType === 'FLOAT') {
      // Could be spacing or typography
      if (nameParts[0].toLowerCase().includes('spacing') || nameParts[0].toLowerCase().includes('space')) {
        const key = nameParts[nameParts.length - 1]
        spacingPrimitives[key] = `${value}rem`
      } else if (nameParts[0].toLowerCase().includes('font')) {
        // Typography primitive
        const category = nameParts[0].toLowerCase()
        const key = nameParts[nameParts.length - 1]
        if (category.includes('size')) {
          typographyPrimitives.fontSize[key] = `${value}rem`
        } else if (category.includes('weight')) {
          typographyPrimitives.fontWeight[key] = value
        } else if (category.includes('lineheight') || category.includes('line-height')) {
          typographyPrimitives.lineHeight[key] = value
        }
      }
    } else if (variable.resolvedType === 'STRING') {
      // Font family
      if (nameParts[0].toLowerCase().includes('font') && nameParts[0].toLowerCase().includes('family')) {
        const key = nameParts[nameParts.length - 1]
        typographyPrimitives.fontFamily[key] = value
      }
    }
  }

  // Generate color primitives file
  const colorPrimitivesContent = `export const colorPrimitives = ${JSON.stringify(colorPrimitives, null, 2)} as const\n`
  fs.writeFileSync(
    path.join(__dirname, '../src/primitives/colors.ts'),
    colorPrimitivesContent
  )

  // Generate spacing primitives file (only if we found spacing values)
  if (Object.keys(spacingPrimitives).length > 0) {
    const spacingContent = `export const spacingPrimitives = {\n  spacing: ${JSON.stringify(spacingPrimitives, null, 2)}\n} as const\n`
    fs.writeFileSync(
      path.join(__dirname, '../src/primitives/spacing.ts'),
      spacingContent
    )
  }

  // Process semantic tokens from Web Tokens collection
  const webTokensCollection = Object.values(collections).find(c => c.name === 'Web Tokens')
  if (webTokensCollection) {
    const semanticColors: Record<string, Record<string, string>> = {}

    // Use Web Tokens' own default mode
    const webTokensModeId = webTokensCollection.modes[0].modeId

    for (const varId of webTokensCollection.variableIds) {
      const variable = variables[varId]
      if (!variable || variable.resolvedType !== 'COLOR') continue

      // Skip deprecated variables (including typos like [depreacted])
      if (variable.name.toLowerCase().includes('deprec')) continue

      const rawValue = variable.valuesByMode[webTokensModeId]
      const value = resolveValue(rawValue, variables, webTokensModeId)

      if (!value) continue

      const nameParts = variable.name.split('/')
      // e.g., "Admin Action/default" or "Neutral/border"
      const [category, ...rest] = nameParts
      const key = rest.join('.')

      if (!semanticColors[category]) {
        semanticColors[category] = {}
      }

      const hexValue = rgbaToHex(value)
      semanticColors[category][key] = hexValue
    }

    // Generate semantic colors file
    const semanticColorsContent = `import { colorPrimitives } from '../primitives/colors'\n\nexport const semanticColors = ${JSON.stringify(semanticColors, null, 2)} as const\n`
    fs.writeFileSync(
      path.join(__dirname, '../src/semantic/colors.ts'),
      semanticColorsContent
    )
  }

  console.log('✅ Token files generated successfully!')
  console.log('- src/primitives/colors.ts')
  console.log('- src/semantic/colors.ts')
}

// Main execution
const consoleOutputPath = path.join(__dirname, '../figma-variables.json')

if (!fs.existsSync(consoleOutputPath)) {
  console.error('❌ figma-variables.json not found!')
  console.log('Please paste the console output into packages/tokens/figma-variables.json')
  process.exit(1)
}

const data: ConsoleOutput = JSON.parse(fs.readFileSync(consoleOutputPath, 'utf-8'))
processConsoleOutput(data)
