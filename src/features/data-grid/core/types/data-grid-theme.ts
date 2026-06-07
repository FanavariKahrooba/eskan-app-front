export type DataGridThemeMode = 'light' | 'dark' | 'system';

export type DataGridThemeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface DataGridThemeTokens {
    fontFamily?: string;
    fontSize?: string | number;
    lineHeight?: string | number;

    colorText?: string;
    colorTextMuted?: string;
    colorBackground?: string;
    colorSurface?: string;
    colorBorder?: string;

    colorPrimary?: string;
    colorSuccess?: string;
    colorWarning?: string;
    colorDanger?: string;
    colorInfo?: string;

    rowHeight?: string | number;
    headerHeight?: string | number;
    footerHeight?: string | number;

    cellPaddingX?: string | number;
    cellPaddingY?: string | number;

    borderRadius?: string | number;
    borderWidth?: string | number;

    shadow?: string;

    zIndexHeader?: number;
    zIndexPinned?: number;
    zIndexOverlay?: number;

    [key: string]: string | number | undefined;
}

export interface DataGridTheme {
    mode?: DataGridThemeMode;
    size?: DataGridThemeSize;
    className?: string;
    tokens?: DataGridThemeTokens;
}

export interface DataGridThemeContextValue {
    theme: DataGridTheme;
    setTheme?: (theme: DataGridTheme) => void;
}
