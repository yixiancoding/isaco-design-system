# IsaCo Design System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a comprehensive design system monorepo with design tokens extracted from Figma, React components using Tailwind + Radix, Storybook documentation, and full test coverage.

**Architecture:** Turborepo monorepo with pnpm workspaces containing separate packages for tokens (@isaco/tokens), components (@isaco/components), and a Storybook app. Tokens are aliased in TypeScript source for consistency, then built to CSS variables for Tailwind consumption. Components use Radix primitives styled with Tailwind classes and CVA for variant management.

**Tech Stack:** TypeScript, React 18, Tailwind CSS, Radix UI, Turborepo, pnpm, Vitest, React Testing Library, Storybook 8, Chromatic, Changesets

---

## Task 1: Initialize Monorepo Structure

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `.gitignore`
- Create: `tsconfig.json`

**Step 1: Create new directory and initialize**

```bash
cd /Users/yixianli
mkdir isaco-design-system
cd isaco-design-system
git init
```

**Step 2: Create root package.json**

Create: `package.json`

```json
{
  "name": "isaco-design-system",
  "version": "0.0.0",
  "private": true,
  "description": "IsaCo Design System - Tokens, Components, and Documentation",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "test:watch": "turbo run test:watch",
    "test:coverage": "turbo run test:coverage",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "tokens:extract": "turbo run extract --filter=@isaco/tokens",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.1",
    "prettier": "^3.2.5",
    "turbo": "^1.12.4",
    "typescript": "^5.3.3"
  },
  "packageManager": "pnpm@8.15.4",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

**Step 3: Create pnpm workspace config**

Create: `pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**Step 4: Create Turborepo config**

Create: `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "storybook-static/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "test:watch": {
      "cache": false,
      "persistent": true
    },
    "test:coverage": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "extract": {
      "cache": false,
      "outputs": ["src/primitives/**", "src/semantic/**"]
    }
  }
}
```

**Step 5: Create .gitignore**

Create: `.gitignore`

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.lcov

# Build outputs
dist/
build/
.next/
out/
storybook-static/

