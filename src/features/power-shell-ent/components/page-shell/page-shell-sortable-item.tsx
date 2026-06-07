"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { PageShellCard } from "./page-shell-card";
import { pageShellRegistry } from "./page-shell-registry";
import {
  getNextShellSize,
  getPreviousShellSize,
  SHELL_SIZE_CLASSES,
} from "./page-shell-defaults";
import type { PageShellModuleConfig } from "./page-shell-types";

interface PageShellSortableItemProps<TContext = any> {
  module: PageShellModuleConfig;
  context?: TContext;
  allowDrag?: boolean;
  allowResize?: boolean;
  allowHide?: boolean;
  onHide: (moduleId: string) => void;
  onResize: (moduleId: string, nextSize: PageShellModuleConfig["size"]) => void;
}

export function PageShellSortableItem<TContext = any>({
  module,
  context,
  allowDrag = true,
  allowResize = true,
  allowHide = true,
  onHide,
  onResize,
}: PageShellSortableItemProps<TContext>) {
  const definition = pageShellRegistry.resolve(module);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: module.id,
    disabled: !allowDrag || !!module.static,
  });

  if (!definition) {
    return (
      <div className={SHELL_SIZE_CLASSES[module.size]}>
        <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
          ماژول با type برابر{" "}
          <span className="font-semibold">{module.type}</span> در registry ثبت
          نشده است.
        </div>
      </div>
    );
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        SHELL_SIZE_CLASSES[module.size],
        isDragging ? "z-50" : "",
      ].join(" ")}
    >
      <PageShellCard
        title={module.title || definition.title}
        description={module.description || definition.description}
        size={module.size}
        dragging={isDragging}
        draggable={allowDrag && !module.static}
        resizable={allowResize && !module.static}
        hideable={allowHide && !module.static}
        onHide={
          allowHide && !module.static ? () => onHide(module.id) : undefined
        }
        onResizeUp={
          allowResize && !module.static
            ? () => onResize(module.id, getNextShellSize(module.size))
            : undefined
        }
        onResizeDown={
          allowResize && !module.static
            ? () => onResize(module.id, getPreviousShellSize(module.size))
            : undefined
        }
        dragHandleProps={
          allowDrag && !module.static ? { ...attributes, ...listeners } : {}
        }
      >
        {definition.render({ module, context })}
      </PageShellCard>
    </div>
  );
}
