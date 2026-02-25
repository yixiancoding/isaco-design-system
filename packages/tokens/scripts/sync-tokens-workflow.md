# Color Tokens Sync Workflow - Figma to Code

This workflow extracts **color variables only** from Figma, compares them with existing code, shows differences, and updates files after review.

## Source Configuration

- **Figma File:** `https://figma.com/design/OaexHHjT4CAAUHH2wtjU2C` (Colors only)
- **Collections to extract:**
  - `Ts1 primitive` → `src/primitives/colors.ts`
  - `Web semantic` → `src/semantic/colors.ts`
- **Other collections:** Ignored (typography, spacing, etc. managed separately)

## Prerequisites

1. **Figma Desktop** running with color tokens file open
2. **Desktop Bridge plugin** active (Plugins → Development → Figma Desktop Bridge)
3. Ensure both collections are visible in Figma

## Workflow Steps

### Step 1: Request Color Token Sync

Ask Claude Code:
```
"Sync color tokens from Figma - compare Ts1 primitive and Web semantic collections with code"
```

### Step 2: Claude Will Automatically:

1. **Extract from Figma**
   - Use `figma_get_variables` MCP tool
   - Fetch variables from collections: `Ts1 primitive` and `Web semantic`
   - Filter out other collections (typography, spacing, etc.)
   - Resolve color aliases and convert RGBA to hex

2. **Read Current Code**
   - Read `src/primitives/colors.ts` (Ts1 primitive collection)
   - Read `src/semantic/colors.ts` (Web semantic collection)
   - Parse current color token structure

3. **Generate Comparison Report**
   - Show colors **added** in Figma (not in code)
   - Show colors **removed** in code (not in Figma)
   - Show colors **modified** (hex value changes)
   - Show colors **unchanged**

4. **Present for Review**
   - Display summary statistics
   - Show detailed diff for each category
   - Highlight breaking changes (removed tokens)

### Step 3: Review and Approve

You review the comparison report and decide:
- ✅ "Apply all changes" - Update code to match Figma
- ✅ "Apply only additions" - Add new tokens, keep existing
- ✅ "Apply only modifications" - Update changed tokens, keep new code-only tokens
- ❌ "Cancel" - Keep code as-is

### Step 4: Claude Updates Files

After approval, Claude will:
1. Write updated TypeScript files:
   - `src/primitives/colors.ts` (if Ts1 primitive changed)
   - `src/semantic/colors.ts` (if Web semantic changed)
2. Preserve file structure and formatting
3. Update only the files that changed
4. Run `pnpm build` to regenerate CSS/Tailwind/JSON outputs

### Step 5: Verify Changes

```bash
# Review git diff
git diff packages/tokens/src

# Build tokens
cd packages/tokens
pnpm build

# Verify outputs
ls -lh dist/
```

## Comparison Report Format

```
═══════════════════════════════════════════════
  FIGMA COLOR TOKENS SYNC REPORT
═══════════════════════════════════════════════

Collections:
  📦 Ts1 primitive  → primitives/colors.ts
  📦 Web semantic   → semantic/colors.ts

Summary:
  ✅ Unchanged:  450 colors
  ➕ Added:      12 colors (new in Figma)
  ✏️  Modified:   8 colors (hex value changes)
  ❌ Removed:     3 colors (missing from Figma)

═══════════════════════════════════════════════

➕ ADDED COLORS (12)
───────────────────────────────────────────────
[Ts1 primitive]
  neutral/50       → #FAFAFA
  neutral/950      → #0A0A0A

[Web semantic]
  color/brand/accent       → #FF6B35
  color/semantic/info-bg   → #E3F2FD
  color/feedback/warning   → #FFA726
  ...

✏️  MODIFIED COLORS (8)
───────────────────────────────────────────────
[Ts1 primitive]
  blue/500
    WAS: #1976D2
    NOW: #2196F3

[Web semantic]
  color/brand/primary
    WAS: #1976D2
    NOW: #2196F3  (alias updated)

  color/surface/hover
    WAS: #F5F5F5
    NOW: #FAFAFA
  ...

❌ REMOVED COLORS (3) ⚠️  BREAKING
───────────────────────────────────────────────
[Web semantic]
  color/deprecated/old-primary   (was: #0D47A1)
  color/semantic/legacy-bg       (was: #F5F5F5)
  color/brand/old-accent         (was: #FF5722)

  ⚠️  These colors exist in code but not in Figma.
      Removing them may break components using these values.

═══════════════════════════════════════════════
```

## Safety Features

- **No automatic updates** - Always requires explicit approval
- **Git-friendly** - Creates clean diffs for review
- **Breaking change warnings** - Highlights removed tokens
- **Rollback ready** - Can `git checkout` to undo
- **Build verification** - Runs build after updates to catch errors

## Typical Usage

**Initial setup (first time):**
```
"Sync color tokens from Figma"
→ Review large initial diff (450+ colors)
→ Approve changes
→ Run `pnpm build`
→ Commit: "chore(tokens): sync colors from Figma"
```

**Regular updates (after design changes):**
```
"Sync color tokens from Figma"
→ Review incremental changes (usually 5-20 colors)
→ Approve if looks good
→ Build and commit
```

**Note:** Typography and spacing tokens are managed separately (different Figma files or manual updates).

## Troubleshooting

**"Desktop Bridge not connected"**
- Re-import the plugin: Plugins → Development → Import plugin from manifest
- Manifest location: `/Users/isali/.npm/_npx/b547afed9fcf6dcb/node_modules/figma-console-mcp/figma-desktop-bridge/manifest.json`

**"Some tokens missing from Figma"**
- Check if the Figma file has all collections visible
- Verify you're on the correct Figma file
- Some tokens might be in a different mode (Light/Dark)

**"Build fails after sync"**
- Check the error message - likely a formatting issue
- Review `src/build/index.ts` - might need to handle new token types
- Rollback with `git checkout packages/tokens/src`

---

## Quick Reference

**Figma File:** `https://figma.com/design/OaexHHjT4CAAUHH2wtjU2C` (Colors only)
**Collections:** `Ts1 primitive` + `Web semantic`
**Target Files:** `src/primitives/colors.ts` + `src/semantic/colors.ts`

**Ready to sync?** Just say: `"Sync color tokens from Figma"`
