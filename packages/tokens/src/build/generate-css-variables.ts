import * as fs from 'fs'
import * as path from 'path'

function sanitizeVariableName(name: string): string {
  return name
    .replace(/\n/g, '-')  // Replace newlines with hyphens
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/[^\w-]/g, '')  // Remove special chars except word chars and hyphens
    .replace(/-+/g, '-')  // Collapse multiple hyphens
    .replace(/^-|-$/g, '')  // Remove leading/trailing hyphens
    .toLowerCase()
}

export function generateCSSVariables(tokens: Record<string, any>): string {
  let css = ':root {\n'

  function traverse(obj: any, prefix: string[] = []) {
    Object.entries(obj).forEach(([key, value]) => {
      const sanitizedKey = sanitizeVariableName(key)
      const currentPath = [...prefix, sanitizedKey]

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