# Misc
.DS_Store
*.pem
.env*.local
.turbo
.changeset/*.md
!.changeset/README.md

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
```

**Step 6: Create root tsconfig**

Create: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

**Step 7: Install dependencies**

```bash
pnpm install
```

Expected: Dependencies installed, lock file created

**Step 8: Commit initial setup**

```bash
git add .
git commit -m "chore: initialize monorepo with Turborepo and pnpm workspaces"
```

---

## Task 2: Set Up @isaco/tokens Package Structure

**Files:**
- Create: `packages/tokens/package.json`
- Create: `packages/tokens/tsconfig.json`
- Create: `packages/tokens/src/index.ts`
- Create: `packages/tokens/.gitignore`

**Step 1: Create tokens package directory**

```bash
mkdir -p packages/tokens/src/{primitives,semantic,build}
```

**Step 2: Create tokens package.json**

Create: `packages/tokens/package.json`

```json
{
  "name": "@isaco/tokens",
  "version": "0.1.0",
  "description": "Design tokens for IsaCo Design System",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./css": "./dist/variables.css",
    "./tailwind": "./dist/tailwind.preset.js",
    "./flat": "./dist/tokens-flat.json"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "extract": "tsx scripts/extract-figma.ts",
    "build": "pnpm run build:tokens && pnpm run build:package",
    "build:tokens": "tsx src/build/index.ts",
    "build:package": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "pnpm run build:package -- --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "@types/node": "^20.11.19",
    "tsup": "^8.0.2",
    "tsx": "^4.7.1",
    "typescript": "^5.3.3",
    "vitest": "^1.3.1"
  },
  "dependencies": {
    "dotenv": "^16.4.5"
  }
}
```

**Step 3: Create tokens tsconfig**

Create: `packages/tokens/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 4: Create placeholder index**

Create: `packages/tokens/src/index.ts`

```typescript
// Export primitives
export * from './primitives/colors'
export * from './primitives/typography'
export * from './primitives/spacing'

// Export semantic tokens
export * from './semantic/colors'
export * from './semantic/typography'
export * from './semantic/spacing'
```

**Step 5: Create tokens .gitignore**

Create: `packages/tokens/.gitignore`

```
dist/
node_modules/
.env
```

**Step 6: Install tokens dependencies**

```bash
cd packages/tokens
pnpm install
cd ../..
```

Expected: Dependencies installed

**Step 7: Commit tokens package setup**

```bash
git add packages/tokens
git commit -m "chore: set up @isaco/tokens package structure"
```

---

## Task 3: Create Figma Token Extraction Script

**Files:**
- Create: `packages/tokens/scripts/extract-figma.ts`
- Create: `packages/tokens/.env.example`

**Step 1: Create .env.example**

Create: `packages/tokens/.env.example`

```
FIGMA_ACCESS_TOKEN=your_figma_token_here
FIGMA_FILE_KEY=X2pyn0kiqYptrQLQ8ADGQU
```

**Step 2: Create extraction script**

Create: `packages/tokens/scripts/extract-figma.ts`

```typescript
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
```

**Step 3: Create README for token setup**

Create: `packages/tokens/README.md`

```markdown
# @isaco/tokens

Design tokens for IsaCo Design System.

## Setup

1. Copy `.env.example` to `.env`
2. Add your Figma access token
3. Run `pnpm extract` to pull tokens from Figma

## Usage

\`\`\`typescript
import { primitives, semantic } from '@isaco/tokens'
import '@isaco/tokens/css'
\`\`\`
```

**Step 4: Commit extraction script**

```bash
git add packages/tokens
git commit -m "feat(tokens): add Figma token extraction script"
```

---

## Task 4: Create Token Build Pipeline

**Files:**
- Create: `packages/tokens/src/build/index.ts`
- Create: `packages/tokens/src/build/generate-css-variables.ts`
- Create: `packages/tokens/src/build/generate-flat-tokens.ts`
- Create: `packages/tokens/src/build/generate-tailwind-preset.ts`

**Step 1: Create build utilities - CSS variables**

Create: `packages/tokens/src/build/generate-css-variables.ts`

```typescript
import * as fs from 'fs'
import * as path from 'path'

export function generateCSSVariables(tokens: Record<string, any>): string {
  let css = ':root {\n'

  function traverse(obj: any, prefix: string[] = []) {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = [...prefix, key]

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value, currentPath)
      } else {
        const varName = `--${currentPath.join('-')}`
        css += `  ${varName}: ${value};\n`
      }
    })
  }

  traverse(tokens)
  css += '}\n'
  return css
}

export function writeCSSFile(cssContent: string, outputPath: string) {
  fs.writeFileSync(outputPath, cssContent, 'utf-8')
  console.log(`✅ Generated ${path.basename(outputPath)}`)
}
```

**Step 2: Create build utilities - Flat tokens**

Create: `packages/tokens/src/build/generate-flat-tokens.ts`

```typescript
import * as fs from 'fs'

export function generateFlatTokens(tokens: Record<string, any>): Record<string, any> {
  const flat: Record<string, any> = {}

  function traverse(obj: any, prefix: string[] = []) {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = [...prefix, key]

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value, currentPath)
      } else {
        const tokenName = currentPath.join('-')
        flat[tokenName] = value
      }
    })
  }

  traverse(tokens)
  return flat
}

export function writeFlatTokensFile(tokens: Record<string, any>, outputPath: string) {
  fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2), 'utf-8')
  console.log(`✅ Generated tokens-flat.json`)
}
```

**Step 3: Create build utilities - Tailwind preset**

Create: `packages/tokens/src/build/generate-tailwind-preset.ts`

```typescript
import * as fs from 'fs'

export function generateTailwindPreset(tokens: Record<string, any>): string {
  const config = {
    theme: {
      extend: {} as Record<string, any>,
    },
  }

  function traverse(obj: any, prefix: string[] = [], isColor = false): Record<string, any> {
    const result: Record<string, any> = {}

    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = traverse(value, [...prefix, key], isColor || prefix[0] === 'color')
      } else {
        const varName = `--${[...prefix, key].join('-')}`
        result[key] = `var(${varName})`
      }
    })

    return result
  }

  // Process tokens into Tailwind config
  Object.entries(tokens).forEach(([category, values]) => {
    if (category === 'color') {
      config.theme.extend.colors = traverse(values as any, ['color'], true)
    } else if (category === 'spacing') {
      config.theme.extend.spacing = traverse(values as any, ['spacing'])
    } else if (category === 'fontSize') {
      config.theme.extend.fontSize = traverse(values as any, ['font-size'])
    } else if (category === 'fontWeight') {
      config.theme.extend.fontWeight = traverse(values as any, ['font-weight'])
    }
  })

  const presetCode = `module.exports = ${JSON.stringify(config, null, 2)}\n`
  return presetCode
}

export function writeTailwindPresetFile(presetCode: string, outputPath: string) {
  fs.writeFileSync(outputPath, presetCode, 'utf-8')
  console.log(`✅ Generated tailwind.preset.js`)
}
```

**Step 4: Create main build script**

Create: `packages/tokens/src/build/index.ts`

```typescript
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
```

**Step 5: Test the build (will fail without extracted tokens)**

```bash
cd packages/tokens
pnpm build:tokens
cd ../..
```

Expected: Error about missing token files (this is expected - we'll extract in next task)

**Step 6: Commit build pipeline**

```bash
git add packages/tokens
git commit -m "feat(tokens): add token build pipeline for CSS vars, flat JSON, and Tailwind preset"
```

---

## Task 5: Extract Tokens from Figma (Manual Step)

**Prerequisites:**
- Figma access token (create at figma.com/developers)
- Access to the Figma file

**Step 1: Create .env file**

```bash
cd packages/tokens
cp .env.example .env
# Edit .env and add your FIGMA_ACCESS_TOKEN
```

**Step 2: Run extraction**

```bash
pnpm extract
```

Expected: TypeScript files created in `src/primitives/` and `src/semantic/`

**Step 3: Verify extracted files**

```bash
ls -la src/primitives/
ls -la src/semantic/
```

Expected: `colors.ts`, `typography.ts`, `spacing.ts` in both directories

**Step 4: Build tokens**

```bash
pnpm build
cd ../..
```

Expected: `dist/` folder created with `variables.css`, `tokens-flat.json`, `tailwind.preset.js`

**Step 5: Commit extracted tokens**

```bash
git add packages/tokens
git commit -m "feat(tokens): extract design tokens from Figma"
```

---

## Task 6: Set Up @isaco/components Package

**Files:**
- Create: `packages/components/package.json`
- Create: `packages/components/tsconfig.json`
- Create: `packages/components/src/index.ts`
- Create: `packages/components/vitest.config.ts`
- Create: `packages/components/test/setup.ts`

**Step 1: Create components directory structure**

```bash
mkdir -p packages/components/{src,test}
```

**Step 2: Create components package.json**

Create: `packages/components/package.json`

```json
{
  "name": "@isaco/components",
  "version": "0.1.0",
  "description": "React components for IsaCo Design System",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts --external react --external react-dom",
    "dev": "pnpm run build -- --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "dependencies": {
    "@isaco/tokens": "workspace:*",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^14.2.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.2.58",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "@vitest/coverage-v8": "^1.3.1",
    "jsdom": "^24.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tsup": "^8.0.2",
    "typescript": "^5.3.3",
    "vitest": "^1.3.1"
  }
}
```

**Step 3: Create components tsconfig**

Create: `packages/components/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.tsx", "**/*.stories.tsx"]
}
```

**Step 4: Create Vitest config**

Create: `packages/components/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.stories.tsx',
        '**/*.test.tsx',
        'dist/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 5: Create test setup file**

