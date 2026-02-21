import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

config()

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY

if (!FIGMA_ACCESS_TOKEN || !FIGMA_FILE_KEY) {
  console.error('Error: FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY must be set in .env')
  process.exit(1)
}

interface FigmaVariable {
  id: string
  name: string
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN'
  valuesByMode: Record<string, any>
}

interface FigmaVariableCollection {
  id: string
  name: string
  modes: Array<{ modeId: string; name: string }>
  variableIds: string[]
}

async function fetchFigmaVariables() {
  const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`

  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': FIGMA_ACCESS_TOKEN!,
    },
  })

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

function resolveAlias(
  value: any,
  variables: Record<string, FigmaVariable>
): any {
  if (value?.type === 'VARIABLE_ALIAS') {
    const aliasedVariable = variables[value.id]
    if (!aliasedVariable) return value

    // Get the first mode's value (or default mode)
    const firstModeValue = Object.values(aliasedVariable.valuesByMode)[0]
    return resolveAlias(firstModeValue, variables)
  }
  return value
}

function rgbaToHex(rgba: { r: number; g: number; b: number; a: number }): string {
  const r = Math.round(rgba.r * 255)
  const g = Math.round(rgba.g * 255)
  const b = Math.round(rgba.b * 255)

  if (rgba.a < 1) {
    const a = Math.round(rgba.a * 255)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a.toString(16).padStart(2, '0')}`.toUpperCase()
  }

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase()
}

function formatValue(value: any, type: string): any {
  if (type === 'COLOR' && value.r !== undefined) {
    return rgbaToHex(value)
  }
  return value
}

async function extractTokens() {
  console.log('Fetching variables from Figma...')
  const data = await fetchFigmaVariables()

  const { meta } = data
  const variables: Record<string, FigmaVariable> = meta.variables
  const collections: Record<string, FigmaVariableCollection> = meta.variableCollections

  // Organize tokens by collection and type
  const primitiveColors: Record<string, any> = {}
  const semanticColors: Record<string, any> = {}
  const primitiveTypography: Record<string, any> = {}
  const semanticTypography: Record<string, any> = {}
  const primitiveSpacing: Record<string, any> = {}
  const semanticSpacing: Record<string, any> = {}

  Object.values(variables).forEach((variable) => {
    const nameParts = variable.name.split('/')
    const firstMode = Object.keys(variable.valuesByMode)[0]
    const rawValue = variable.valuesByMode[firstMode]
    const resolvedValue = resolveAlias(rawValue, variables)
    const formattedValue = formatValue(resolvedValue, variable.resolvedType)

    // Categorize by name pattern (customize based on your Figma structure)
    const isPrimitive = nameParts[0]?.toLowerCase().includes('primitive') ||
                       nameParts[0]?.toLowerCase().includes('base')
    const isSemantic = !isPrimitive

    if (variable.resolvedType === 'COLOR') {
      const target = isPrimitive ? primitiveColors : semanticColors
      setNestedValue(target, nameParts, formattedValue)
    } else if (variable.name.includes('spacing') || variable.name.includes('gap')) {
      const target = isPrimitive ? primitiveSpacing : semanticSpacing
      setNestedValue(target, nameParts, `${formattedValue}rem`)
    } else if (variable.name.includes('font') || variable.name.includes('text')) {
      const target = isPrimitive ? primitiveTypography : semanticTypography
      setNestedValue(target, nameParts, formattedValue)
    }
  })

  // Write TypeScript files
  writeTokenFile('primitives/colors.ts', primitiveColors, 'primitives')
  writeTokenFile('semantic/colors.ts', semanticColors, 'semantic', true)
  writeTokenFile('primitives/typography.ts', primitiveTypography, 'typographyPrimitives')
  writeTokenFile('semantic/typography.ts', semanticTypography, 'semanticTypography', true)
  writeTokenFile('primitives/spacing.ts', primitiveSpacing, 'spacingPrimitives')
  writeTokenFile('semantic/spacing.ts', semanticSpacing, 'semanticSpacing', true)

  console.log('✅ Token extraction complete!')
}

function setNestedValue(obj: any, path: string[], value: any) {
  const last = path.pop()!
  const target = path.reduce((o, key) => {
    if (!o[key]) o[key] = {}
    return o[key]
  }, obj)
  target[last] = value
}

function writeTokenFile(
  filePath: string,
  data: Record<string, any>,
  exportName: string,
  addImport = false
) {
  const fullPath = path.join(__dirname, '..', 'src', filePath)
  const dir = path.dirname(fullPath)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  let content = ''

  if (addImport && filePath.includes('semantic')) {
    const primitiveType = filePath.split('/')[1].replace('.ts', '')
    content += `import { ${primitiveType === 'colors' ? 'primitives' : primitiveType.replace('s', 'Primitives')} } from '../primitives/${primitiveType}'\n\n`
  }

  content += `export const ${exportName} = ${JSON.stringify(data, null, 2)} as const\n`

  fs.writeFileSync(fullPath, content, 'utf-8')
  console.log(`✅ Wrote ${filePath}`)
}

extractTokens().catch((error) => {
  console.error('Error extracting tokens:', error)
  process.exit(1)
})
