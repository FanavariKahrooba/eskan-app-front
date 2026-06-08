/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Layers, Loader2, MapPinned, List, Search } from "lucide-react";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { fetchShelterExplorer, type Shelter } from "@/lib/shelter-explorer";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
});

type ViewMode = "list" | "map";

type RegionItem = {
  id: number | string;
  name: string;
};

type DistrictItem = {
  id: number | string;
  name: string;
};

type DetailResponse = any;

function statusLabel(status: Shelter["status"]) {
  switch (status) {
    case "active":
      return "فعال";
    case "limited":
      return "ظرفیت محدود";
    case "full":
      return "تکمیل";
    default:
      return "نامشخص";
  }
}

function statusClasses(status: Shelter["status"]) {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "limited":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "full":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-zinc-50 text-zinc-700 border-zinc-200";
  }
}

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
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);

  const [isRegionsLoading, setIsRegionsLoading] = useState(false);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [selectedHallDetails, setSelectedHallDetails] =
    useState<DetailResponse | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const debouncedSearch = useDebouncedValue(search, 350);

  const {
    data: shelters = [],
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["shelter-explorer", region, district, debouncedSearch],
    queryFn: () =>
      fetchShelterExplorer({
        region,
        district,
        q: debouncedSearch,
      }),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchRegions() {
      try {
        setIsRegionsLoading(true);
        const { data } = await axios.get("/api/regions");
        if (!mounted) return;
        setRegions(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching regions:", error);
        if (mounted) setRegions([]);
      } finally {
        if (mounted) setIsRegionsLoading(false);
      }
    }

    fetchRegions();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchDistricts() {
      if (!region) {
        setDistricts([]);
        setDistrict("");
        return;
      }

      try {
        setIsDistrictsLoading(true);
        const { data } = await axios.get("/api/districts", {
          params: { region_id: region },
        });

        if (!mounted) return;
        setDistricts(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching districts:", error);
        if (mounted) setDistricts([]);
      } finally {
        if (mounted) setIsDistrictsLoading(false);
      }
    }

    fetchDistricts();

    return () => {
      mounted = false;
    };
  }, [region]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    debouncedSearch,
    region,
    district,
    status,
    genderType,
    admissionType,
  ]);

  const filteredShelters = useMemo(() => {
    return shelters.filter((item) => {
      const statusMatch = status === "all" || item.status === status;
      const genderMatch =
        genderType === "all" || item.genderType === genderType;
      const admissionMatch =
        admissionType === "all" || item.admissionType === admissionType;

      return statusMatch && genderMatch && admissionMatch;
    });
  }, [shelters, status, genderType, admissionType]);

  const totalPages = Math.max(1, Math.ceil(filteredShelters.length / pageSize));

  const paginatedShelters = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredShelters.slice(start, end);
  }, [filteredShelters, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!selectedShelter && filteredShelters.length > 0) {
      setSelectedShelter(filteredShelters[0]);
      return;
    }

    if (
      selectedShelter &&
      !filteredShelters.some((item: any) => item.id === selectedShelter.id)
    ) {
      setSelectedShelter(filteredShelters[0] ?? null);
    }
  }, [filteredShelters, selectedShelter]);

  async function fetchHallDetails(id: number) {
    try {
      setIsDetailsLoading(true);
      const { data } = await axios.get(`/api/neighborhood-halls/${id}`);
      setSelectedHallDetails(data?.data ?? data ?? null);
    } catch (error) {
      console.error("Error fetching hall details:", error);
      setSelectedHallDetails(null);
    } finally {
      setIsDetailsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-4 rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg font-extrabold text-zinc-950 dark:text-white">
            جستجوی اسکان
          </h1>

          <div className="inline-flex rounded-2xl border border-zinc-200 p-1 dark:border-white/10">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                viewMode === "list"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              <List className="h-4 w-4" />
              لیست
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                viewMode === "map"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              <MapPinned className="h-4 w-4" />
              نقشه
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو بر اساس نام سرا"
            className="h-12 w-full rounded-2xl border border-zinc-200 bg-white pr-10 pl-4 text-sm outline-none transition focus:border-zinc-400 dark:border-white/10 dark:bg-white/5"
          />
        </div>

        <div className="grid gap-3">
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setDistrict("");
            }}
            className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
          >
            <option value="">همه مناطق</option>
            {regions.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!region || isDistrictsLoading}
            className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none disabled:opacity-60 dark:border-white/10 dark:bg-white/5"
          >
            <option value="">همه نواحی</option>
            {districts.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="limited">ظرفیت محدود</option>
            <option value="full">تکمیل</option>
          </select>

          <select
            value={genderType}
            onChange={(e) => setGenderType(e.target.value)}
            className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
          >
            <option value="all">همه گروه‌ها</option>
            <option value="men">آقایان</option>
            <option value="women">بانوان</option>
            <option value="family">خانواده</option>
            <option value="mixed">مختلط</option>
          </select>

          <select
            value={admissionType}
            onChange={(e) => setAdmissionType(e.target.value)}
            className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
          >
            <option value="all">همه پذیرش‌ها</option>
            <option value="normal">عادی</option>
            <option value="emergency">اضطراری</option>
            <option value="referral">معرفی‌نامه</option>
          </select>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
          <div className="flex items-center justify-between">
            <span>تعداد کل نتایج</span>
            <strong className="text-zinc-950 dark:text-white">
              {filteredShelters.length.toLocaleString("fa-IR")}
            </strong>
          </div>

          {viewMode === "list" && (
            <div className="mt-2 flex items-center justify-between">
              <span>صفحه فعلی</span>
              <strong className="text-zinc-950 dark:text-white">
                {currentPage.toLocaleString("fa-IR")} /{" "}
                {totalPages.toLocaleString("fa-IR")}
              </strong>
            </div>
          )}

          {isFetching && (
            <div className="mt-3 inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              در حال به‌روزرسانی نتایج...
            </div>
          )}
        </div>
      </aside>

      <section className="min-w-0">
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState />
        ) : viewMode === "list" ? (
          <ListView
            shelters={paginatedShelters}
            totalCount={filteredShelters.length}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onDetails={fetchHallDetails}
            isFetching={isFetching}
          />
        ) : (
          <MapViewComponent
            shelters={filteredShelters}
            selectedShelter={selectedShelter}
            setSelectedShelter={setSelectedShelter}
            onDetails={fetchHallDetails}
          />
        )}
      </section>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
        <Loader2 className="h-5 w-5 animate-spin" />
        در حال دریافت اطلاعات سراها...
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
      دریافت اطلاعات سراها با خطا مواجه شد.
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-6 text-sm text-zinc-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:shadow-none">
      موردی مطابق فیلترهای انتخابی پیدا نشد.
    </div>
  );
}

