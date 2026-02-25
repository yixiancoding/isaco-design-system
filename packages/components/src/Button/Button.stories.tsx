import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Button hierarchy: primary (highest emphasis), secondary (medium), tertiary (low emphasis)',
    },
    sentiment: {
      control: 'select',
      options: ['admin', 'consumer', 'negative', 'positive', 'inverse'],
      description: 'Color sentiment indicating action type',
    },
    size: {
      control: 'select',
      options: ['default', 'small'],
      description: 'Button size: default (48px) or small (32px)',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner when true',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// Basic variants
export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    sentiment: 'consumer',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
    sentiment: 'consumer',
  },
}

export const Tertiary: Story = {
  args: {
    children: 'Button',
    variant: 'tertiary',
    sentiment: 'consumer',
  },
}

// Sizes
export const DefaultSize: Story = {
  args: {
    children: 'Default Button',
    size: 'default',
  },
}

export const SmallSize: Story = {
  args: {
    children: 'Small Button',
    size: 'small',
  },
}

// States
export const Loading: Story = {
  args: {
    children: 'Loading',
    loading: true,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}

// All sentiments
export const AllSentiments: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold">Primary Variants</h3>
      <div className="flex gap-4">
        <Button variant="primary" sentiment="admin">Admin</Button>
        <Button variant="primary" sentiment="consumer">Consumer</Button>
        <Button variant="primary" sentiment="negative">Negative</Button>
        <Button variant="primary" sentiment="positive">Positive</Button>
      </div>

      <h3 className="font-semibold mt-4">Secondary Variants</h3>
      <div className="flex gap-4">
        <Button variant="secondary" sentiment="admin">Admin</Button>
        <Button variant="secondary" sentiment="consumer">Consumer</Button>
        <Button variant="secondary" sentiment="negative">Negative</Button>
        <Button variant="secondary" sentiment="positive">Positive</Button>
      </div>

      <h3 className="font-semibold mt-4">Tertiary Variants</h3>
      <div className="flex gap-4">
        <Button variant="tertiary" sentiment="admin">Admin</Button>
        <Button variant="tertiary" sentiment="consumer">Consumer</Button>
        <Button variant="tertiary" sentiment="negative">Negative</Button>
        <Button variant="tertiary" sentiment="positive">Positive</Button>
      </div>
    </div>
  ),
}

// Inverse variants (on dark background)
export const InverseVariants: Story = {
  render: () => (
    <div className="bg-neutral-neutral-background-inverse p-8 flex flex-col gap-4">
      <div className="flex gap-4">
        <Button variant="primary" sentiment="inverse">Primary Inverse</Button>
        <Button variant="secondary" sentiment="inverse">Secondary Inverse</Button>
        <Button variant="tertiary" sentiment="inverse">Tertiary Inverse</Button>
      </div>
    </div>
  ),
}

// All sizes
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button size="default">Default (48px)</Button>
        <Button size="small">Small (32px)</Button>
      </div>
    </div>
  ),
}

// States showcase
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button>Default</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  ),
}

// With icons (using text icons as placeholders)
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button variant="primary" sentiment="consumer">
          + Add Item
        </Button>
        <Button variant="secondary" sentiment="admin">
          ✓ Save Changes
        </Button>
        <Button variant="tertiary" sentiment="negative">
          × Cancel
        </Button>
      </div>
    </div>
  ),
}

// Comprehensive showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Button Variants</h2>
        <p className="text-sm text-neutral-neutral-text-medium mb-4">
          Choose the correct button based on the hierarchy of actions:
        </p>
        <ul className="text-sm text-neutral-neutral-text-medium mb-6 list-disc list-inside">
          <li><strong>Primary:</strong> The most important action (use only once per page)</li>
          <li><strong>Secondary:</strong> Standard actions (can be used multiple times)</li>
          <li><strong>Tertiary:</strong> Low emphasis actions (e.g., Cancel)</li>
        </ul>
      </div>

      <div className="grid gap-8">
        {(['default', 'small'] as const).map((size) => (
          <div key={size}>
            <h3 className="font-semibold mb-4 capitalize">{size} Size</h3>

            {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
              <div key={variant} className="mb-4">
                <h4 className="text-sm font-medium mb-2 capitalize">{variant}</h4>
                <div className="flex gap-3 flex-wrap">
                  {(['admin', 'consumer', 'negative', 'positive'] as const).map((sentiment) => (
                    <Button key={sentiment} variant={variant} sentiment={sentiment} size={size}>
                      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
}
