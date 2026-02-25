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

  function traverse(obj: any, prefix: string[] = [], useDirectValue = false): Record<string, any> {
    const result: Record<string, any> = {}

    Object.entries(obj).forEach(([key, value]) => {
      const sanitizedKey = sanitizeVariableName(key)

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[sanitizedKey] = traverse(value, [...prefix, sanitizedKey], useDirectValue)
      } else {
        // For spacing, borderRadius, fontFamily, fontWeight: use actual values
        // For colors: use CSS variable references
        if (useDirectValue) {
          result[sanitizedKey] = value
        } else {
          const varName = `--${[...prefix, sanitizedKey].join('-')}`
          result[sanitizedKey] = `var(${varName})`
        }
      }
    })

    return result
  }

  // Process tokens into Tailwind config
  Object.entries(tokens).forEach(([category, values]) => {
    if (category === 'color') {
      config.theme.extend.colors = traverse(values as any, ['color'], false)
    } else if (category === 'spacing') {
      config.theme.extend.spacing = traverse(values as any, ['spacing'], true)
    } else if (category === 'borderRadius') {
      config.theme.extend.borderRadius = traverse(values as any, ['border-radius'], true)
    } else if (category === 'fontFamily') {
      config.theme.extend.fontFamily = traverse(values as any, ['font-family'], true)
    } else if (category === 'fontWeight') {
      config.theme.extend.fontWeight = traverse(values as any, ['font-weight'], true)
    } else if (category === 'fontSize') {
      config.theme.extend.fontSize = traverse(values as any, ['font-size'], false)
    }
  })

  const presetCode = `module.exports = ${JSON.stringify(config, null, 2)}\n`
  return presetCode
}

export function writeTailwindPresetFile(presetCode: string, outputPath: string) {
  fs.writeFileSync(outputPath, presetCode, 'utf-8')
  console.log(`✅ Generated tailwind.preset.js`)
}
