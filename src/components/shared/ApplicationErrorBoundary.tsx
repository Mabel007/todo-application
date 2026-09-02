import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches unexpected render errors in the application
 * and shows a safe fallback instead of a broken screen.
 */
export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  // Update the boundary state when a child component crashes.
  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  // Log technical details for debugging without showing them to the user.
  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Uncaught render error:", error, errorInfo);
  }

  // Clear the error state and try rendering the application again.
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="bg-background flex min-h-screen items-center justify-center px-6 text-center"
        >
          <section className="flex max-w-md flex-col items-center">
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">
              Something went wrong
            </h1>

            <p className="text-muted-foreground mt-2 text-sm leading-6">
              We couldn&apos;t display this page properly. Please try again.
            </p>

            <button
              type="button"
              onClick={this.handleReset}
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring mt-6 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Try again
            </button>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}
