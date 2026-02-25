import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    render(<Button variant="primary" sentiment="consumer">Primary</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-consumer-action-consumer-action-background')
  })

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary" sentiment="admin">Secondary</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('border-admin-action-admin-action-border')
  })

  it('applies tertiary variant styles', () => {
    render(<Button variant="tertiary" sentiment="negative">Tertiary</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-transparent')
  })

  it('applies sentiment styles', () => {
    render(<Button sentiment="admin">Admin</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('admin-action')
  })

  it('applies default size styles', () => {
    render(<Button size="default">Default</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('h-12')
  })

  it('applies small size styles', () => {
    render(<Button size="small">Small</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('h-8')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('respects disabled state', async () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()

    await userEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button.textContent).toContain('⏳')
  })

  it('disables button when loading', async () => {
    const handleClick = vi.fn()
    render(<Button loading onClick={handleClick}>Loading</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()

    await userEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('supports asChild prop with Slot', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    expect(screen.getByRole('link')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveTextContent('Link Button')
  })

  it('merges custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
  })

  it('uses consumer sentiment by default', () => {
    render(<Button>Default Sentiment</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('consumer-action')
  })

  it('uses primary variant by default', () => {
    render(<Button>Default Variant</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-consumer-action-consumer-action-background')
  })

  it('uses default size by default', () => {
    render(<Button>Default Size</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('h-12')
  })

  it('applies rounded-full border radius', () => {
    render(<Button>Rounded</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('rounded-full')
  })
})