Create: `packages/components/test/setup.ts`

```typescript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})
```

**Step 6: Create placeholder index**

Create: `packages/components/src/index.ts`

```typescript
// Components will be exported here
export * from './utils/cn'
```

**Step 7: Install dependencies**

```bash
cd packages/components
pnpm install
cd ../..
```

Expected: Dependencies installed

**Step 8: Commit components package setup**

```bash
git add packages/components
git commit -m "chore: set up @isaco/components package structure"
```

---

## Task 7: Create Shared Utilities

**Files:**
- Create: `packages/components/src/utils/cn.ts`
- Create: `packages/components/src/utils/cn.test.ts`

**Step 1: Write the failing test**

Create: `packages/components/src/utils/cn.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('merges Tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })

  it('handles arrays', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd packages/components
pnpm test cn.test.ts
cd ../..
```

Expected: FAIL - "Cannot find module './cn'"

**Step 3: Write minimal implementation**

Create: `packages/components/src/utils/cn.ts`

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Step 4: Run test to verify it passes**

```bash
cd packages/components
pnpm test cn.test.ts
cd ../..
```

Expected: PASS - All tests passing

**Step 5: Commit utility function**

```bash
git add packages/components/src/utils
git commit -m "feat(components): add cn utility for class merging"
```

---

## Task 8: Build Button Component

