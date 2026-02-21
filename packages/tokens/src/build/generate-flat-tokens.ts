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
