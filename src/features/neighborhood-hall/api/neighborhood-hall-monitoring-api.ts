import type { MonitoringDashboardResponse } from "../types/neighborhood-hall-monitoring-types";

function randomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

function buildMockTraffic() {
    const points = [];
    for (let i = 0; i < 12; i += 1) {
        points.push({
            time: `${String(i + 8).padStart(2, "0")}:00`,
            requests: randomBetween(200, 1600),
            errors: randomBetween(0, 55),
            active_users: randomBetween(20, 320),
        });
    }
    return points;
}

const regions = [
    { id: 1, name: "منطقه ۱" },
    { id: 2, name: "منطقه ۲" },
    { id: 3, name: "منطقه ۳" },
    { id: 4, name: "منطقه ۴" },
];

export const neighborhoodHallMonitoringApi = {
    async dashboard(): Promise<MonitoringDashboardResponse> {
        // نسخه واقعی:
        // const res = await http.get("/api/admin/neighborhood-halls/monitoring/dashboard");
        // return res.data;

        await new Promise((resolve) => setTimeout(resolve, 500));

        return {
            generated_at: new Date().toISOString(),
            refresh_interval_sec: 10,
            kpis: [
                {
                    title: "درخواست‌های لحظه‌ای",
                    value: randomBetween(1200, 5600),
                    unit: "req",
                    change: randomBetween(-12, 18),
                    status: "healthy",
                },
                {
                    title: "کاربران فعال",
                    value: randomBetween(110, 980),
                    unit: "user",
                    change: randomBetween(-10, 22),
                    status: "healthy",
                },
                {
                    title: "نرخ خطا",
                    value: randomBetween(1, 9),
                    unit: "%",
                    change: randomBetween(-4, 7),
                    status: "warning",
                },
                {
                    title: "میانگین پاسخ",
                    value: randomBetween(80, 650),
                    unit: "ms",
                    change: randomBetween(-9, 11),
                    status: "neutral",
                },
            ],
            services: Array.from({ length: 8 }).map((_, index) => {
                const region = pick(regions);
                const statuses = ["online", "degraded", "offline"] as const;
                const status = statuses[index % statuses.length];

                return {
                    id: index + 1,
                    name: [
                        "API Gateway",
                        "Auth Service",
                        "File Storage",
                        "Notifications",
                        "Realtime Broker",
                        "Image Optimizer",
                        "Report Engine",
                        "Sync Worker",
                    ][index],
                    region_id: region.id,
                    region_name: region.name,
                    status,
                    latency_ms:
                        status === "online"
                            ? randomBetween(50, 180)
                            : status === "degraded"
                                ? randomBetween(140, 420)
                                : randomBetween(300, 1200),
                    uptime_percent:
                        status === "online"
                            ? 99.9
                            : status === "degraded"
                                ? 98.4
                                : 91.2,
                    last_check_at: new Date().toISOString(),
                };
            }),
            traffic: buildMockTraffic(),
            alerts: [
                {
                    id: 1,
                    title: "افزایش نرخ خطا در File Storage",
                    severity: "critical",
                    source: "File Storage",
                    created_at: new Date().toISOString(),
                    description: "در ۵ دقیقه اخیر نرخ خطا از حد مجاز عبور کرده است.",
                    region_id: 3,
                    region_name: "منطقه ۳",
                },
                {
                    id: 2,
                    title: "Latency بالا در Notifications",
                    severity: "warning",
                    source: "Notifications",
                    created_at: new Date().toISOString(),
                    description: "میانگین پاسخ سرویس اعلان‌ها افزایش یافته است.",
                    region_id: 2,
                    region_name: "منطقه ۲",
                },
                {
                    id: 3,
                    title: "بار ترافیکی پایدار",
                    severity: "info",
                    source: "API Gateway",
                    created_at: new Date().toISOString(),
                    description: "ترافیک جاری در محدوده نرمال قرار دارد.",
                    region_id: 1,
                    region_name: "منطقه ۱",
                },
            ],
            logs: Array.from({ length: 10 }).map((_, index) => ({
                id: index + 1,
                event: [
                    "Hall status updated",
                    "Manager assigned",
                    "Service timeout detected",
                    "Traffic threshold exceeded",
                    "Realtime sync completed",
                ][index % 5],
                level: (["info", "warning", "error"] as const)[index % 3],
                actor: index % 2 === 0 ? "System" : "Admin",
                target: `Hall-${index + 10}`,
                created_at: new Date(Date.now() - index * 1000 * 60 * 3).toISOString(),
            })),
            vectors: [
                {
                    id: 1,
                    name: "منطقه ۱",
                    load_percent: randomBetween(35, 82),
                    active_halls: randomBetween(4, 12),
                    status: "healthy",
                },
                {
                    id: 2,
                    name: "منطقه ۲",
                    load_percent: randomBetween(40, 90),
                    active_halls: randomBetween(6, 15),
                    status: "warning",
                },
                {
                    id: 3,
                    name: "منطقه ۳",
                    load_percent: randomBetween(65, 98),
                    active_halls: randomBetween(5, 14),
                    status: "critical",
                },
                {
                    id: 4,
                    name: "منطقه ۴",
                    load_percent: randomBetween(30, 75),
                    active_halls: randomBetween(3, 11),
                    status: "healthy",
                },
            ],
        };
    },
};