**Files:**
- Create: `packages/components/src/Button/Button.tsx`
- Create: `packages/components/src/Button/Button.test.tsx`
- Create: `packages/components/src/Button/index.ts`

**Step 1: Write the failing test**

Create: `packages/components/src/Button/Button.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-brand-primary')
  })

  it('applies size styles', () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('h-9')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('respects disabled state', async () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()

    await userEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('supports asChild prop with Slot', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    expect(screen.getByRole('link')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveTextContent('Link Button')
  })

  it('merges custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd packages/components
pnpm test Button.test.tsx
cd ../..
```

Expected: FAIL - "Cannot find module './Button'"

**Step 3: Write minimal implementation**

Create: `packages/components/src/Button/Button.tsx`

```typescript
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover',
        secondary: 'bg-neutral-surface text-neutral-text hover:bg-neutral-surface-hover',
        outline: 'border border-neutral-border bg-transparent hover:bg-neutral-surface',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
```

**Step 4: Create barrel export**

Create: `packages/components/src/Button/index.ts`

```typescript
export { Button, type ButtonProps } from './Button'
```

**Step 5: Run test to verify it passes**

```bash
cd packages/components
pnpm test Button.test.tsx
cd ../..
```

Expected: PASS - All tests passing

**Step 6: Update main index to export Button**

Modify: `packages/components/src/index.ts`

```typescript
// Components will be exported here
export * from './utils/cn'
export * from './Button'
```

**Step 7: Commit Button component**

```bash
git add packages/components/src
git commit -m "feat(components): add Button component with variants and tests"
```

---

## Task 9: Set Up Storybook

**Files:**
- Create: `apps/storybook/package.json`
- Create: `apps/storybook/.storybook/main.ts`
- Create: `apps/storybook/.storybook/preview.ts`
- Create: `packages/components/src/Button/Button.stories.tsx`

**Step 1: Create Storybook directory**

```bash
mkdir -p apps/storybook/.storybook
```

**Step 2: Create Storybook package.json**

Create: `apps/storybook/package.json`

```json
{
  "name": "@isaco/storybook",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build",
    "preview": "serve storybook-static"
  },
  "dependencies": {
    "@isaco/components": "workspace:*",
    "@isaco/tokens": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@chromatic-com/storybook": "^1.2.18",
    "@storybook/addon-a11y": "^8.0.0",
    "@storybook/addon-essentials": "^8.0.0",
    "@storybook/addon-themes": "^8.0.0",
    "@storybook/react": "^8.0.0",
    "@storybook/react-vite": "^8.0.0",
    "storybook": "^8.0.0",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35"
  }
}
```

**Step 3: Create Storybook main config**

