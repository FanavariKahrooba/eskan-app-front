"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import L from "leaflet";
import Link from "next/link";
import Image from "next/image";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import {
  ArrowLeft,
  Bed,
  Building2,
  ExternalLink,
  Filter,
  Home,
  Layers,
  List,
  Loader2,
  LocateFixed,
  Map,
  MapPin,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";

import { getDistrictList, getRegionList } from "@/actions/district/district";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";

type ShelterStatus = "active" | "limited" | "full";
type ShelterGenderType = "men" | "women" | "family" | "mixed";
type ShelterAdmissionType = "normal" | "emergency" | "referral";
type ViewMode = "list" | "map";

type RegionItem = {
  id: number | string;
  name: string;
};

type DistrictItem = {
  id: number | string;
  name: string;
};

type ApiHallItem = {
  id: number;
  name: string;
  user?: string;
  lat?: number | string;
  lng?: number | string;
  district?: {
    id?: number | string;
    name?: string;
    region?: {
      id?: number | string;
      name?: string;
    };
  };
  info?: {
    address?: string;
    contact_number?: string;
    staff_count?: number | string;
    insurance?: number | string;
    has_workshop?: number | string;
    area_land?: number | string;
    area_building?: number | string;
    ownership?: string;
    has_study_hall?: number | string;
    has_theater?: number | string;
    theater_capacity?: number | string;
    has_gym?: number | string;
    has_preschool?: number | string;
    elevator_count?: number | string;
    floor_count?: number | string;
    number_of_rooms?: number | string;
    number_of_computer_workshops?: number | string;
    year_of_manufacture?: number | string;

    total_capacity?: number | string;
    free_capacity?: number | string;
    reserved_capacity?: number | string;
    occupied_capacity?: number | string;
    gender_type?: ShelterGenderType;
    admission_type?: ShelterAdmissionType;
  };
};

type Shelter = {
  id: number;
  name: string;
  manager: string;
  region: string;
  regionId?: string;
  district: string;
  districtId?: string;
  neighborhood: string;
  address: string;
  phone: string;
  status: ShelterStatus;
  genderType: ShelterGenderType;
  admissionType: ShelterAdmissionType;
  totalCapacity: number;
  freeCapacity: number;
  reservedCapacity: number;
  occupiedCapacity: number;
  facilities: string[];
  lat: number;
  lng: number;
  raw?: ApiHallItem;
};

type DetailResponse = {
  data: ApiHallItem;
};

const customIcon = new L.Icon({
  iconUrl: "/assets/static/icon-location.png",
  iconSize: [22, 34],
  iconAnchor: [11, 34],
  popupAnchor: [0, -30],
});

const defaultCenter: [number, number] = [35.6892, 51.389];

export default function SheltersExplorer() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState("all");
  const [genderType, setGenderType] = useState("all");
  const [admissionType, setAdmissionType] = useState("all");

  const [regions, setRegions] = useState<RegionItem[]>([]);
  const [districts, setDistricts] = useState<DistrictItem[]>([]);

  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRegionsLoading, setIsRegionsLoading] = useState(false);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const [selectedHallDetails, setSelectedHallDetails] =
    useState<DetailResponse | null>(null);

  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    let mounted = true;

    async function loadRegions() {
      try {
        setIsRegionsLoading(true);
        const data = await getRegionList();

        if (!mounted) return;

        setRegions(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Error loading regions:", error);
        if (mounted) setRegions([]);
      } finally {
        if (mounted) setIsRegionsLoading(false);
      }
    }

    loadRegions();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadDistricts() {
      if (!region) {
        setDistrict("");
        setDistricts([]);
        return;
      }

      try {
        setIsDistrictsLoading(true);
        const data = await getDistrictList(region);

        if (!mounted) return;

        setDistricts(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Error loading districts:", error);
        if (mounted) setDistricts([]);
      } finally {
        if (mounted) setIsDistrictsLoading(false);
      }
    }

    loadDistricts();

    return () => {
      mounted = false;
    };
  }, [region]);

  useEffect(() => {
    let mounted = true;

    async function fetchShelters() {
      try {
        setIsLoading(true);

        const { data } = await axios.get("/api/neighborhood-halls/user", {
          params: {
            region,
            district,
            q: search,
          },
        });

        if (!mounted) return;

        const list: ApiHallItem[] = Array.isArray(data?.data) ? data.data : [];
        const adapted = list.map(adaptHall).filter(Boolean) as Shelter[];

        setShelters(adapted);

        if (!selectedShelter && adapted.length > 0) {
          setSelectedShelter(adapted[0]);
        }

        if (
          selectedShelter &&
          !adapted.some((item) => item.id === selectedShelter.id)
        ) {
          setSelectedShelter(adapted[0] ?? null);
        }
      } catch (error) {
        console.error("Error fetching shelters:", error);
        if (mounted) setShelters([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    const timer = setTimeout(fetchShelters, 350);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [search, region, district]);

  const filteredShelters = useMemo(() => {
    return shelters.filter((shelter) => {
      const text = search.trim();

      const matchesSearch =
        !text ||
        shelter.name.includes(text) ||
        shelter.manager.includes(text) ||
        shelter.neighborhood.includes(text) ||
        shelter.address.includes(text);

      const matchesStatus =
        status === "all" || shelter.status === (status as ShelterStatus);

      const matchesGender =
        genderType === "all" ||
        shelter.genderType === (genderType as ShelterGenderType);

      const matchesAdmission =
        admissionType === "all" ||
        shelter.admissionType === (admissionType as ShelterAdmissionType);

      return (
        matchesSearch && matchesStatus && matchesGender && matchesAdmission
      );
    });
  }, [shelters, search, status, genderType, admissionType]);

  const totalFree = filteredShelters.reduce(
    (sum, shelter) => sum + shelter.freeCapacity,
    0,
  );

  const totalCapacity = filteredShelters.reduce(
    (sum, shelter) => sum + shelter.totalCapacity,
    0,
  );

  const resetFilters = () => {
    setSearch("");
    setRegion("");
    setDistrict("");
    setStatus("all");
    setGenderType("all");
    setAdmissionType("all");
  };

  const fetchHallDetails = async (id: number) => {
    try {
      setIsDetailsLoading(true);
      setSelectedHallDetails(null);

      const { data } = await axios.get(`/api/neighborhood-halls/user/${id}`);

      setSelectedHallDetails(data);
      openModal();
    } catch (error) {
      console.error("Error fetching hall details:", error);
      setSelectedHallDetails(null);
      openModal();
    } finally {
      setIsDetailsLoading(false);
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-400 px-6 py-10 lg:px-8">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              بازگشت به صفحه اصلی
            </Link>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
              <MapPin className="h-4 w-4" />
              سراهای فعال و ظرفیت‌ها
            </span>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-black text-white md:text-5xl">
                  مشاهده سراهای فعال
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-8 text-zinc-400 md:text-base">
                  از این بخش می‌توانید سراهای فعال را از API واقعی مشاهده کنید،
                  روی نقشه ببینید، جزئیات هر سرا را بررسی کنید و مستقیم برای
                  همان سرا درخواست ثبت کنید.
                </p>
              </div>

              <ViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-400 px-6 py-8 lg:px-8">
        <StatsBar
          totalShelters={filteredShelters.length}
          totalCapacity={totalCapacity}
          totalFree={totalFree}
          isLoading={isLoading}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-5">
            <FiltersPanel
              search={search}
              setSearch={setSearch}
              region={region}
              setRegion={(value) => {
                setRegion(value);
                setDistrict("");
              }}
              district={district}
              setDistrict={setDistrict}
              status={status}
              setStatus={setStatus}
              genderType={genderType}
              setGenderType={setGenderType}
              admissionType={admissionType}
              setAdmissionType={setAdmissionType}
              resetFilters={resetFilters}
              regions={regions}
              districts={districts}
              isRegionsLoading={isRegionsLoading}
              isDistrictsLoading={isDistrictsLoading}
            />

            <GuidePanel />
          </aside>

          <section className="min-w-0">
            {isLoading ? (
              <LoadingState />
            ) : viewMode === "list" ? (
              <ListView
                shelters={filteredShelters}
                onDetails={fetchHallDetails}
              />
            ) : (
              <MapView
                shelters={filteredShelters}
                selectedShelter={selectedShelter}
                setSelectedShelter={setSelectedShelter}
                onDetails={fetchHallDetails}
              />
            )}
          </section>
        </div>
      </section>

      <HallDetailsModal
        isOpen={isOpen}
        closeModal={closeModal}
        isLoading={isDetailsLoading}
        details={selectedHallDetails}
      />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
            <Home className="h-6 w-6" />
          </div>

          <div>
            <div className="text-base font-black text-white">
              سامانه ثبت درخواست اسکان سرای های محله
            </div>
            <div className="text-xs text-zinc-400">
              مشاهده ظرفیت و موقعیت سراها
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/request/track"
            className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10 sm:inline-flex"
          >
            پیگیری درخواست
          </Link>

          <Link
            href="/request/new"
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-orange-400"
          >
            ثبت درخواست
          </Link>
        </div>
      </div>
    </header>
  );
}

function ViewSwitcher({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode;
  setViewMode: (value: ViewMode) => void;
}) {
  return (
    <div className="inline-flex w-fit rounded-2xl border border-white/10 bg-zinc-900/80 p-1">
      <button
        type="button"
        onClick={() => setViewMode("list")}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
          viewMode === "list"
            ? "bg-orange-500 text-white"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        <List className="h-4 w-4" />
        لیستی
      </button>

      <button
        type="button"
        onClick={() => setViewMode("map")}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
          viewMode === "map"
            ? "bg-orange-500 text-white"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        <Map className="h-4 w-4" />
        نقشه‌ای
      </button>
    </div>
  );
}

function StatsBar({
  totalShelters,
  totalCapacity,
  totalFree,
  isLoading,
}: {
  totalShelters: number;
  totalCapacity: number;
  totalFree: number;
  isLoading: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="سراهای قابل نمایش"
        value={isLoading ? "..." : totalShelters.toLocaleString("fa-IR")}
        icon={<Building2 className="h-5 w-5" />}
        color="orange"
      />

      <StatCard
        title="ظرفیت کل"
        value={isLoading ? "..." : totalCapacity.toLocaleString("fa-IR")}
        icon={<Users className="h-5 w-5" />}
        color="sky"
      />

      <StatCard
        title="ظرفیت خالی"
        value={isLoading ? "..." : totalFree.toLocaleString("fa-IR")}
        icon={<Bed className="h-5 w-5" />}
        color="emerald"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  color: "orange" | "emerald" | "sky";
}) {
  const colorClass = {
    orange: "border-orange-400/20 bg-orange-500/10 text-orange-300",
    emerald: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    sky: "border-sky-400/20 bg-sky-500/10 text-sky-300",
  }[color];

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-zinc-400">{title}</div>
          <div className="mt-2 text-3xl font-black text-white">{value}</div>
        </div>

        <div className={`rounded-2xl border p-3 ${colorClass}`}>{icon}</div>
      </div>
    </div>
  );
}

function FiltersPanel({
  search,
  setSearch,
  region,
  setRegion,
  district,
  setDistrict,
  status,
  setStatus,
  genderType,
  setGenderType,
  admissionType,
  setAdmissionType,
  resetFilters,
  regions,
  districts,
  isRegionsLoading,
  isDistrictsLoading,
}: {
  search: string;
  setSearch: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
  district: string;
  setDistrict: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  genderType: string;
  setGenderType: (value: string) => void;
  admissionType: string;
  setAdmissionType: (value: string) => void;
  resetFilters: () => void;
  regions: RegionItem[];
  districts: DistrictItem[];
  isRegionsLoading: boolean;
  isDistrictsLoading: boolean;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-3 text-orange-300">
            <Filter className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-extrabold text-white">فیلترها</h2>
            <p className="mt-1 text-xs text-zinc-500">
              فیلتر از API و جستجوی سریع
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/10"
        >
          <X className="h-3.5 w-3.5" />
          حذف
        </button>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-zinc-200">
            جستجو
          </span>

          <div className="relative">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="نام سرا، مدیر، محله..."
              className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 py-3 pl-4 pr-11 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-400/40"
            />
          </div>
        </label>

        <SelectField
          label="منطقه"
          value={region}
          onChange={setRegion}
          loading={isRegionsLoading}
          options={[
            { label: "همه مناطق", value: "" },
            ...regions.map((item) => ({
              label: item.name,
              value: String(item.id),
            })),
          ]}
        />

        <SelectField
          label="ناحیه"
          value={district}
          onChange={setDistrict}
          loading={isDistrictsLoading}
          disabled={!region}
          options={[
            {
              label: region ? "همه نواحی" : "ابتدا منطقه را انتخاب کنید",
              value: "",
            },
            ...districts.map((item) => ({
              label: item.name,
              value: String(item.id),
            })),
          ]}
        />

        <SelectField
          label="وضعیت ظرفیت"
          value={status}
          onChange={setStatus}
          options={[
            { label: "همه وضعیت‌ها", value: "all" },
            { label: "دارای ظرفیت", value: "active" },
            { label: "ظرفیت محدود", value: "limited" },
            { label: "تکمیل ظرفیت", value: "full" },
          ]}
        />

        <SelectField
          label="گروه اسکان"
          value={genderType}
          onChange={setGenderType}
          options={[
            { label: "همه گروه‌ها", value: "all" },
            { label: "آقایان", value: "men" },
            { label: "بانوان", value: "women" },
            { label: "خانواده", value: "family" },
            { label: "ترکیبی", value: "mixed" },
          ]}
        />

        <SelectField
          label="نوع پذیرش"
          value={admissionType}
          onChange={setAdmissionType}
          options={[
            { label: "همه انواع", value: "all" },
            { label: "عادی", value: "normal" },
            { label: "اضطراری", value: "emergency" },
            { label: "با معرفی‌نامه", value: "referral" },
          ]}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  loading,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-zinc-200">
        {label}
        {loading && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />
        )}
      </span>

      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {options.map((option) => (
          <option
            key={`${label}-${option.value}`}
            value={option.value}
            className="bg-zinc-900 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ListView({
  shelters,
  onDetails,
}: {
  shelters: Shelter[];
  onDetails: (id: number) => void;
}) {
  if (shelters.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-[24px] border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-extrabold text-white">نتایج جستجو</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {shelters.length.toLocaleString("fa-IR")} سرا مطابق فیلترهای انتخابی
            یافت شد.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
          <Layers className="h-4 w-4" />
          دریافت‌شده از API سراهای محله
        </div>
      </div>

      {shelters.map((shelter) => (
        <ShelterCard key={shelter.id} shelter={shelter} onDetails={onDetails} />
      ))}
    </div>
  );
}

function ShelterCard({
  shelter,
  onDetails,
}: {
  shelter: Shelter;
  onDetails: (id: number) => void;
}) {
  const statusConfig = getStatusConfig(shelter.status);
  const occupancyPercent =
    shelter.totalCapacity > 0
      ? Math.min(
          100,
          Math.round((shelter.occupiedCapacity / shelter.totalCapacity) * 100),
        )
      : 0;

  return (
    <article className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 transition hover:border-orange-400/20 hover:bg-white/[0.07]">
      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black text-white">{shelter.name}</h3>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold ${statusConfig.badgeClass}`}
              >
                {statusConfig.label}
              </span>

              <span className="rounded-full border border-white/10 bg-zinc-950/50 px-3 py-1 text-xs font-bold text-zinc-300">
                {getGenderLabel(shelter.genderType)}
              </span>

              <span className="rounded-full border border-white/10 bg-zinc-950/50 px-3 py-1 text-xs font-bold text-zinc-300">
                {getAdmissionLabel(shelter.admissionType)}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-400">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-300" />
                {shelter.region}، {shelter.district}
              </span>

              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-sky-300" />
                مدیر: {shelter.manager}
              </span>

              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-300" />
                {shelter.phone}
              </span>
            </div>

            <p className="mt-3 text-sm leading-7 text-zinc-400">
              {shelter.address}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {shelter.facilities.map((facility) => (
                <span
                  key={facility}
                  className="rounded-full border border-white/10 bg-zinc-950/60 px-3 py-1 text-xs text-zinc-300"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>

          <div className="grid min-w-[260px] grid-cols-2 gap-3">
            <MiniStat label="کل ظرفیت" value={shelter.totalCapacity} />
            <MiniStat label="ظرفیت خالی" value={shelter.freeCapacity} green />
            <MiniStat label="رزرو موقت" value={shelter.reservedCapacity} />
            <MiniStat label="اشغال‌شده" value={shelter.occupiedCapacity} />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-zinc-400">میزان اشغال ظرفیت</span>
            <span className="font-bold text-white">
              {occupancyPercent.toLocaleString("fa-IR")}٪
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-zinc-900">
            <div
              className={`h-full rounded-full ${statusConfig.progressClass}`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <LocateFixed className="h-4 w-4" />
            مختصات:
            <span dir="ltr" className="font-bold text-zinc-200">
              {shelter.lat}, {shelter.lng}
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => onDetails(shelter.id)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-5 py-3 text-sm font-extrabold text-sky-200 transition hover:bg-sky-500/20"
            >
              جزئیات کامل
            </button>

            <Link
              href={`/request/new?shelterId=${shelter.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-orange-400"
            >
              انتخاب این سرا
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
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
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
      <div className="text-xs text-zinc-500">{label}</div>
      <div
        className={`mt-2 text-2xl font-black ${
          green ? "text-emerald-300" : "text-white"
        }`}
      >
        {value.toLocaleString("fa-IR")}
      </div>
    </div>
  );
}

function MapView({
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
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-3">
        <div className="mb-3 flex flex-col gap-3 px-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-extrabold text-white">نقشه سراها</h2>
            <p className="mt-1 text-xs text-zinc-400">
              نقاط از API واقعی خوانده می‌شوند. روی هر نشانگر کلیک کنید.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
            <MapPin className="h-3.5 w-3.5" />
            {shelters.length.toLocaleString("fa-IR")} نقطه
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[24px]">
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

              return (
                <Marker
                  key={shelter.id}
                  position={[shelter.lat, shelter.lng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setSelectedShelter(shelter),
                  }}
                >
                  <Popup>
                    <div dir="rtl" className="w-[240px] text-right">
                      <div className="overflow-hidden rounded-xl border">
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
                          className="w-full rounded-lg bg-sky-600 px-3 py-2 text-sm font-bold text-white hover:bg-sky-700"
                        >
                          جزئیات کامل
                        </button>

                        <Link
                          href={`/neighborhood-hall/profile/${shelter.id}`}
                          target="_blank"
                          className="w-full rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-bold text-white hover:bg-blue-700"
                        >
                          مشاهده پروفایل
                        </Link>

                        <Link
                          href={`/request/new?shelterId=${shelter.id}`}
                          className="w-full rounded-lg bg-orange-500 px-3 py-2 text-center text-sm font-bold text-white hover:bg-orange-600"
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

      <div className="space-y-5">
        {selectedShelter ? (
          <SelectedShelterPanel
            shelter={selectedShelter}
            onDetails={onDetails}
          />
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm text-zinc-400">
            یک نقطه روی نقشه را انتخاب کنید.
          </div>
        )}

        <MapLegend />
      </div>
    </div>
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

function MapControl({ icon }: { icon: ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-zinc-950/80 text-zinc-300 shadow-xl backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
    >
      {icon}
    </button>
  );
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
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white">{shelter.name}</h3>
          <p className="mt-2 text-sm text-zinc-400">
            {shelter.region}، {shelter.district}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold ${statusConfig.badgeClass}`}
        >
          {statusConfig.label}
        </span>
      </div>

      <p className="text-sm leading-7 text-zinc-300">{shelter.address}</p>

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
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-5 py-3 text-sm font-extrabold text-sky-200 transition hover:bg-sky-500/20"
        >
          جزئیات کامل سرا
        </button>

        <Link
          href={`/request/new?shelterId=${shelter.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-orange-400"
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
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/50 px-4 py-3">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}

function MapLegend() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-zinc-950/50 p-5">
      <h3 className="font-extrabold text-white">راهنمای نقشه</h3>

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
    <div className="flex items-center gap-3 text-sm text-zinc-300">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      {label}
    </div>
  );
}

function GuidePanel() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-orange-500/15 to-zinc-950 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-3 text-orange-300">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <h3 className="text-lg font-extrabold text-white">نکات مهم</h3>
      </div>

      <ul className="space-y-3 text-sm leading-7 text-zinc-300">
        <li>اطلاعات سراها از API فعلی سامانه خوانده می‌شود.</li>
        <li>ثبت درخواست به معنی پذیرش قطعی نیست.</li>
        <li>برای پذیرش نهایی، مدارک هویتی لازم است.</li>
        <li>در حالت نقشه‌ای، هر نشانگر نشان‌دهنده یک سرا است.</li>
      </ul>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-[28px] border border-white/10 bg-white/5">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-400" />
        <p className="mt-4 text-sm font-bold text-zinc-300">
          در حال دریافت اطلاعات سراها...
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[28px] border border-dashed border-white/15 bg-zinc-950/40 p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-zinc-300">
        <Search className="h-7 w-7" />
      </div>

      <h2 className="mt-5 text-xl font-extrabold text-white">موردی یافت نشد</h2>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-zinc-400">
        با فیلترهای فعلی هیچ سرایی پیدا نشد. لطفاً فیلترها را تغییر دهید یا
        عبارت جستجو را حذف کنید.
      </p>
    </div>
  );
}

function HallDetailsModal({
  isOpen,
  closeModal,
  isLoading,
  details,
}: {
  isOpen: boolean;
  closeModal: () => void;
  isLoading: boolean;
  details: DetailResponse | null;
}) {
  const hall = details?.data;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-h-[90vh] max-w-[900px] overflow-hidden bg-transparent p-2"
    >
      <div className="w-full">
        <div className="max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-white shadow-lg">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-gray-800 px-4 py-3 text-white">
            <h2 className="text-lg font-semibold">اطلاعات سرای انتخاب‌شده</h2>
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
            >
              بستن
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-8 text-gray-700">
              <Loader2 className="h-5 w-5 animate-spin" />
              در حال دریافت جزئیات...
            </div>
          ) : !hall ? (
            <div className="p-6 text-sm text-red-600">
              دریافت اطلاعات سرا با خطا مواجه شد.
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-4 grid gap-4 md:grid-cols-[170px_minmax(0,1fr)]">
                <div className="overflow-hidden rounded-xl border">
                  <Image
                    src="/assets/background/2.jpg"
                    alt={hall.name}
                    width={500}
                    height={500}
                    className="h-[150px] w-full object-cover"
                  />
                </div>

                <div className="rounded-xl border bg-gray-50 p-4">
                  <h3 className="text-xl font-black text-gray-900">
                    {hall.name}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                      <MapPin className="h-4 w-4" />
                      {safeText(hall.district?.region?.name, "منطقه نامشخص")}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                      <Building2 className="h-4 w-4" />
                      {safeText(hall.district?.name, "ناحیه نامشخص")}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-orange-700">
                      <Users className="h-4 w-4" />
                      مدیر: {safeText(hall.user)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/request/new?shelterId=${hall.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
                    >
                      ثبت درخواست اسکان
                    </Link>

                    <Link
                      href={`/neighborhood-hall/profile/${hall.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      مشاهده پروفایل
                    </Link>

                    {hall.info?.contact_number && (
                      <a
                        href={`tel:${hall.info.contact_number}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                      >
                        <Phone className="h-4 w-4" />
                        تماس
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border">
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    <TableRow label="نام سرا" value={hall.name} />
                    <TableRow
                      label="نام مدیر سرا"
                      value={safeText(hall.user)}
                    />
                    <TableRow
                      label="منطقه"
                      value={safeText(hall.district?.region?.name)}
                    />
                    <TableRow
                      label="ناحیه"
                      value={safeText(hall.district?.name)}
                    />
                    <TableRow
                      label="موقعیت جغرافیایی"
                      value={`${safeText(hall.lat, "-")} | ${safeText(
                        hall.lng,
                        "-",
                      )}`}
                    />
                    <TableRow
                      label="تعداد کارمندان"
                      value={safeText(hall.info?.staff_count)}
                    />
                    <TableRow
                      label="تعداد بیمه"
                      value={safeText(hall.info?.insurance)}
                    />
                    <TableRow
                      label="کارگاه بیمه"
                      value={
                        isTruthyOne(hall.info?.has_workshop) ? "دارد" : "ندارد"
                      }
                    />
                    <TableRow
                      label="متراژ عرصه"
                      value={safeText(hall.info?.area_land)}
                    />
                    <TableRow
                      label="متراژ اعیان"
                      value={safeText(hall.info?.area_building)}
                    />
                    <TableRow
                      label="مالکیت"
                      value={safeText(hall.info?.ownership)}
                    />
                    <TableRow
                      label="سالن مطالعه"
                      value={
                        isTruthyOne(hall.info?.has_study_hall)
                          ? "دارد"
                          : "ندارد"
                      }
                    />
                    <TableRow
                      label="آمفی‌تئاتر"
                      value={
                        isTruthyOne(hall.info?.has_theater) ? "دارد" : "ندارد"
                      }
                    />
                    <TableRow
                      label="ظرفیت آمفی‌تئاتر"
                      value={safeText(hall.info?.theater_capacity, "0")}
                    />
                    <TableRow
                      label="سالن ورزشی"
                      value={isTruthyOne(hall.info?.has_gym) ? "دارد" : "ندارد"}
                    />
                    <TableRow
                      label="پیش‌دبستانی"
                      value={
                        isTruthyOne(hall.info?.has_preschool) ? "دارد" : "ندارد"
                      }
                    />
                    <TableRow
                      label="شماره تماس"
                      value={safeText(hall.info?.contact_number)}
                    />
                    <TableRow
                      label="آسانسور"
                      value={safeText(hall.info?.elevator_count)}
                    />
                    <TableRow
                      label="تعداد طبقه"
                      value={safeText(hall.info?.floor_count)}
                    />
                    <TableRow
                      label="تعداد اتاق"
                      value={safeText(hall.info?.number_of_rooms)}
                    />
                    <TableRow
                      label="تعداد کارگاه کامپیوتر"
                      value={safeText(hall.info?.number_of_computer_workshops)}
                    />
                    <TableRow
                      label="سال ساخت ساختمان"
                      value={safeText(hall.info?.year_of_manufacture)}
                    />
                    <TableRow
                      label="آدرس"
                      value={safeText(hall.info?.address)}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

function TableRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b last:border-b-0">
      <td className="w-1/3 bg-gray-100 p-3 font-semibold text-gray-700">
        {label}
      </td>
      <td className="p-3 text-gray-900">{value}</td>
    </tr>
  );
}

function adaptHall(item: ApiHallItem): Shelter | null {
  const lat = Number(item.lat);
  const lng = Number(item.lng);

  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

  const totalCapacity = toNumber(item.info?.total_capacity, 0);
  const freeCapacity = toNumber(item.info?.free_capacity, 0);
  const reservedCapacity = toNumber(item.info?.reserved_capacity, 0);
  const occupiedCapacity = toNumber(item.info?.occupied_capacity, 0);

  const status: ShelterStatus =
    totalCapacity > 0 && freeCapacity === 0
      ? "full"
      : totalCapacity > 0 && freeCapacity <= Math.max(10, totalCapacity * 0.1)
        ? "limited"
        : "active";

  return {
    id: item.id,
    name: safeText(item.name, "سرای بدون نام"),
    manager: safeText(item.user, "ثبت نشده"),
    region: safeText(item.district?.region?.name, "منطقه نامشخص"),
    regionId: item.district?.region?.id
      ? String(item.district.region.id)
      : undefined,
    district: safeText(item.district?.name, "ناحیه نامشخص"),
    districtId: item.district?.id ? String(item.district.id) : undefined,
    neighborhood: safeText(item.name, "محله نامشخص"),
    address: safeText(item.info?.address, "آدرس ثبت نشده"),
    phone: safeText(item.info?.contact_number, "ثبت نشده"),
    status,
    genderType: item.info?.gender_type || "mixed",
    admissionType: item.info?.admission_type || "normal",
    totalCapacity,
    freeCapacity,
    reservedCapacity,
    occupiedCapacity,
    facilities: buildFacilities(item),
    lat,
    lng,
    raw: item,
  };
}

function buildFacilities(item: ApiHallItem) {
  const facilities: string[] = [];

  if (isTruthyOne(item.info?.has_study_hall)) facilities.push("سالن مطالعه");
  if (isTruthyOne(item.info?.has_theater)) facilities.push("آمفی‌تئاتر");
  if (isTruthyOne(item.info?.has_gym)) facilities.push("سالن ورزشی");
  if (isTruthyOne(item.info?.has_preschool)) facilities.push("پیش‌دبستانی");
  if (isTruthyOne(item.info?.has_workshop)) facilities.push("کارگاه بیمه");
  if (item.info?.contact_number) facilities.push("دارای شماره تماس");

  return facilities.length > 0 ? facilities : ["اطلاعات امکانات ثبت نشده"];
}

function getStatusConfig(status: ShelterStatus) {
  switch (status) {
    case "active":
      return {
        label: "دارای ظرفیت",
        badgeClass: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
        popupBadgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
        progressClass: "bg-emerald-500",
      };

    case "limited":
      return {
        label: "ظرفیت محدود",
        badgeClass: "border-orange-400/20 bg-orange-500/10 text-orange-300",
        popupBadgeClass: "border-orange-200 bg-orange-50 text-orange-700",
        progressClass: "bg-orange-500",
      };

    case "full":
      return {
        label: "تکمیل ظرفیت",
        badgeClass: "border-red-400/20 bg-red-500/10 text-red-300",
        popupBadgeClass: "border-red-200 bg-red-50 text-red-700",
        progressClass: "bg-red-500",
      };

    default:
      return {
        label: "نامشخص",
        badgeClass: "border-white/10 bg-white/5 text-zinc-300",
        popupBadgeClass: "border-gray-200 bg-gray-50 text-gray-700",
        progressClass: "bg-zinc-500",
      };
  }
}

function getGenderLabel(type: ShelterGenderType) {
  switch (type) {
    case "men":
      return "آقایان";
    case "women":
      return "بانوان";
    case "family":
      return "خانواده";
    case "mixed":
      return "ترکیبی";
    default:
      return "نامشخص";
  }
}

function getAdmissionLabel(type: ShelterAdmissionType) {
  switch (type) {
    case "normal":
      return "پذیرش عادی";
    case "emergency":
      return "پذیرش اضطراری";
    case "referral":
      return "با معرفی‌نامه";
    default:
      return "نامشخص";
  }
}

function toNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function isTruthyOne(value: unknown) {
  return String(value) === "1";
}

function safeText(value: unknown, fallback = "ثبت نشده") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}