function ListView({
  shelters,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onDetails,
  isFetching,
}: {
  shelters: Shelter[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDetails: (id: number) => void;
  isFetching?: boolean;
}) {
  if (totalCount === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-extrabold text-zinc-950 dark:text-white">
            نتایج جستجو
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {totalCount.toLocaleString("fa-IR")} سرا مطابق فیلترهای انتخابی یافت
            شد.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Layers className="h-4 w-4" />
          )}
          <span>
            صفحه {currentPage.toLocaleString("fa-IR")} از{" "}
            {totalPages.toLocaleString("fa-IR")}
          </span>
        </div>
      </div>

      {shelters.map((shelter) => (
        <ShelterCard key={shelter.id} shelter={shelter} onDetails={onDetails} />
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
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
  return (
    <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-extrabold text-zinc-950 dark:text-white">
              {shelter.name}
            </h3>

            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses(
                shelter.status,
              )}`}
            >
              {statusLabel(shelter.status)}
            </span>
          </div>

          <div className="grid gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <p>
              <span className="font-medium">منطقه:</span> {shelter.region}
            </p>
            <p>
              <span className="font-medium">ناحیه:</span> {shelter.district}
            </p>
            <p>
              <span className="font-medium">آدرس:</span> {shelter.address}
            </p>
            <p>
              <span className="font-medium">تلفن:</span> {shelter.phone}
            </p>
            <p>
              <span className="font-medium">ظرفیت:</span>{" "}
              {shelter.freeCapacity.toLocaleString("fa-IR")} خالی /{" "}
              {shelter.totalCapacity.toLocaleString("fa-IR")} کل
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {shelter.facilities.map((facility: any) => (
              <span
                key={facility}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:bg-white/10 dark:text-zinc-300"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onDetails(shelter.id)}
            className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-zinc-900"
          >
            مشاهده جزئیات
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = buildPagination(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm disabled:opacity-50 dark:border-white/10 dark:bg-white/5"
      >
        قبلی
      </button>

      {pages.map((item: any, index: any) =>
        item === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-sm text-zinc-500 dark:text-zinc-400"
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`min-w-10 rounded-xl border px-3 py-2 text-sm ${
              item === currentPage
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                : "border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5"
            }`}
          >
            {item.toLocaleString("fa-IR")}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm disabled:opacity-50 dark:border-white/10 dark:bg-white/5"
      >
        بعدی
      </button>
    </div>
  );
}

function buildPagination(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

function MapViewComponent({
  shelters,
  selectedShelter,
  setSelectedShelter,
  onDetails,
}: {
  shelters: Shelter[];
  selectedShelter: Shelter | null;
  setSelectedShelter: (shelter: Shelter | null) => void;
  onDetails: (id: number) => void;
}) {
  if (shelters.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-zinc-950 dark:text-white">
              نمایش روی نقشه
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {shelters.length.toLocaleString("fa-IR")} موقعیت روی نقشه نمایش
              داده می‌شود.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
          <div className="flex h-[620px] items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
            اینجا کامپوننت نقشه‌ی شما قرار می‌گیرد
          </div>

          <MapView
            shelters={shelters}
            selectedShelter={selectedShelter}
            setSelectedShelter={setSelectedShelter}
            onDetails={onDetails}
          />
        </div>

        <div className="space-y-3">
          <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <h3 className="font-bold text-zinc-950 dark:text-white">
              لیست نقاط نقشه
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              با انتخاب هر مورد، marker متناظر روی نقشه فعال می‌شود.
            </p>
          </div>

          <div className="max-h-[540px] space-y-3 overflow-auto pr-1">
            {shelters.map((shelter) => {
              const isActive = selectedShelter?.id === shelter.id;

              return (
                <button
                  key={shelter.id}
                  type="button"
                  onClick={() => setSelectedShelter(shelter)}
                  className={`block w-full rounded-[20px] border p-4 text-right transition ${
                    isActive
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                      : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold">{shelter.name}</h4>
                      <p
                        className={`mt-1 text-xs ${isActive ? "text-white/80 dark:text-zinc-700" : "text-zinc-500 dark:text-zinc-400"}`}
                      >
                        {shelter.region} - {shelter.district}
                      </p>
                      <p
                        className={`mt-2 text-xs ${isActive ? "text-white/80 dark:text-zinc-700" : "text-zinc-500 dark:text-zinc-400"}`}
                      >
                        {shelter.address}
                      </p>
                    </div>

                    <span
                      className={`inline-flex rounded-full border px-2 py-1 text-[11px] ${
                        isActive
                          ? "border-white/20 bg-white/10 text-white dark:border-zinc-300 dark:bg-zinc-100 dark:text-zinc-900"
                          : statusClasses(shelter.status)
                      }`}
                    >
                      {statusLabel(shelter.status)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`text-xs ${isActive ? "text-white/80 dark:text-zinc-700" : "text-zinc-500 dark:text-zinc-400"}`}
                    >
                      خالی: {shelter.freeCapacity.toLocaleString("fa-IR")} /{" "}
                      {shelter.totalCapacity.toLocaleString("fa-IR")}
                    </span>

                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onDetails(shelter.id);
                      }}
                      className={`text-xs font-medium ${
                        isActive
                          ? "text-white dark:text-zinc-900"
                          : "text-zinc-900 dark:text-white"
                      }`}
                    >
                      جزئیات
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
