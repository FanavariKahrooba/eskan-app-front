export interface NormalizedError {
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;
    raw: unknown;
}

export const normalizeError = (error: unknown): NormalizedError => {
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
            cause: 'cause' in error ? (error as Error & { cause?: unknown }).cause : undefined,
            raw: error,
        };
    }

    if (typeof error === 'string') {
        return {
            name: 'Error',
            message: error,
            raw: error,
        };
    }

    return {
        name: 'UnknownError',
        message: 'An unknown error occurred.',
        raw: error,
    };
};
