export type MonitoringTheme = "dark" | "light";

export type MonitoringDensity = "comfortable" | "compact" | "tv";

export interface MonitoringShellProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    fullscreenTargetId?: string;
    className?: string;
    contentClassName?: string;
    tvMode?: boolean;
}