Create: `apps/storybook/.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/react-vite'
import path from 'path'

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../../packages/*/src/**/*.stories.tsx',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@isaco/components': path.resolve(__dirname, '../../packages/components/src'),
          '@isaco/tokens': path.resolve(__dirname, '../../packages/tokens/src'),
        },
      },
    }
  },
}

export default config
```

**Step 4: Create Storybook preview config**

Create: `apps/storybook/.storybook/preview.ts`

```typescript
import type { Preview } from '@storybook/react'
import '@isaco/tokens/css'
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
```

**Step 5: Create Storybook Tailwind config**

Create: `apps/storybook/tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'
import isacoPreset from '@isaco/tokens/tailwind'

const config: Config = {
  presets: [isacoPreset],
  content: [
    './stories/**/*.{ts,tsx,mdx}',
    '../../packages/components/src/**/*.{ts,tsx}',
  ],
}

export default config
```

**Step 6: Create Storybook styles**

Create: `apps/storybook/styles.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 7: Create Button story**

Create: `packages/components/src/Button/Button.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
}

export const Outline: Story = {
  args: {
    children: 'Button',
    variant: 'outline',
  },
}

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}

export const AsLink: Story = {
  args: {
    asChild: true,
    children: <a href="#">Link styled as Button</a>,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <div className="flex gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex gap-4">
        <Button disabled>Disabled</Button>
      </div>
    </div>
  ),
}
```

**Step 8: Install Storybook dependencies**

```bash
cd apps/storybook
pnpm install
cd ../..
```

Expected: Dependencies installed

**Step 9: Test Storybook dev server**

```bash
cd apps/storybook
pnpm dev
```

Expected: Storybook running on http://localhost:6006
Manual: Open browser and verify Button component appears

**Step 10: Commit Storybook setup**

```bash
git add apps/storybook packages/components/src/Button/Button.stories.tsx
git commit -m "feat: set up Storybook with Button stories"
```

---

## Task 10: Set Up Changesets for Versioning

**Files:**
- Create: `.changeset/config.json`
- Create: `.changeset/README.md`

**Step 1: Initialize Changesets**

```bash
pnpm changeset init
```

Expected: `.changeset/` directory created

**Step 2: Configure Changesets**

Modify: `.changeset/config.json`

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@isaco/storybook"]
}
```

**Step 3: Test creating a changeset**

```bash
pnpm changeset
```

Manual prompts:
- Select packages changed: `@isaco/components`, `@isaco/tokens`
- Select version bump: `minor`
- Summary: "Initial release with Button component and design tokens"

**Step 4: Commit Changesets setup**

```bash
git add .changeset
git commit -m "chore: set up Changesets for versioning"
```

---

## Task 11: Set Up CI/CD Pipeline

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/release.yml`

**Step 1: Create CI workflow**

Create: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm build --filter="./packages/*"

      - name: Run tests
        run: pnpm test --filter="./packages/*"

      - name: Build Storybook
        run: pnpm build --filter="@isaco/storybook"
```

**Step 2: Create release workflow**

Create: `.github/workflows/release.yml`

```yaml
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm build --filter="./packages/*"

      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm version-packages
          commit: 'chore: version packages'
          title: 'chore: version packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Step 3: Commit CI/CD workflows**

```bash
git add .github
git commit -m "ci: add GitHub Actions workflows for testing and release"
```

---

## Task 12: Create Documentation

**Files:**
- Create: `README.md`
- Create: `packages/tokens/README.md`
- Create: `packages/components/README.md`
- Create: `apps/storybook/stories/Introduction.mdx`

**Step 1: Create root README**

Create: `README.md`

```markdown
# IsaCo Design System

A comprehensive design system built with Tailwind CSS and Radix UI.

## Packages

- **@isaco/tokens** - Design tokens (colors, typography, spacing)
- **@isaco/components** - React components
- **@isaco/storybook** - Component documentation

## Getting Started

### Installation

