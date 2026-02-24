import * as fs from 'fs'

function sanitizeVariableName(name: string): string {
  return name
    .replace(/\n/g, '-')  // Replace newlines with hyphens
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/[^\w-]/g, '')  // Remove special chars except word chars and hyphens
    .replace(/-+/g, '-')  // Collapse multiple hyphens
    .replace(/^-|-$/g, '')  // Remove leading/trailing hyphens
    .toLowerCase()
}

export function generateTailwindPreset(tokens: Record<string, any>): string {
  const config = {
    theme: {
      extend: {} as Record<string, any>,
    },
  }

  function traverse(obj: any, prefix: string[] = [], isColor = false): Record<string, any> {
    const result: Record<string, any> = {}

    Object.entries(obj).forEach(([key, value]) => {
      const sanitizedKey = sanitizeVariableName(key)

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[sanitizedKey] = traverse(value, [...prefix, sanitizedKey], isColor || prefix[0] === 'color')
      } else {
        const varName = `--${[...prefix, sanitizedKey].join('-')}`
        result[sanitizedKey] = `var(${varName})`
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
