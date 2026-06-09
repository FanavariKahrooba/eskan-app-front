"use client";

import { ReactNode, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import L from "leaflet";
import {
  ArrowLeft,
  Home,
  Layers,
  LocateFixed,
  MapPin,
  Navigation,
} from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type {
  Shelter,
  ShelterAdmissionType,
  ShelterGenderType,
  ShelterStatus,
} from "@/lib/shelter-explorer";
import EmptyState from "./EmptyState";

const defaultCenter: [number, number] = [35.6892, 51.389];

function createShelterIcon(status: ShelterStatus) {
  const colors = {
    active: {
      bg: "#10b981",
      ring: "#d1fae5",
      dot: "#ffffff",
    },
    limited: {
      bg: "#f59e0b",
      ring: "#fef3c7",
      dot: "#ffffff",
    },
    full: {
      bg: "#ef4444",
      ring: "#fee2e2",
      dot: "#ffffff",
    },
    unknown: {
      bg: "#71717a",
      ring: "#e4e4e7",
      dot: "#ffffff",
    },
  };

  const palette =
    status === "active"
      ? colors.active
      : status === "limited"
        ? colors.limited
        : status === "full"
          ? colors.full
          : colors.unknown;

  return L.divIcon({
    className: "custom-shelter-marker",
    html: `
      <div style="position: relative; width: 34px; height: 46px; display:flex; align-items:center; justify-content:center;">
        <div style="
          position:absolute;
          top:2px;
          left:50%;
          transform:translateX(-50%);
          width:30px;
          height:30px;
          border-radius:9999px;
          background:${palette.bg};
          border:3px solid ${palette.ring};
          box-shadow:0 10px 20px rgba(0,0,0,.18);
          display:flex;
          align-items:center;
          justify-content:center;
        ">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-9.5Z" fill="${palette.dot}" />
          </svg>
        </div>
        <div style="
          position:absolute;
          bottom:1px;
          left:50%;
          transform:translateX(-50%);
          width:0;
          height:0;
          border-left:8px solid transparent;
          border-right:8px solid transparent;
          border-top:14px solid ${palette.bg};
          filter:drop-shadow(0 4px 8px rgba(0,0,0,.18));
        "></div>
      </div>
    `,
    iconSize: [34, 46],
    iconAnchor: [17, 44],
    popupAnchor: [0, -36],
  });
}

export default function MapView({
  shelters,
  selectedShelter,
  setSelectedShelter,
  onDetails,
}: {
  shelters: Shelter[];
  selectedShelter: Shelter | null;
  setSelectedShelter: (shelter: Shelter) => void;
  onDetails: (id: number) => void;
}) {
  if (shelters.length === 0) {
    return <EmptyState />;
  }

  const center: [number, number] = selectedShelter
    ? [selectedShelter.lat, selectedShelter.lng]
    : defaultCenter;

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="mb-3 flex flex-col gap-3 px-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-extrabold text-zinc-950 dark:text-white">
              نقشه سراها
            </h2>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              روی هر نشانگر کلیک کنید.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <MapPin className="h-3.5 w-3.5" />
            {shelters.length.toLocaleString("fa-IR")} نقطه
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[24px] w-full h-full">
          <MapSkin />

          <div className="absolute left-4 top-4 z-[500] flex flex-col gap-2">
            <MapControl icon={<Navigation className="h-4 w-4" />} />
            <MapControl icon={<LocateFixed className="h-4 w-4" />} />
            <MapControl icon={<Layers className="h-4 w-4" />} />
          </div>

          <MapContainer
            center={center}
            zoom={12}
            className="z-[9] h-[700px] w-full max-h-[1000px]"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FlyToSelected shelter={selectedShelter} />

            {shelters.map((shelter) => {
              const statusConfig = getStatusConfig(shelter.status);
              const markerIcon = createShelterIcon(shelter.status);

              return (
                <Marker
                  key={shelter.id}
                  position={[shelter.lat, shelter.lng]}
                  icon={markerIcon}
                  eventHandlers={{
                    click: () => setSelectedShelter(shelter),
                  }}
                >
                  <Popup>
                    <div dir="rtl" className="w-[240px] text-right">
                      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-200">
                        <Image
                          src="/assets/background/2.jpg"
                          alt={shelter.name}
                          width={500}
                          height={500}
                          className="h-[115px] w-full object-cover"
                        />
                      </div>

                      <h3 className="mt-3 text-base font-black text-gray-900">
                        {shelter.name}
                      </h3>

                      <p className="mt-1 text-xs leading-6 text-gray-600">
                        {shelter.region}، {shelter.district}
                      </p>

                      <div
                        className={`mt-2 inline-flex rounded-full border px-2 py-1 text-xs font-bold ${statusConfig.popupBadgeClass}`}
                      >
                        {statusConfig.label}
                      </div>

                      <div className="mt-3 grid gap-2">
                        <button
                          type="button"
                          onClick={() => onDetails(shelter.id)}
                          className="w-full rounded-lg bg-sky-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-sky-700"
                        >
                          جزئیات کامل
                        </button>

                        <Link
                          href={`/neighborhood-hall/profile/${shelter.id}`}
                          target="_blank"
                          className="w-full rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                          مشاهده پروفایل
                        </Link>

                        <Link
                          href={`/request/new?shelterId=${shelter.id}`}
                          className="w-full rounded-lg bg-orange-500 px-3 py-2 text-center text-sm font-bold text-white transition hover:bg-orange-600"
                        >
                          ثبت درخواست برای این سرا
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* <div className="space-y-5">
        {selectedShelter ? (
          <SelectedShelterPanel
            shelter={selectedShelter}
            onDetails={onDetails}
          />
        ) : (
          <div className="rounded-[28px] border border-zinc-200 bg-white p-5 text-sm text-zinc-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:shadow-none">
            یک نقطه روی نقشه را انتخاب کنید.
          </div>
        )}

        <MapLegend />
      </div> */}
    </div>
  );
}

function MapSkin() {
  const map = useMapOptionalTheme();

  useEffect(() => {
    if (!map) return;

    const container = map.getContainer();
    const isDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");

    if (isDark) {
      container.style.filter =
        "saturate(.9) brightness(.88) contrast(1.05) hue-rotate(190deg)";
    } else {
      container.style.filter = "none";
    }

    return () => {
      container.style.filter = "none";
    };
  }, [map]);

  return null;
}

function useMapOptionalTheme() {
  try {
    return useMap();
  } catch {
    return null;
  }
}

function MapControl({ icon }: { icon: ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white/90 text-zinc-700 shadow-xl backdrop-blur-xl transition hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-zinc-950/80 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
    >
      {icon}
    </button>
  );
}

function FlyToSelected({ shelter }: { shelter: Shelter | null }) {
  const map = useMap();

  useEffect(() => {
    if (!shelter) return;
    map.flyTo([shelter.lat, shelter.lng], 14, {
      duration: 0.8,
    });
  }, [shelter, map]);

  return null;
}

function SelectedShelterPanel({
  shelter,
  onDetails,
}: {
  shelter: Shelter;
  onDetails: (id: number) => void;
}) {
  const statusConfig = getStatusConfig(shelter.status);

  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-zinc-950 dark:text-white">
            {shelter.name}
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {shelter.region}، {shelter.district}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold ${statusConfig.badgeClass}`}
        >
          {statusConfig.label}
        </span>
      </div>

      <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
        {shelter.address}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MiniStat label="کل ظرفیت" value={shelter.totalCapacity} />
        <MiniStat label="ظرفیت خالی" value={shelter.freeCapacity} green />
        <MiniStat label="رزرو" value={shelter.reservedCapacity} />
        <MiniStat label="اشغال‌شده" value={shelter.occupiedCapacity} />
      </div>

      <div className="mt-5 space-y-3">
        <InfoRow label="مدیر" value={shelter.manager} />
        <InfoRow
          label="گروه اسکان"
          value={getGenderLabel(shelter.genderType)}
        />
        <InfoRow
          label="نوع پذیرش"
          value={getAdmissionLabel(shelter.admissionType)}
        />
        <InfoRow label="شماره تماس" value={shelter.phone} />
        <InfoRow label="مختصات" value={`${shelter.lat}, ${shelter.lng}`} />
      </div>

      <div className="mt-5 grid gap-2">
        <button
          type="button"
          onClick={() => onDetails(shelter.id)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-sky-300 bg-sky-50 px-5 py-3 text-sm font-extrabold text-sky-700 transition hover:bg-sky-100 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20"
        >
          جزئیات کامل سرا
        </button>

        <Link
          href={`/request/new?shelterId=${shelter.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-orange-600 dark:hover:bg-orange-400"
        >
          انتخاب این سرا برای درخواست
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-zinc-950/50">
      <span className="text-xs text-zinc-500 dark:text-zinc-500">{label}</span>
      <span className="text-sm font-bold text-zinc-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

function MapLegend() {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950/50 dark:shadow-none">
      <h3 className="font-extrabold text-zinc-950 dark:text-white">
        راهنمای نقشه
      </h3>

      <div className="mt-4 space-y-3">
        <LegendItem color="bg-emerald-500" label="دارای ظرفیت" />
        <LegendItem color="bg-orange-500" label="ظرفیت محدود" />
        <LegendItem color="bg-red-500" label="تکمیل ظرفیت" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      {label}
    </div>
  );
}

function MiniStat({
  label,
  value,
  green,
}: {
  label: string;
  value: number;
  green?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        green
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/10"
          : "border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950/50"
      }`}
    >
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-lg font-black text-zinc-950 dark:text-white">
        {value.toLocaleString("fa-IR")}
      </p>
    </div>
  );
}

function getGenderLabel(value: ShelterGenderType) {
  switch (value) {
    case "men":
      return "آقایان";
    case "women":
      return "بانوان";
    case "family":
      return "خانواده";
    case "mixed":
    default:
      return "مختلط";
  }
}

function getAdmissionLabel(value: ShelterAdmissionType) {
  switch (value) {
    case "emergency":
      return "اضطراری";
    case "referral":
      return "معرفی‌نامه";
    case "normal":
    default:
      return "عادی";
  }
}

function getStatusConfig(status: ShelterStatus) {
  switch (status) {
    case "active":
      return {
        label: "فعال",
        badgeClass:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300",
        popupBadgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case "limited":
      return {
        label: "ظرفیت محدود",
        badgeClass:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300",
        popupBadgeClass: "border-amber-200 bg-amber-50 text-amber-700",
      };
    case "full":
      return {
        label: "تکمیل",
        badgeClass:
          "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-300",
        popupBadgeClass: "border-rose-200 bg-rose-50 text-rose-700",
      };
    default:
      return {
        label: "نامشخص",
        badgeClass:
          "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300",
        popupBadgeClass: "border-zinc-200 bg-zinc-50 text-zinc-700",
      };
  }
}