\`\`\`bash
pnpm install
\`\`\`

### Development

\`\`\`bash
# Build all packages
pnpm build

# Run Storybook
pnpm dev --filter=@isaco/storybook

# Run tests
pnpm test

# Extract tokens from Figma
pnpm tokens:extract
\`\`\`

## Usage

\`\`\`bash
npm install @isaco/tokens @isaco/components
\`\`\`

\`\`\`typescript
// tailwind.config.ts
import isacoPreset from '@isaco/tokens/tailwind'

export default {
  presets: [isacoPreset],
  content: ['./src/**/*.{ts,tsx}'],
}
\`\`\`

\`\`\`tsx
// app.tsx
import '@isaco/tokens/css'
import { Button } from '@isaco/components'

export default function App() {
  return <Button variant="primary">Click me</Button>
}
\`\`\`

## Architecture

- **Monorepo:** Turborepo + pnpm workspaces
- **Styling:** Tailwind CSS with CSS variables
- **Components:** Radix UI primitives + CVA
- **Testing:** Vitest + React Testing Library
- **Docs:** Storybook + Pencil.dev

## License

MIT
```

**Step 2: Create Storybook introduction**

Create: `apps/storybook/stories/Introduction.mdx`

```mdx
import { Meta } from '@storybook/blocks'

<Meta title="Introduction" />

# IsaCo Design System

Welcome to the IsaCo Design System documentation.

## Overview

IsaCo is a comprehensive design system built with modern web technologies:

- **React 18** - Component framework
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible primitives
- **TypeScript** - Type safety

## Getting Started

### Installation

\`\`\`bash
npm install @isaco/tokens @isaco/components
\`\`\`

### Setup Tailwind

\`\`\`typescript
// tailwind.config.ts
import isacoPreset from '@isaco/tokens/tailwind'

export default {
  presets: [isacoPreset],
  content: ['./src/**/*.{ts,tsx}'],
}
\`\`\`

### Import Styles

\`\`\`tsx
import '@isaco/tokens/css'
import '@isaco/components/styles.css'
\`\`\`

### Use Components

\`\`\`tsx
import { Button } from '@isaco/components'

function App() {
  return <Button variant="primary">Click me</Button>
}
\`\`\`

## Components

Browse the components in the sidebar to see examples, usage, and API documentation.
```

**Step 3: Commit documentation**

```bash
git add README.md apps/storybook/stories
git commit -m "docs: add README and Storybook introduction"
```

---

## Task 13: Build Additional Core Components (Input)

**Files:**
- Create: `packages/components/src/Input/Input.tsx`
- Create: `packages/components/src/Input/Input.test.tsx`
- Create: `packages/components/src/Input/Input.stories.tsx`
- Create: `packages/components/src/Input/index.ts`

**Step 1: Write the failing test**

Create: `packages/components/src/Input/Input.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'hello')

    expect(handleChange).toHaveBeenCalled()
  })

  it('respects disabled state', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('applies error styles', () => {
    render(<Input error />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('border-error')
  })

  it('merges custom className', () => {
    render(<Input className="custom-class" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('custom-class')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd packages/components
pnpm test Input.test.tsx
cd ../..
```

Expected: FAIL

**Step 3: Write implementation**

Create: `packages/components/src/Input/Input.tsx`

```typescript
import * as React from 'react'
import { cn } from '../utils/cn'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        className={cn(
          'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm',
          'placeholder:text-neutral-placeholder',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-error focus-visible:ring-error'
            : 'border-neutral-border focus-visible:ring-brand-primary',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
```

**Step 4: Create barrel export**

Create: `packages/components/src/Input/index.ts`

```typescript
export { Input, type InputProps } from './Input'
```

**Step 5: Run test to verify it passes**

```bash
cd packages/components
pnpm test Input.test.tsx
cd ../..
```

Expected: PASS

**Step 6: Create Input story**

Create: `packages/components/src/Input/Input.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: 'Hello world',
  },
}

export const Error: Story = {
  args: {
    placeholder: 'Enter text...',
    error: true,
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <Input placeholder="Default input" />
      <Input placeholder="With value" defaultValue="Hello world" />
      <Input placeholder="Error state" error />
      <Input placeholder="Disabled" disabled />
    </div>
  ),
}
```

