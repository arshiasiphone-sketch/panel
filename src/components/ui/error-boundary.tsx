import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary — catches render errors in its subtree and shows a
 * fallback UI instead of unmounting the entire tree.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <YourComponent />
 *   </ErrorBoundary>
 *
 * With custom fallback:
 *   <ErrorBoundary fallback={<p>Something broke</p>}>
 *     <YourComponent />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(this.state.error, this.handleReset);
      }
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      // Default fallback
      return (
        <div
          dir="rtl"
          className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center mx-4 my-4"
        >
          <div className="h-10 w-10 rounded-full bg-destructive/10 grid place-items-center mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-destructive">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">این بخش با خطا مواجه شد</p>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            خطایی در بارگذاری این بخش رخ داد. می‌توانید دوباره تلاش کنید.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:bg-foreground/90 transition"
          >
            تلاش مجدد
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
