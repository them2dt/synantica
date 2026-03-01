'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Props for the ErrorBoundary component
 */
interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<ErrorFallbackProps>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    resetKeys?: Array<string | number>;
    resetOnPropsChange?: boolean;
}

/**
 * Props for the error fallback component
 */
interface ErrorFallbackProps {
    error: Error;
    resetError: () => void;
    retryCount: number;
}

/**
 * Default error fallback component
 */
function DefaultErrorFallback({
    error,
    resetError,
    retryCount,
}: ErrorFallbackProps) {
    return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-none bg-destructive/10">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle className="text-xl">Something went wrong</CardTitle>
                    <CardDescription>
                        We&apos;re sorry, but something unexpected happened. Please try again.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {process.env.NODE_ENV === 'development' && (
                        <details className="rounded-none bg-muted p-3">
                            <summary className="cursor-pointer text-sm">
                                Error Details (Development)
                            </summary>
                            <pre className="mt-2 text-xs text-muted-foreground overflow-auto whitespace-pre-wrap">
                                {error.message}
                                {error.stack && `\n\n${error.stack}`}
                            </pre>
                        </details>
                    )}
                    <div className="flex flex-col gap-2">
                        <Button onClick={resetError} className="w-full">
                            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                        </Button>
                        {retryCount > 0 && (
                            <p className="text-xs text-muted-foreground text-center">
                                Retry attempt: {retryCount}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

/**
 * Error boundary state interface
 */
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    retryCount: number;
}

/**
 * ErrorBoundary component for catching and handling React errors
 * Provides a fallback UI when errors occur in the component tree
 */
export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    private resetTimeoutId: NodeJS.Timeout | null = null;

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            retryCount: 0,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by ErrorBoundary:', error, errorInfo);
        }

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps) {
        const { resetKeys, resetOnPropsChange } = this.props;
        const { hasError } = this.state;

        // Reset error boundary when resetKeys change
        if (hasError && resetKeys && prevProps.resetKeys) {
            const hasResetKeyChanged = resetKeys.some(
                (key, index) => key !== prevProps.resetKeys![index]
            );
            if (hasResetKeyChanged) {
                this.resetError();
            }
        }

        // Reset error boundary when any prop changes (if enabled)
        if (hasError && resetOnPropsChange) {
            const hasPropsChanged = Object.keys(this.props).some(
                (key) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (this.props as any)[key] !== (prevProps as any)[key]
            );
            if (hasPropsChanged) {
                this.resetError();
            }
        }
    }

    componentWillUnmount() {
        if (this.resetTimeoutId) {
            clearTimeout(this.resetTimeoutId);
        }
    }

    resetError = () => {
        if (this.resetTimeoutId) {
            clearTimeout(this.resetTimeoutId);
        }
        this.setState((prevState) => ({
            hasError: false,
            error: null,
            retryCount: prevState.retryCount + 1,
        }));
    };

    render() {
        const { hasError, error, retryCount } = this.state;
        const { children, fallback: Fallback = DefaultErrorFallback } = this.props;

        if (hasError && error) {
            return (
                <Fallback
                    error={error}
                    resetError={this.resetError}
                    retryCount={retryCount}
                />
            );
        }

        return children;
    }
}