**Step 7: Update main index**

Modify: `packages/components/src/index.ts`

```typescript
export * from './utils/cn'
export * from './Button'
export * from './Input'
```

**Step 8: Commit Input component**

```bash
git add packages/components/src
git commit -m "feat(components): add Input component with error state and tests"
```

---

## Task 14: Final Polish & README Updates

**Files:**
- Modify: `packages/components/README.md`
- Create: `CONTRIBUTING.md`

**Step 1: Create components README**

Create: `packages/components/README.md`

```markdown
# @isaco/components

React components for IsaCo Design System.

## Installation

\`\`\`bash
npm install @isaco/components @isaco/tokens
\`\`\`

## Setup

\`\`\`typescript
// tailwind.config.ts
import isacoPreset from '@isaco/tokens/tailwind'

export default {
  presets: [isacoPreset],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@isaco/components/dist/**/*.js',
  ],
}
\`\`\`

\`\`\`tsx
// app.tsx
import '@isaco/tokens/css'
import '@isaco/components/styles.css'
\`\`\`

## Usage

\`\`\`tsx
import { Button, Input } from '@isaco/components'

function LoginForm() {
  return (
    <div>
      <Input placeholder="Email" />
      <Button variant="primary">Sign In</Button>
    </div>
  )
}
\`\`\`

## Components

- **Button** - Primary, secondary, outline variants with size options
- **Input** - Text input with error state

## Development

See [Storybook](http://localhost:6006) for component documentation and examples.
```

**Step 2: Create contributing guide**

Create: `CONTRIBUTING.md`

```markdown
# Contributing to IsaCo Design System

## Development Workflow

### Setup

\`\`\`bash
pnpm install
pnpm build
\`\`\`

### Creating a New Component

1. Create component directory in \`packages/components/src/ComponentName/\`
2. Write failing tests in \`ComponentName.test.tsx\`
3. Implement component in \`ComponentName.tsx\`
4. Create Storybook stories in \`ComponentName.stories.tsx\`
5. Export from \`index.ts\`
6. Update \`packages/components/src/index.ts\`

### Testing

\`\`\`bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
\`\`\`

### Tokens

Extract tokens from Figma:

\`\`\`bash
# Set FIGMA_ACCESS_TOKEN in packages/tokens/.env
cd packages/tokens
pnpm extract
pnpm build
\`\`\`

### Versioning

\`\`\`bash
# Create a changeset
pnpm changeset

# Version packages
pnpm version-packages

# Publish
pnpm release
\`\`\`

## Code Style

- Use TypeScript strict mode
- Follow existing component patterns
- Write tests for all interactive behavior
- Add Storybook stories for all variants
- Use semantic token names in components

## Commit Convention

\`\`\`
feat(components): add Select component
fix(tokens): resolve alias chain correctly
docs: update README
chore: update dependencies
\`\`\`
```

**Step 3: Commit documentation**

```bash
git add packages/components/README.md CONTRIBUTING.md
git commit -m "docs: add component README and contributing guide"
```

---

## Execution Complete

All tasks have been implemented. The design system is now ready for:

1. **Token Extraction** - Run `pnpm tokens:extract` after setting up `.env`
2. **Development** - Run `pnpm dev --filter=@isaco/storybook`
3. **Testing** - Run `pnpm test`
4. **Building** - Run `pnpm build`

## Next Steps

1. Extract actual tokens from Figma
2. Add more components (Select, Dialog, Dropdown, etc.)
3. Set up Chromatic for visual regression
4. Configure npm registry for publishing
5. Create Pencil.dev integration script
6. Build additional documentation pages

## Recommended Component Build Order

After Button and Input:
1. **Label** - Simple text label component
2. **Select** - Dropdown using Radix Select
3. **Checkbox** - Toggle using Radix Checkbox
4. **Dialog** - Modal using Radix Dialog
5. **Tooltip** - Hover info using Radix Tooltip
