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
