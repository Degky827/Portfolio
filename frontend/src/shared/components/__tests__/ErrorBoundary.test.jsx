import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '../ErrorBoundary'

function ThrowingComponent() {
  throw new Error('Test error')
}

function SafeComponent() {
  return <div>Safe content</div>
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Safe content')).toBeInTheDocument()
  })

  it('renders error UI when child throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
    expect(screen.getByText('Reload Page')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('renders fallback message when error has no message', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    function ThrowingNoMessage() {
      throw new Error()
    }

    render(
      <ErrorBoundary>
        <ThrowingNoMessage />
      </ErrorBoundary>
    )

    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('calls reload on button click', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    )

    fireEvent.click(screen.getByText('Reload Page'))

    expect(reloadSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
    reloadSpy.mockRestore()
  })
})
