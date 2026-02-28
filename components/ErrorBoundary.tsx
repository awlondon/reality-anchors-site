'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Optional label shown in the fallback (e.g. "hero", "dashboard") */
  section?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render errors in any child component tree.
 * Prevents a single component crash from taking down the entire page.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error(`[ErrorBoundary${this.props.section ? ` – ${this.props.section}` : ''}]`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex items-center justify-center py-16 px-6 text-center"
        >
          <p className="text-sm text-muted">
            This section could not be loaded.{' '}
            <button
              className="underline text-accent hover:text-blue-400 transition-colors"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
