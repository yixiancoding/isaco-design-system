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
