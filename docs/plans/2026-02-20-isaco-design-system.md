# IsaCo Design System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a comprehensive design system monorepo with design tokens extracted from Figma, React components using Tailwind + Radix, Storybook documentation, and full test coverage.

**Architecture:** Turborepo monorepo with pnpm workspaces containing separate packages for tokens (@isaco/tokens), components (@isaco/components), and a Storybook app. Tokens are aliased in TypeScript source for consistency, then built to CSS variables for Tailwind consumption. Components use Radix primitives styled with Tailwind classes and CVA for variant management.

**Tech Stack:** TypeScript, React 18, Tailwind CSS, Radix UI, Turborepo, pnpm, Vitest, React Testing Library, Storybook 8, Chromatic, Changesets

---

## Progress Summary

**✅ Completed:**
- Tasks 1-8: Monorepo setup, token extraction, build pipeline, components package, Button component
- Extracted 475+ design tokens from Figma (colors, typography, spacing, radius)
- Figma API access configured with proper permissions

**⏭️ Remaining:**
- Tasks 9-14: Storybook setup, Changesets, CI/CD, documentation, additional components

---

## Completed Tasks (1-8)

### Task 1-2: Monorepo & Tokens Package Setup ✅
- Initialized Turborepo monorepo with pnpm workspaces
- Created @isaco/tokens package structure
- See existing code in `/packages/tokens`

### Task 3-4: Token Extraction & Build Pipeline ✅
- **MCP-based token sync workflow** (replaced old API script)
- Build pipeline generates CSS variables, Tailwind preset, and flat JSON
- See: `packages/tokens/scripts/sync-tokens-workflow.md`
- Usage: Ask Claude to "Sync design tokens from Figma"

### Task 5: Extract Tokens from Figma ✅
- Extracted 475+ design tokens (colors, typography, spacing, radius)
- Figma API permissions configured
- Tokens processed and built successfully

### Task 6-7: Components Package & Utilities ✅
- Created @isaco/components package with Vitest setup
- Implemented `cn` utility for className merging
- See existing code in `/packages/components`

### Task 8: Button Component ✅
- Built Button with variants (primary, secondary, outline) and sizes (sm, md, lg)
- Full test coverage with Vitest + React Testing Library
- Supports Radix Slot pattern for `asChild` prop

---

## Remaining Tasks (9-14)

### Task 9: Set Up Storybook
**Actions:**
1. Create `apps/storybook` directory structure
2. Install Storybook 8 with React Vite framework
3. Configure Tailwind with @isaco/tokens preset
4. Add Button stories
5. Test: `pnpm dev --filter=@isaco/storybook`

**Key Files:** `apps/storybook/.storybook/main.ts`, `preview.ts`, `tailwind.config.ts`

### Task 10: Set Up Changesets
**Actions:**
1. Run `pnpm changeset init`
2. Configure `.changeset/config.json` to ignore Storybook app
3. Test creating a changeset

**Purpose:** Version management and changelog generation

### Task 11: CI/CD Pipeline
**Actions:**
1. Create `.github/workflows/ci.yml` - Run tests, builds on PRs
2. Create `.github/workflows/release.yml` - Automated Changesets publishing

**Requirements:** Configure `NPM_TOKEN` secret for publishing

### Task 12: Documentation
**Actions:**
1. Create root `README.md` with architecture overview
2. Create `apps/storybook/stories/Introduction.mdx`
3. Update package READMEs with installation/usage

### Task 13: Input Component
**Actions:**
1. Write failing tests in `Input.test.tsx`
2. Implement Input component with error state
3. Create Input stories
4. Export from `packages/components/src/index.ts`

**Pattern:** Follow TDD approach like Button component

### Task 14: Final Polish
**Actions:**
1. Create `CONTRIBUTING.md` with development workflow
2. Update `packages/components/README.md`
3. Verify all tests pass and builds succeed

---

## Quick Commands

```bash
# Extract tokens from Figma
pnpm tokens:extract

# Run Storybook
pnpm dev --filter=@isaco/storybook

# Run all tests
pnpm test

# Build all packages
pnpm build
```

## Next Components to Build

After completing Tasks 9-14, add these components following the same TDD pattern:
1. **Label** - Simple text label
2. **Select** - Dropdown (Radix Select)
3. **Checkbox** - Toggle (Radix Checkbox)
4. **Dialog** - Modal (Radix Dialog)
5. **Tooltip** - Hover info (Radix Tooltip)
