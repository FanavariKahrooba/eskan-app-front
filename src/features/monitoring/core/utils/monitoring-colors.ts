export type MonitoringSeverity = "normal" | "info" | "warning" | "danger" | "success";

export function getSeverityTone(severity: MonitoringSeverity) {
    switch (severity) {
        case "success":
            return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
        case "info":
            return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
        case "warning":
            return "text-amber-400 border-amber-500/30 bg-amber-500/10";
        case "danger":
            return "text-rose-400 border-rose-500/30 bg-rose-500/10";
        default:
            return "text-slate-300 border-white/10 bg-white/5";
    }
}

export function getOccupancySeverity(value: number): MonitoringSeverity {
    if (value >= 90) return "danger";
    if (value >= 75) return "warning";
    if (value >= 45) return "info";
    return "success";
}
