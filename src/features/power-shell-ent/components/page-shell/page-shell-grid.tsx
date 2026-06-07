"use client";

import { useMemo } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { LayoutGrid, RotateCcw } from "lucide-react";
import { PageShellSortableItem } from "./page-shell-sortable-item";
import type { PageShellModuleConfig } from "./page-shell-types";

interface PageShellGridProps<TContext = any> {
  pageKey: string;
  modules: PageShellModuleConfig[];
  onChange: (modules: PageShellModuleConfig[]) => void;
  context?: TContext;
  allowDrag?: boolean;
  allowResize?: boolean;
  allowHide?: boolean;
  allowReset?: boolean;
  defaultModules?: PageShellModuleConfig[];
  emptyState?: React.ReactNode;
}

export function PageShellGrid<TContext = any>({
  pageKey,
  modules,
  onChange,
  context,
  allowDrag = true,
  allowResize = true,
  allowHide = true,
  allowReset = true,
  defaultModules = [],
  emptyState,
}: PageShellGridProps<TContext>) {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const normalizedModules = useMemo(
    () =>
      [...modules]
        .filter((item) => item.pageKey === pageKey)
        .sort((a, b) => a.order - b.order),
    [modules, pageKey],
  );

  const visibleModules = normalizedModules.filter((item) => !item.hidden);
  const hiddenModules = normalizedModules.filter((item) => item.hidden);

  function syncOrders(items: PageShellModuleConfig[]) {
    return items.map((item, index) => ({
      ...item,
      order: index,
    }));
  }

  function handleDragEnd(event: DragEndEvent) {
    if (!allowDrag) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = visibleModules.findIndex((item) => item.id === active.id);
    const newIndex = visibleModules.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const movedVisible = arrayMove(visibleModules, oldIndex, newIndex);

    const merged = normalizedModules.map((item) => {
      const found = movedVisible.find((m) => m.id === item.id);
      return found ?? item;
    });

    onChange(syncOrders(merged));
  }

  function handleHide(moduleId: string) {
    onChange(
      syncOrders(
        normalizedModules.map((item) =>
          item.id === moduleId ? { ...item, hidden: true } : item,
        ),
      ),
    );
  }

  function handleShow(moduleId: string) {
    onChange(
      syncOrders(
        normalizedModules.map((item) =>
          item.id === moduleId ? { ...item, hidden: false } : item,
        ),
      ),
    );
  }

  function handleResize(
    moduleId: string,
    nextSize: PageShellModuleConfig["size"],
  ) {
    onChange(
      syncOrders(
        normalizedModules.map((item) =>
          item.id === moduleId ? { ...item, size: nextSize } : item,
        ),
      ),
    );
  }

  function handleReset() {
    onChange(
      syncOrders(defaultModules.filter((item) => item.pageKey === pageKey)),
    );
  }

  if (!normalizedModules.length) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-950/40">
        {emptyState ?? (
          <>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              هیچ ماژولی برای این صفحه تعریف نشده
            </h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              برای pageKey برابر <span className="font-medium">{pageKey}</span>{" "}
              هنوز layout ثبت نشده است.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              چیدمان صفحه
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              اجزای صفحه را جابه‌جا، تغییر اندازه یا مخفی کنید.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hiddenModules.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hiddenModules.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleShow(item.id)}
                  className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  نمایش {item.title}
                </button>
              ))}
            </div>
          )}

          {allowReset && defaultModules.length > 0 ? (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <RotateCcw className="h-4 w-4" />
              بازنشانی
            </button>
          ) : null}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleModules.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
            {visibleModules.map((module) => (
              <PageShellSortableItem
                key={module.id}
                module={module}
                context={context}
                allowDrag={allowDrag}
                allowResize={allowResize}
                allowHide={allowHide}
                onHide={handleHide}
                onResize={handleResize}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
