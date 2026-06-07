import { ShelterMonitoringSeverity } from "../types/shelter-monitoring.types";

export function getSeverityClasses(severity?: ShelterMonitoringSeverity) {
    switch (severity) {
        case "success":
            return {
                card: "border-emerald-500/20 bg-emerald-500/10",
                badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
                accent: "text-emerald-300",
            };
        case "info":
            return {
                card: "border-cyan-500/20 bg-cyan-500/10",
                badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
                accent: "text-cyan-300",
            };
        case "warning":
            return {
                card: "border-amber-500/20 bg-amber-500/10",
                badge: "bg-amber-500/15 text-amber-300 border-amber-500/20",
                accent: "text-amber-300",
            };
        case "danger":
            return {
                card: "border-rose-500/20 bg-rose-500/10",
                badge: "bg-rose-500/15 text-rose-300 border-rose-500/20",
                accent: "text-rose-300",
            };
        default:
            return {
                card: "border-white/10 bg-white/5",
                badge: "bg-white/10 text-white border-white/10",
                accent: "text-white",
            };
    }
}
