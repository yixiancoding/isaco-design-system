# Color Token Extraction via Figma Console MCP

This design system uses the **Figma Console MCP** server for color token extraction instead of API scripts.

## Source Configuration

- **Figma File:** `https://figma.com/design/OaexHHjT4CAAUHH2wtjU2C` (Colors only)
- **Collections:**
  - `Ts1 primitive` → `src/primitives/colors.ts`
  - `Web semantic` → `src/semantic/colors.ts`
- **Other tokens:** Typography and spacing managed separately

## How to Extract Color Tokens

### Prerequisites
1. **Figma Desktop** app installed and running
2. **Figma Desktop Bridge plugin** running in your Figma file
   - Right-click in Figma → Plugins → Development → Figma Desktop Bridge
3. Open your color tokens file: `https://figma.com/design/OaexHHjT4CAAUHH2wtjU2C`

### Extraction Process

Ask Claude Code to extract color tokens:
```
"Extract color tokens from Figma - Ts1 primitive and Web semantic collections"
```

Claude will:
1. Use `figma_get_variables` to fetch variables from Figma Desktop
2. Filter for `Ts1 primitive` and `Web semantic` collections only
3. Process and organize colors into primitives/semantic structure
4. Generate TypeScript files in `src/primitives/colors.ts` and `src/semantic/colors.ts`
5. Run the build pipeline to create CSS variables, Tailwind preset, and flat JSON

### After Extraction

Build the tokens package:
```bash
cd packages/tokens
pnpm build
```

This generates:
- `dist/variables.css` - CSS custom properties
- `dist/tailwind.preset.js` - Tailwind configuration
- `dist/tokens-flat.json` - Flat token structure

## What Changed

**Before:** Manual API script requiring `FIGMA_ACCESS_TOKEN` in `.env`
**Now:** MCP-based extraction through Claude Code with Figma Desktop Bridge

**Benefits:**
- ✅ No API token management
- ✅ Real-time data from Figma Desktop
- ✅ Simpler workflow
- ✅ Integrated with Claude Code
